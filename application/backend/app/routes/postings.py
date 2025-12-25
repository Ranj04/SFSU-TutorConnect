"""
postings.py
-----------
API routes for creating and managing tutor postings. Handles CRUD
operations for postings and admin approval workflows.

Contributors: Ranjiv Jithendran, Dhvanil Bhagat
"""
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from pydantic import BaseModel, validator
from typing import Optional, List
from datetime import datetime

from app.db.database import get_db
from app.db.models import Posting, User, Course

router = APIRouter(prefix="/api/postings", tags=["postings"])


# Request/Response models
class PostingCreate(BaseModel):
    """Posting creation request model."""
    user_id: int
    course_id: Optional[int] = None  # Optional, will use default if not provided
    title: str
    description: str  # This is the bio from frontend
    subjects: Optional[List[str]] = []  # Frontend subjects, stored in description
    rate: Optional[float] = None  # Frontend rate, stored in description
    availability: Optional[List[str]] = []  # Frontend availability slots
    availability_notes: Optional[str] = None
    
    @validator('title')
    def validate_title(cls, v):
        if not v or len(v.strip()) < 3:
            raise ValueError('Title must be at least 3 characters long')
        if len(v) > 255:
            raise ValueError('Title must be less than 255 characters')
        return v.strip()


class PostingResponse(BaseModel):
    """Posting response model."""
    id: int
    user_id: int
    course_id: int
    title: str
    description: str
    status: str
    rejection_reason: Optional[str]
    availability_notes: Optional[str]
    avg_rating: Optional[float]
    review_count: int
    created_at: datetime
    updated_at: datetime
    # Include user info
    user_name: Optional[str] = None
    user_email: Optional[str] = None
    
    class Config:
        orm_mode = True


@router.post("", status_code=status.HTTP_201_CREATED)
def create_posting(
    posting_data: PostingCreate,
    db: Session = Depends(get_db)
) -> PostingResponse:
    """
    Create a new tutor posting.
    
    **Request Body:**
    - **user_id**: ID of the user creating the posting
    - **course_id**: Optional ID of the course to tutor
    - **title**: Posting title (min 3 characters)
    - **description**: Detailed description (bio)
    - **subjects**: List of subject names
    - **rate**: Optional hourly rate
    - **availability**: List of availability time slots
    - **availability_notes**: Optional availability information
    
    **Returns:**
    - Posting object with status 'pending'
    """
    # Verify user exists
    user = db.query(User).filter(User.id == posting_data.user_id).first()
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found"
        )
    
    # If course_id provided, verify it exists, otherwise use first course as default
    course_id = posting_data.course_id
    if course_id:
        course = db.query(Course).filter(Course.id == course_id).first()
        if not course:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Course not found"
            )
    else:
        # Use first course as default since course_id is required in DB
        default_course = db.query(Course).first()
        if not default_course:
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail="No courses available in database"
            )
        course_id = default_course.id
    
    # Build enhanced description with rate and subjects if provided
    description_parts = [posting_data.description]
    
    if posting_data.rate:
        description_parts.append(f"\n\n**Rate:** ${posting_data.rate}/hour")
    
    if posting_data.subjects:
        subjects_str = ", ".join(posting_data.subjects)
        description_parts.append(f"\n**Subjects:** {subjects_str}")
    
    enhanced_description = "\n".join(description_parts)
    
    # Build availability notes from availability slots
    availability_notes = posting_data.availability_notes
    if posting_data.availability:
        avail_str = ", ".join(posting_data.availability)
        availability_notes = avail_str if not availability_notes else f"{availability_notes}. {avail_str}"
    
    # Create new posting
    new_posting = Posting(
        user_id=posting_data.user_id,
        course_id=course_id,
        title=posting_data.title,
        description=enhanced_description,
        availability_notes=availability_notes,
        status='pending'
    )
    
    db.add(new_posting)
    db.commit()
    db.refresh(new_posting)
    
    return PostingResponse.from_orm(new_posting).dict()


@router.get("")
def get_postings(
    status_filter: Optional[str] = None,
    user_id: Optional[int] = None,
    db: Session = Depends(get_db)
) -> List[PostingResponse]:
    """
    Get postings with optional filters.
    
    **Query Parameters:**
    - **status**: Filter by status ('pending', 'approved', 'rejected')
    - **user_id**: Filter by user ID
    
    **Returns:**
    - List of postings
    """
    query = db.query(Posting)
    
    if status_filter:
        if status_filter not in ['pending', 'approved', 'rejected']:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Invalid status. Must be 'pending', 'approved', or 'rejected'"
            )
        query = query.filter(Posting.status == status_filter)
    
    if user_id:
        query = query.filter(Posting.user_id == user_id)
    
    postings = query.order_by(Posting.created_at.desc()).all()
    result = []
    for p in postings:
        posting_dict = PostingResponse.from_orm(p).dict()
        # Add user info
        user = db.query(User).filter(User.id == p.user_id).first()
        if user:
            posting_dict['user_name'] = f"{user.first_name} {user.last_name}"
            posting_dict['user_email'] = user.email
            posting_dict['profile_photo_url'] = user.profile_photo_url
        result.append(posting_dict)
    return result


@router.get("/{posting_id}")
def get_posting(
    posting_id: int,
    db: Session = Depends(get_db)
) -> PostingResponse:
    """
    Get a single posting by ID with user information.
    """
    posting = db.query(Posting).filter(Posting.id == posting_id).first()
    
    if not posting:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Posting not found"
        )
    
    # Get user information
    user = db.query(User).filter(User.id == posting.user_id).first()
    
    # Convert to dict and add user info
    response_data = PostingResponse.from_orm(posting).dict()
    if user:
        response_data['user_name'] = f"{user.first_name} {user.last_name}"
        response_data['user_email'] = user.email
        response_data['profile_photo_url'] = user.profile_photo_url
    
    return response_data


@router.patch("/{posting_id}/status")
def update_posting_status(
    posting_id: int,
    new_status: str,
    rejection_reason: Optional[str] = None,
    db: Session = Depends(get_db)
):
    """
    Update posting status (admin only).
    
    **Path Parameters:**
    - **posting_id**: ID of the posting
    
    **Query Parameters:**
    - **new_status**: New status ('approved' or 'rejected')
    - **rejection_reason**: Optional rejection reason
    """
    # TODO: Add admin authentication check
    
    if new_status not in ['approved', 'rejected']:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Status must be 'approved' or 'rejected'"
        )
    
    posting = db.query(Posting).filter(Posting.id == posting_id).first()
    
    if not posting:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Posting not found"
        )
    
    posting.status = new_status
    if rejection_reason:
        posting.rejection_reason = rejection_reason
    
    db.commit()
    db.refresh(posting)
    
    return PostingResponse.from_orm(posting).dict()

