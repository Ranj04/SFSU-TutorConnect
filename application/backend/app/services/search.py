"""
search.py
---------
Service for searching tutors. Handles subject filtering and text search
queries against the database. Searches approved postings.

Contributors: Ranjiv Jithendran, Bao Than
"""
from sqlalchemy.orm import Session, joinedload
from sqlalchemy import or_, and_, func
from typing import List, Optional, Dict, Any

from app.db.models import Posting, User, Subject, Course


def search_tutors(
    db: Session,
    category: Optional[str] = None,
    search_query: Optional[str] = None,
    page: int = 1,
    limit: int = 10
) -> tuple[List[Dict[str, Any]], int]:
    """
    Search for approved postings with optional subject category and text filters.
    If no filters provided, returns all approved postings.
    
    Args:
        db: Database session
        category: Subject slug to filter by (e.g., 'computer-science'), or 'All' for no filter
        search_query: Text to search in posting title, description, course titles, and course descriptions (SQL LIKE)
        page: Page number (1-indexed)
        limit: Results per page
    
    Returns:
        Tuple of (list of posting dictionaries, total count)
    """
    # Defense in depth: clamp paging so a caller that forwards unbounded values
    # can never request an enormous page or a non-positive page number.
    page = max(1, page)
    limit = max(1, min(limit, 50))

    # Base query: only approved postings with eager loading
    query = db.query(Posting).filter(
        Posting.status == 'approved'
    ).join(Posting.user).join(Posting.course).outerjoin(Subject, Course.subject_id == Subject.id).options(
        joinedload(Posting.user),
        joinedload(Posting.course).joinedload(Course.subject)
    )
    
    # Apply subject category filter via course's subject_id
    if category and category.lower() != 'all':
        query = query.filter(Subject.slug == category)
    
    # Apply text search filter using SQL LIKE (case-insensitive)
    if search_query and search_query.strip():
        search_query_clean = search_query.strip()
        search_term = f"%{search_query_clean}%"
        
        # Split search query into words for flexible matching
        search_words = search_query_clean.split()
        
        # Build search conditions
        conditions = []
        
        # Exact phrase matching (for text fields)
        conditions.extend([
            User.first_name.like(search_term),
            User.last_name.like(search_term),
            Posting.title.like(search_term),
            Posting.description.like(search_term),
            Course.title.like(search_term),
            Course.description.like(search_term),
            Course.department.like(search_term),
            Course.course_number.like(search_term)
        ])
        
        # Match concatenated full name (e.g., "John Doe" matches first_name + last_name)
        full_name_match = func.concat(User.first_name, ' ', User.last_name).like(search_term)
        conditions.append(full_name_match)
        
        # Match concatenated course code (e.g., "CSC 220" matches department + course_number)
        course_code_match = func.concat(Course.department, ' ', Course.course_number).like(search_term)
        conditions.append(course_code_match)
        
        # Individual word matching (for multi-word queries like "CSC 220" or "John Doe")
        if len(search_words) > 1:
            word_conditions = []
            for word in search_words:
                word_term = f"%{word}%"
                word_conditions.append(
                    or_(
                        User.first_name.like(word_term),
                        User.last_name.like(word_term),
                        Posting.title.like(word_term),
                        Posting.description.like(word_term),
                        Course.department.like(word_term),
                        Course.course_number.like(word_term),
                        Course.title.like(word_term),
                        Course.description.like(word_term)
                    )
                )
            # All words must match (AND condition)
            conditions.append(and_(*word_conditions))
        else:
            # Single word: check individual fields
            conditions.extend([
                User.first_name.like(search_term),
                User.last_name.like(search_term),
                Posting.title.like(search_term),
                Posting.description.like(search_term),
                Course.department.like(search_term),
                Course.course_number.like(search_term)
            ])
        
        # Search in posting title, description, user names, course codes, titles, and descriptions
        query = query.filter(or_(*conditions))
    
    # Get total count before pagination
    total_count = query.distinct().count()
    
    # Apply pagination
    offset = (page - 1) * limit
    postings = query.distinct().offset(offset).limit(limit).all()
    
    # Format results
    results = []
    for posting in postings:
        # Get course info
        course = posting.course
        course_code = f"{course.department} {course.course_number}" if course else ""
        
        # Get subject from course
        subjects = []
        if course and hasattr(course, 'subject') and course.subject:
            subjects = [course.subject.name]
        elif course and course.subject_id:
            subject = db.query(Subject).filter(Subject.id == course.subject_id).first()
            if subject:
                subjects = [subject.name]
        
        # Build result dictionary
        result = {
            "id": posting.id,
            "name": posting.user.full_name,
            "bio": posting.description,
            "title": posting.title,
            "subjects": subjects,
            "courses": [course_code] if course_code else [],
            "avg_rating": float(posting.avg_rating) if posting.avg_rating else None,
            "review_count": posting.review_count,
            "user_id": posting.user_id,
            "course_id": posting.course_id,
            "availability_notes": posting.availability_notes,
            "profile_photo_url": posting.user.profile_photo_url,
        }
        results.append(result)
    
    return results, total_count


def get_all_subjects(db: Session) -> List[Dict[str, str]]:
    """
    Get all subjects for the category dropdown.
    
    Args:
        db: Database session
    
    Returns:
        List of subject dictionaries with name and slug
    """
    subjects = db.query(Subject).order_by(Subject.name).all()
    return [
        {
            "name": subject.name,
            "slug": subject.slug
        }
        for subject in subjects
    ]

