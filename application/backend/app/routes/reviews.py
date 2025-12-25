"""
reviews.py
----------
API routes for students to leave ratings/reviews on tutor listings (postings).

Contributors: Ranjiv Jithendran, Team 02
"""
from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.orm import Session
from sqlalchemy import text
from sqlalchemy.exc import IntegrityError
from pydantic import BaseModel, Field
from typing import Optional, Dict, Any

from app.db.database import get_db
from app.db.models import Posting, Message

router = APIRouter(prefix="/api/reviews", tags=["reviews"])


class ReviewCreate(BaseModel):
  """Request body for creating a review on a posting."""
  posting_id: int = Field(..., description="ID of the posting being reviewed")
  rating: int = Field(..., ge=1, le=5, description="Rating from 1 to 5")
  comment: Optional[str] = Field(None, max_length=1000, description="Optional text review")


@router.post("", status_code=status.HTTP_201_CREATED)
def create_review(
  review_data: ReviewCreate,
  student_user_id: int = Query(..., description="ID of the student leaving the review"),
  db: Session = Depends(get_db),
) -> Dict[str, Any]:
  """
  Create a new review for a posting and update its average rating.

  Flow:
  - Student must have previously contacted this posting's tutor (one-round message).
  - A new row is inserted into the legacy `reviews` table (polymorphic: target_type='posting').
  - The posting's `avg_rating` and `review_count` are recalculated from all approved reviews.

  Note: In production, `student_user_id` should come from the authenticated user/JWT.
  """
  # Verify posting exists
  posting = db.query(Posting).filter(Posting.id == review_data.posting_id).first()
  if not posting:
    raise HTTPException(
      status_code=status.HTTP_404_NOT_FOUND,
      detail="Posting not found",
    )

  # Optional guard: make sure this student has messaged the tutor about this posting
  has_message = (
    db.query(Message)
    .filter(
      Message.sender_user_id == student_user_id,
      Message.posting_id == review_data.posting_id,
    )
    .first()
  )
  if not has_message:
    raise HTTPException(
      status_code=status.HTTP_400_BAD_REQUEST,
      detail="You must contact the tutor about this posting before leaving a review.",
    )

  # Insert into legacy polymorphic `reviews` table using raw SQL to match existing schema
  insert_sql = text(
    """
    INSERT INTO reviews (reviewer_user_id, target_type, target_id, rating, comment, is_approved)
    VALUES (:student_user_id, 'posting', :posting_id, :rating, :comment, TRUE)
    """
  )
  try:
    db.execute(
      insert_sql,
      {
        "student_user_id": student_user_id,
        "posting_id": review_data.posting_id,
        "rating": review_data.rating,
        "comment": review_data.comment or "",
      },
    )
  except IntegrityError:
    # Likely hit unique constraint (one review per student per posting)
    db.rollback()
    raise HTTPException(
      status_code=status.HTTP_400_BAD_REQUEST,
      detail="You have already left a review for this listing.",
    )

  # Recalculate avg_rating and review_count for the posting
  stats_sql = text(
    """
    SELECT 
      AVG(rating) AS avg_rating,
      COUNT(*) AS review_count
    FROM reviews
    WHERE target_type = 'posting'
      AND target_id = :posting_id
      AND is_approved = TRUE
    """
  )
  row = db.execute(stats_sql, {"posting_id": review_data.posting_id}).mappings().first()
  avg_rating = float(row["avg_rating"]) if row and row["avg_rating"] is not None else None
  review_count = int(row["review_count"]) if row and row["review_count"] is not None else 0

  posting.avg_rating = avg_rating
  posting.review_count = review_count

  db.commit()
  db.refresh(posting)

  return {
    "message": "Review submitted successfully",
    "data": {
      "posting_id": posting.id,
      "avg_rating": posting.avg_rating,
      "review_count": posting.review_count,
    },
  }


