"""
courses.py
----------
API routes for listing SFSU courses for use in posting forms and search.

Contributors: Ranjiv Jithendran, Team 02
"""
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from typing import Dict, Any

from app.db.database import get_db
from app.db.models import Course

router = APIRouter(prefix="/api/courses", tags=["courses"])


@router.get("")
def get_courses(
    db: Session = Depends(get_db),
) -> Dict[str, Any]:
    """
    Get all SFSU courses for dropdowns.

    Returns:
        - **count**: Total number of courses
        - **courses**: List of course objects with:
            - **id**: Course ID
            - **department**: Department code (e.g., CSC)
            - **course_number**: Course number (e.g., 648)
            - **title**: Course title
            - **code**: Combined code (e.g., "CSC 648")
    """
    courses = (
        db.query(Course)
        .order_by(Course.department.asc(), Course.course_number.asc())
        .all()
    )

    result = [
        {
            "id": course.id,
            "department": course.department,
            "course_number": course.course_number,
            "title": course.title,
            "code": course.course_code,
        }
        for course in courses
    ]

    return {
        "count": len(result),
        "courses": result,
    }


