"""
messaging.py
------------
API routes for tutor-student messaging. This is a one-way system where
students send initial contact messages to tutors about specific postings.
Tutors can view messages but replies happen externally via email or phone.

Contributors: Ranjiv Jithendran, Dhvanil Bhagat
"""
from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.orm import Session
from sqlalchemy import or_, and_
from sqlalchemy.exc import IntegrityError
from pydantic import BaseModel, Field
from typing import Optional, List, Dict, Any
from datetime import datetime

from app.db.database import get_db
from app.db.models import Message, User, Posting
from app.dependencies import get_current_user

router = APIRouter(prefix="/api/messages", tags=["messaging"])


# Request/Response models
class MessageCreate(BaseModel):
    """
    Message creation request model for ONE-WAY messaging.
    Students send messages to tutors about specific postings.
    """
    recipient_user_id: int = Field(..., description="ID of the tutor (message recipient)")
    posting_id: Optional[int] = Field(None, description="ID of the posting being inquired about")
    message_text: str = Field(..., min_length=1, max_length=2000, description="Message content")
    contact_info: str = Field("", max_length=255, description="Student's contact info (email/phone)")


class MessageResponse(BaseModel):
    """Message response model."""
    id: int
    sender_user_id: int
    recipient_user_id: int
    posting_id: Optional[int]
    posting_title_snapshot: Optional[str]
    message_text: str
    contact_info: str
    connection_status: str
    sent_at: datetime
    is_read: bool
    sender_name: str
    recipient_name: str
    
    class Config:
        orm_mode = True


@router.post("", status_code=status.HTTP_201_CREATED)
def send_message(
    message_data: MessageCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
) -> Dict[str, Any]:
    """
    Send a new message from a student to a tutor (ONE-WAY).
    
    This is the initial contact message. Students can send one message per tutor/posting.
    Follow-up communication happens externally (email/phone).
    
    **Query Parameters:**
    - **sender_user_id**: ID of the student sending the message (for M3, passed as query param; in production, use JWT/auth)
    
    **Request Body:**
    - **recipient_user_id**: ID of the tutor (message recipient)
    - **posting_id**: Optional posting ID (recommended to provide context)
    - **message_text**: Message content (1-2000 chars)
    - **contact_info**: Student's contact info (email/phone)
    
    **Returns:**
    - Created message object with status 'pending'
    
    **Note:** In production, sender_user_id should come from authenticated session/JWT token.
    """
    # Sender is the authenticated user (never trust a client-supplied id)
    sender = current_user
    sender_user_id = current_user.id

    # Verify recipient exists
    recipient = db.query(User).filter(User.id == message_data.recipient_user_id).first()
    if not recipient:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Recipient user not found"
        )
    
    # Get posting info if provided
    posting_title = None
    if message_data.posting_id:
        posting = db.query(Posting).filter(Posting.id == message_data.posting_id).first()
        if posting:
            posting_title = posting.title
    
    # Enforce one initial message per (student, tutor, posting), matching the
    # documented per-posting model. The check-then-insert has a small TOCTOU
    # window, so the commit is additionally guarded with IntegrityError handling.
    existing_message = db.query(Message).filter(
        Message.sender_user_id == sender_user_id,
        Message.recipient_user_id == message_data.recipient_user_id,
        Message.posting_id == message_data.posting_id,
    ).first()

    if existing_message:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="You have already sent a message about this posting. Please wait for them to respond via email/phone."
        )

    # Create message
    new_message = Message(
        sender_user_id=sender_user_id,
        recipient_user_id=message_data.recipient_user_id,
        posting_id=message_data.posting_id,
        posting_title_snapshot=posting_title,
        message_text=message_data.message_text,
        contact_info=message_data.contact_info or sender.email,
        connection_status='pending',
        is_read=False
    )

    db.add(new_message)
    try:
        db.commit()
    except IntegrityError:
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="You have already sent a message about this posting."
        )
    db.refresh(new_message)
    
    return {
        "message": "Message sent successfully",
        "data": {
            "id": new_message.id,
            "sender_user_id": new_message.sender_user_id,
            "recipient_user_id": new_message.recipient_user_id,
            "posting_id": new_message.posting_id,
            "posting_title_snapshot": new_message.posting_title_snapshot,
            "message_text": new_message.message_text,
            "contact_info": new_message.contact_info,
            "connection_status": new_message.connection_status,
            "sent_at": new_message.sent_at,
            "is_read": new_message.is_read,
            "sender_name": sender.full_name,
            "recipient_name": recipient.full_name
        }
    }


