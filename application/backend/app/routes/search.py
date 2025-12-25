"""
search.py
---------
API routes for searching tutors by subject, course, and keyword.
Returns paginated results of approved tutor postings.

Contributors: Ranjiv Jithendran, Bao Than
"""
from fastapi import APIRouter, Depends, Query, HTTPException
from sqlalchemy.orm import Session
from typing import Optional, List, Dict, Any

from app.db.database import get_db
from app.services.search import search_tutors, get_all_subjects

router = APIRouter(prefix="/api", tags=["search"])


@router.get("/search")
def search_tutor_endpoint(
    category: Optional[str] = Query(
        default="All",
        description="Subject slug to filter by (e.g., 'computer-science') or 'All' for no filter"
    ),
    q: Optional[str] = Query(
        default=None,
        description="Search text for tutor bio, course titles, and course descriptions"
    ),
    page: int = Query(
        default=1,
        ge=1,
        description="Page number (1-indexed)"
    ),
    limit: int = Query(
        default=10,
        ge=1,
        le=50,
        description="Results per page (max 50)"
    ),
    db: Session = Depends(get_db)
) -> Dict[str, Any]:
    """
    Search for tutors with optional subject category and text filters.
    
    **Query Parameters:**
    - **category**: Subject slug (e.g., 'computer-science', 'mathematics') or 'All' (default)
    - **q**: Search keyword to match in tutor bio, course titles, or descriptions (max 200 chars)
    - **page**: Page number (1-indexed, default 1)
    - **limit**: Results per page (1-50, default 10)
    
    **Returns:**
    - **count**: Number of results in current page
    - **total**: Total number of results across all pages
    - **page**: Current page number
    - **limit**: Results per page
    - **results**: List of tutor profiles with details
    
    **Example Requests:**
    - `GET /api/search` - Get all approved tutors (page 1)
    - `GET /api/search?page=2&limit=5` - Get page 2 with 5 results per page
    - `GET /api/search?category=computer-science` - Get CS tutors
    - `GET /api/search?q=recursion` - Search for "recursion"
    - `GET /api/search?category=computer-science&q=TA&page=1&limit=20` - CS tutors mentioning "TA"
    """
    # Validate search query: max 40 chars, alphanumeric + spaces only (matches frontend)
    if q:
        q_trimmed = q.strip()
        if len(q_trimmed) > 40:
            raise HTTPException(
                status_code=400,
                detail="Search query must be 40 characters or less"
            )
        # Validate alphanumeric + spaces only
        import re
        if not re.match(r'^[A-Za-z0-9\s]+$', q_trimmed):
            raise HTTPException(
                status_code=400,
                detail="Search query can only contain letters, numbers, and spaces"
            )
    
    # Validate category exists (if not "All")
    if category and category.lower() != "all":
        valid_subjects = get_all_subjects(db)
        valid_slugs = {subject["slug"] for subject in valid_subjects}
        if category not in valid_slugs:
            raise HTTPException(
                status_code=400,
                detail=f"Invalid category '{category}'. Must be one of: {', '.join(sorted(valid_slugs))} or 'All'"
            )
    
    # Perform search with pagination
    results, total = search_tutors(
        db, 
        category=category, 
        search_query=q,
        page=page,
        limit=limit
    )
    
    return {
        "count": len(results),
        "total": total,
        "page": page,
        "limit": limit,
        "results": results
    }


@router.get("/subjects")
def get_subjects_endpoint(
    db: Session = Depends(get_db)
) -> Dict[str, Any]:
    """
    Get all available subjects for the category dropdown.
    
    **Returns:**
    - **count**: Total number of subjects
    - **subjects**: List of subject objects with name and slug
    
    **Example Response:**
    ```json
    {
        "count": 5,
        "subjects": [
            {"name": "Computer Science", "slug": "computer-science"},
            {"name": "Mathematics", "slug": "mathematics"}
        ]
    }
    ```
    """
    subjects = get_all_subjects(db)
    
    return {
        "count": len(subjects),
        "subjects": subjects
    }


@router.get("/categories")
def get_categories_endpoint(
    db: Session = Depends(get_db)
) -> Dict[str, Any]:
    """
    Get all available categories (alias for subjects endpoint).
    Frontend-friendly endpoint for category dropdown.
    
    **Returns:**
    - **count**: Total number of categories
    - **categories**: List of category objects with name and slug
    
    **Example Response:**
    ```json
    {
        "count": 5,
        "categories": [
            {"name": "Computer Science", "slug": "computer-science"},
            {"name": "Mathematics", "slug": "mathematics"}
        ]
    }
    ```
    """
    subjects = get_all_subjects(db)
    
    return {
        "count": len(subjects),
        "categories": subjects
    }