@router.get("/conversations")
def get_conversations(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
) -> Dict[str, Any]:
    """
    Get all conversations for a user (messages where user is sender or recipient).
    
    For students: Shows tutors they've contacted
    For tutors: Shows students who've contacted them
    
    **Query Parameters:**
    - **user_id**: ID of the user to get conversations for
    
    **Returns:**
    - List of conversations with other users, including last message preview and posting info
    
    """
    user = current_user
    user_id = current_user.id

    # Get all messages where user is sender or recipient
    messages = db.query(Message).filter(
        or_(
            Message.sender_user_id == user_id,
            Message.recipient_user_id == user_id
        )
    ).order_by(Message.sent_at.desc()).all()
    
    # Batch-fetch all conversation partners in a single query (avoid N+1).
    partner_ids = {
        (msg.recipient_user_id if msg.sender_user_id == user_id else msg.sender_user_id)
        for msg in messages
    }
    partners_by_id = {}
    if partner_ids:
        for u in db.query(User).filter(User.id.in_(partner_ids)).all():
            partners_by_id[u.id] = u

    # Group by conversation partner AND posting (separate conversations per posting)
    conversations = {}
    for msg in messages:
        # Determine conversation partner
        if msg.sender_user_id == user_id:
            partner_id = msg.recipient_user_id
        else:
            partner_id = msg.sender_user_id

        # Create unique key for partner + posting combination
        conversation_key = f"{partner_id}_{msg.posting_id if msg.posting_id else 'general'}"

        # Get or create conversation entry (only keep most recent per posting)
        if conversation_key not in conversations:
            partner = partners_by_id.get(partner_id)
            conversations[conversation_key] = {
                "message_id": msg.id,
                "conversation_key": conversation_key,
                "partner_id": partner_id,
                "partner_name": partner.full_name if partner else "Unknown",
                "partner_email": partner.email if partner else None,
                "posting_id": msg.posting_id,
                "posting_title": msg.posting_title_snapshot,
                "last_message": msg.message_text[:100] + "..." if len(msg.message_text) > 100 else msg.message_text,
                "last_message_time": msg.sent_at,
                "connection_status": msg.connection_status,
                "is_read": msg.is_read,
                "is_sender": msg.sender_user_id == user_id,
                "contact_info": msg.contact_info
            }
    
    return {
        "count": len(conversations),
        "conversations": list(conversations.values())
    }


@router.get("/connection-requests")
def get_connection_requests(
    type: str = Query("incoming", description="Type of requests: 'incoming' (received) or 'sent' (sent by user)"),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
) -> Dict[str, Any]:
    """
    Get connection requests for a user (incoming or sent).
    
    **Query Parameters:**
    - **user_id**: ID of the user
    - **type**: 'incoming' (requests received) or 'sent' (requests sent)
    
    **Returns:**
    - List of connection requests with full details
    
    """
    user = current_user
    user_id = current_user.id

    # Build query based on type
    if type == "incoming":
        # Messages where user is recipient
        messages = db.query(Message).filter(
            Message.recipient_user_id == user_id
        ).order_by(Message.sent_at.desc()).all()
    elif type == "sent":
        # Messages where user is sender
        messages = db.query(Message).filter(
            Message.sender_user_id == user_id
        ).order_by(Message.sent_at.desc()).all()
    else:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Type must be 'incoming' or 'sent'"
        )
    
    # Batch-fetch all senders/recipients in a single query (avoid N+1).
    person_ids = set()
    for msg in messages:
        person_ids.add(msg.sender_user_id)
        person_ids.add(msg.recipient_user_id)
    people_by_id = {}
    if person_ids:
        for u in db.query(User).filter(User.id.in_(person_ids)).all():
            people_by_id[u.id] = u

    # Format messages
    requests = []
    for msg in messages:
        sender = people_by_id.get(msg.sender_user_id)
        recipient = people_by_id.get(msg.recipient_user_id)

        requests.append({
            "id": msg.id,
            "sender_user_id": msg.sender_user_id,
            "recipient_user_id": msg.recipient_user_id,
            "sender_name": sender.full_name if sender else "Unknown",
            "recipient_name": recipient.full_name if recipient else "Unknown",
            "sender_email": sender.email if sender else None,
            "recipient_email": recipient.email if recipient else None,
            "posting_id": msg.posting_id,
            "posting_title": msg.posting_title_snapshot,
            "message_text": msg.message_text,
            "contact_info": msg.contact_info,
            "connection_status": msg.connection_status,
            "sent_at": msg.sent_at,
            "is_read": msg.is_read
        })
    
    return {
        "count": len(requests),
        "requests": requests
    }


@router.get("/thread")
def get_message_thread(
    other_user_id: int = Query(..., description="ID of the conversation partner"),
    posting_id: Optional[int] = Query(None, description="Optional posting ID to filter conversation"),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
) -> Dict[str, Any]:
    """
    Get message between two users for a specific posting (ONE-WAY system: only one message per pair per posting).
    
    In this one-round messaging system per posting, there should only be one message
    from student to tutor about each posting. This endpoint returns that single message.
    
    **Query Parameters:**
    - **user_id**: ID of the current user
    - **other_user_id**: ID of the conversation partner
    - **posting_id**: Optional posting ID to filter by specific posting conversation
    
    **Returns:**
    - The single message in the conversation (if any)
    
    """
    user = current_user
    user_id = current_user.id

    other_user = db.query(User).filter(User.id == other_user_id).first()

    if not other_user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found"
        )
    
    # Build query for messages between the two users
    query = db.query(Message).filter(
        or_(
            and_(Message.sender_user_id == user_id, Message.recipient_user_id == other_user_id),
            and_(Message.sender_user_id == other_user_id, Message.recipient_user_id == user_id)
        )
    )
    
    # Filter by posting_id if provided
    if posting_id is not None:
        query = query.filter(Message.posting_id == posting_id)
    
    # Get the most recent message
    message = query.order_by(Message.sent_at.desc()).first()
    
    if not message:
        return {
            "message": None
        }
    
    # Format message
    sender = db.query(User).filter(User.id == message.sender_user_id).first()
    recipient = db.query(User).filter(User.id == message.recipient_user_id).first()
    
    return {
        "message": {
            "id": message.id,
            "sender_user_id": message.sender_user_id,
            "recipient_user_id": message.recipient_user_id,
            "posting_id": message.posting_id,
            "posting_title_snapshot": message.posting_title_snapshot,
            "message_text": message.message_text,
            "contact_info": message.contact_info,
            "connection_status": message.connection_status,
            "sent_at": message.sent_at,
            "is_read": message.is_read,
            "sender_name": sender.full_name if sender else "Unknown",
            "recipient_name": recipient.full_name if recipient else "Unknown"
        }
    }


@router.patch("/{message_id}/read", status_code=status.HTTP_200_OK)
def mark_message_read(
    message_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
) -> Dict[str, Any]:
    """
    Mark a message as read (tutor viewing student's message).
    
    Only the recipient can mark a message as read.
    
    **Path Parameters:**
    - **message_id**: ID of the message to mark as read
    
    **Query Parameters:**
    - **user_id**: ID of the user (must be the recipient)
    
    **Returns:**
    - Updated message object
    
    **Note:** In production, user_id should come from authenticated session/JWT token.
    """
    # Get the message
    message = db.query(Message).filter(Message.id == message_id).first()
    if not message:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Message not found"
        )

    # Verify user is the recipient
    if message.recipient_user_id != current_user.id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Only the message recipient can mark it as read"
        )

    # Update message
    message.is_read = True
    db.commit()
    db.refresh(message)
    
    return {
        "message": "Message marked as read",
        "data": {
            "id": message.id,
            "is_read": message.is_read
        }
    }


@router.patch("/{message_id}/accept", status_code=status.HTTP_200_OK)
def accept_connection_request(
    message_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
) -> Dict[str, Any]:
    """
    Accept a connection request (tutor accepting student's message).
    
    Only the recipient can accept a connection request.
    
    **Path Parameters:**
    - **message_id**: ID of the message/connection request to accept
    
    **Query Parameters:**
    - **user_id**: ID of the user (must be the recipient)
    
    **Returns:**
    - Updated message object with connection_status='accepted'
    
    **Note:** In production, user_id should come from authenticated session/JWT token.
    """
    # Get the message
    message = db.query(Message).filter(Message.id == message_id).first()
    if not message:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Message not found"
        )
    
    # Verify user is the recipient
    if message.recipient_user_id != current_user.id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Only the message recipient can accept the connection request"
        )

    # Update message
    message.connection_status = 'accepted'
    message.is_read = True
    db.commit()
    db.refresh(message)
    
    sender = db.query(User).filter(User.id == message.sender_user_id).first()
    recipient = db.query(User).filter(User.id == message.recipient_user_id).first()
    
    return {
        "message": "Connection request accepted",
        "data": {
            "id": message.id,
            "connection_status": message.connection_status,
            "sender_name": sender.full_name if sender else "Unknown",
            "recipient_name": recipient.full_name if recipient else "Unknown"
        }
    }


@router.patch("/{message_id}/decline", status_code=status.HTTP_200_OK)
def decline_connection_request(
    message_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
) -> Dict[str, Any]:
    """
    Decline a connection request (tutor declining student's message).
    
    Only the recipient can decline a connection request.
    
    **Path Parameters:**
    - **message_id**: ID of the message/connection request to decline
    
    **Query Parameters:**
    - **user_id**: ID of the user (must be the recipient)
    
    **Returns:**
    - Updated message object with connection_status='declined'
    
    **Note:** In production, user_id should come from authenticated session/JWT token.
    """
    # Get the message
    message = db.query(Message).filter(Message.id == message_id).first()
    if not message:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Message not found"
        )
    
    # Verify user is the recipient
    if message.recipient_user_id != current_user.id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Only the message recipient can decline the connection request"
        )

    # Update message
    message.connection_status = 'declined'
    message.is_read = True
    db.commit()
    db.refresh(message)
    
    sender = db.query(User).filter(User.id == message.sender_user_id).first()
    recipient = db.query(User).filter(User.id == message.recipient_user_id).first()
    
    return {
        "message": "Connection request declined",
        "data": {
            "id": message.id,
            "connection_status": message.connection_status,
            "sender_name": sender.full_name if sender else "Unknown",
            "recipient_name": recipient.full_name if recipient else "Unknown"
        }
    }
