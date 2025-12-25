"""
auth.py
-------
API routes for user login and registration. Validates SFSU emails,
hashes passwords with bcrypt, and handles session management.

Contributors: Ranjiv Jithendran, Dhvanil Bhagat
"""
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from pydantic import BaseModel, EmailStr, validator
from typing import Optional, Dict, Any
from datetime import datetime

from app.db.database import get_db
from app.db.models import User
from app.services.auth import hash_password, verify_password

router = APIRouter(prefix="/api/auth", tags=["authentication"])


# Request/Response models
class UserRegistration(BaseModel):
    """User registration request model."""
    email: EmailStr
    password: str
    first_name: str
    last_name: str
    major: Optional[str] = None
    
    @validator('password')
    def validate_password(cls, v):
        if len(v) < 8:
            raise ValueError('Password must be at least 8 characters long')
        return v
    
    @validator('email')
    def validate_sfsu_email(cls, v):
        if not v.endswith('@sfsu.edu'):
            raise ValueError('Email must be a valid SFSU email (@sfsu.edu)')
        return v


class UserLogin(BaseModel):
    """User login request model."""
    email: EmailStr
    password: str


class UserResponse(BaseModel):
    """User response model (without sensitive data)."""
    id: int
    email: str
    first_name: str
    last_name: str
    major: Optional[str]
    account_status: str
    profile_photo_url: Optional[str] = None
    
    class Config:
        orm_mode = True


class ProfilePhotoUpdate(BaseModel):
    """Request model for updating profile photo URL."""
    profile_photo_url: str
    
    @validator('profile_photo_url')
    def validate_photo_size(cls, v):
        """Validate that base64 image data is not too large."""
        if not v:
            return v
        
        # Check if it's a base64 data URL
        if v.startswith('data:image'):
            # Calculate size in bytes and MB
            base64_size_bytes = len(v)
            base64_size_mb = base64_size_bytes / (1024 * 1024)
            
            # Estimate actual image size (base64 is ~33% larger)
            estimated_image_size_mb = base64_size_mb / 1.33
            
            # Limit to 5MB of base64 data (approximately 3.75MB actual image)
            # This is about 6,666,666 characters of base64
            max_length = 6_666_666
            max_size_mb = 3.75
            
            if base64_size_bytes > max_length:
                # Provide helpful error message with actual size
                raise ValueError(
                    f'Profile photo is too large ({estimated_image_size_mb:.2f}MB). '
                    f'Maximum size is {max_size_mb}MB. '
                    f'Please compress the image, resize it to a smaller resolution, or use a smaller file. '
                    f'Recommended: JPEG format, max 800x800 pixels, quality 80-85%.'
                )
            
            # Warn if image is getting close to the limit (over 2MB)
            if estimated_image_size_mb > 2.0:
                # This is just a warning, not an error
                pass  # Could add logging here if needed
        
        return v


@router.post("/register", status_code=status.HTTP_201_CREATED)
def register_user(
    user_data: UserRegistration,
    db: Session = Depends(get_db)
) -> Dict[str, Any]:
    """
    Register a new user account.
    
    **Request Body:**
    - **email**: SFSU email address (must end with @sfsu.edu)
    - **password**: Password (minimum 8 characters)
    - **first_name**: User's first name
    - **last_name**: User's last name
    - **major**: Optional major field
    
    **Returns:**
    - User object (without password hash)
    - Success message
    
    **Example Request:**
    ```json
    {
        "email": "student@sfsu.edu",
        "password": "securepass123",
        "first_name": "John",
        "last_name": "Doe",
        "major": "Computer Science"
    }
    ```
    """
    # Normalize email to lowercase for consistency
    normalized_email = user_data.email.lower()
    
    # Check if user already exists (case-insensitive)
    existing_user = db.query(User).filter(User.email == normalized_email).first()
    if existing_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email already registered"
        )
    
    # Hash password
    password_hash = hash_password(user_data.password)
    
    # Create new user with normalized email
    new_user = User(
        email=normalized_email,
        password_hash=password_hash,
        first_name=user_data.first_name,
        last_name=user_data.last_name,
        major=user_data.major,
        account_status='active'
    )
    
    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    
    return {
        "message": "User registered successfully",
        "user": UserResponse.from_orm(new_user).dict()
    }


@router.post("/login")
def login_user(
    login_data: UserLogin,
    db: Session = Depends(get_db)
) -> Dict[str, Any]:
    """
    Authenticate a user and return user information.
    
    **Request Body:**
    - **email**: User's email address
    - **password**: User's password
    
    **Returns:**
    - User object (without password hash)
    - Success message
    
    **Example Request:**
    ```json
    {
        "email": "student@sfsu.edu",
        "password": "securepass123"
    }
    ```
    """
    # Normalize email to lowercase for consistency
    normalized_email = login_data.email.lower()
    
    # Find user by email (case-insensitive)
    user = db.query(User).filter(User.email == normalized_email).first()
    
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password"
        )
    
    # Verify password
    if not user.password_hash or not verify_password(login_data.password, user.password_hash):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password"
        )
    
    # Check account status
    if user.account_status != 'active':
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail=f"Account is {user.account_status}"
        )
    
    # Update last login
    user.last_login = datetime.utcnow()
    db.commit()
    
    return {
        "message": "Login successful",
        "user": UserResponse.from_orm(user).dict()
    }


@router.patch("/users/{user_id}/profile-photo")
def update_profile_photo(
    user_id: int,
    photo_data: ProfilePhotoUpdate,
    db: Session = Depends(get_db)
) -> Dict[str, Any]:
    """
    Update a user's profile photo URL.
    
    **Path Parameters:**
    - **user_id**: ID of the user
    
    **Request Body:**
    - **profile_photo_url**: URL or base64 data URL of the profile photo
    
    **Returns:**
    - Updated user object
    - Success message
    
    **Example Request:**
    ```json
    {
        "profile_photo_url": "data:image/jpeg;base64,/9j/4AAQSkZJRg..."
    }
    ```
    """
    user = db.query(User).filter(User.id == user_id).first()
    
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found"
        )
    
    # Calculate image size for better error messages
    photo_size_bytes = len(photo_data.profile_photo_url)
    photo_size_mb = photo_size_bytes / (1024 * 1024)
    estimated_image_mb = photo_size_mb / 1.33  # Base64 is ~33% larger
    
    # Pre-check: If image is larger than 500KB base64 (~375KB actual), warn user
    # This helps catch issues before hitting database VARCHAR(512) limits
    if photo_size_bytes > 500 * 1024:  # 500KB in base64
        # Check if it's still within our reasonable limit (3.75MB)
        if photo_size_bytes <= 6_666_666:  # Within validation limit
            # Image is valid but large - this should work if column is TEXT
            pass
        else:
            # Already caught by validator, but just in case
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=(
                    f"Profile photo is too large ({estimated_image_mb:.2f}MB). "
                    f"Maximum size is 3.75MB. Please compress or resize the image."
                )
            )
    
    # Validate and update profile photo URL
    try:
        user.profile_photo_url = photo_data.profile_photo_url
        db.commit()
        db.refresh(user)
    except Exception as e:
        db.rollback()
        # Check if it's a database data too long error
        error_str = str(e).lower()
        if 'data too long' in error_str or '1406' in str(e):
            # Provide user-friendly error message with actionable advice
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=(
                    f"Profile photo is too large ({estimated_image_mb:.2f}MB). "
                    f"The image needs to be smaller. "
                    f"Please try:\n"
                    f"• Compress the image using an online tool or image editor\n"
                    f"• Resize to maximum 800x800 pixels\n"
                    f"• Use JPEG format instead of PNG\n"
                    f"• Reduce image quality to 80-85%\n"
                    f"• Maximum recommended size: 2MB"
                )
            )
        # Re-raise other exceptions
        raise
    
    return {
        "message": "Profile photo updated successfully",
        "user": UserResponse.from_orm(user).dict()
    }


class UserProfileUpdate(BaseModel):
    """Request model for updating user profile."""
    major: Optional[str] = None


class TutorProfileUpdate(BaseModel):
    """Request model for updating tutor profile."""
    bio: Optional[str] = None
    years_of_experience: Optional[int] = None
    tutoring_format: Optional[str] = None  # 'in_person', 'online', 'hybrid'
    preferred_meeting_location: Optional[str] = None


@router.get("/users/{user_id}/profile")
def get_user_profile(
    user_id: int,
    db: Session = Depends(get_db)
) -> Dict[str, Any]:
    """
    Get user profile information including User and TutorProfile data.
    
    **Path Parameters:**
    - **user_id**: ID of the user
    
    **Returns:**
    - User information (major, profile_photo_url, etc.)
    - TutorProfile information (bio, experience, etc.) if exists
    """
    user = db.query(User).filter(User.id == user_id).first()
    
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found"
        )
    
    # Get user data
    user_data = UserResponse.from_orm(user).dict()
    
    # Get tutor profile if it exists
    from app.db.models import TutorProfile
    tutor_profile = db.query(TutorProfile).filter(TutorProfile.user_id == user_id).first()
    
    tutor_data = None
    if tutor_profile:
        tutor_data = {
            "bio": tutor_profile.bio,
            "years_of_experience": tutor_profile.years_of_experience,
            "tutoring_format": tutor_profile.tutoring_format,
            "preferred_meeting_location": tutor_profile.preferred_meeting_location,
            "verification_status": tutor_profile.verification_status,
        }
    
    return {
        "user": user_data,
        "tutor_profile": tutor_data
    }


@router.patch("/users/{user_id}/profile")
def update_user_profile(
    user_id: int,
    profile_data: UserProfileUpdate,
    db: Session = Depends(get_db)
) -> Dict[str, Any]:
    """
    Update user profile information (major, etc.).
    
    **Path Parameters:**
    - **user_id**: ID of the user
    
    **Request Body:**
    - **major**: Optional major field
    
    **Returns:**
    - Updated user object
    """
    user = db.query(User).filter(User.id == user_id).first()
    
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found"
        )
    
    # Update user fields
    if profile_data.major is not None:
        user.major = profile_data.major
    
    db.commit()
    db.refresh(user)
    
    return {
        "message": "User profile updated successfully",
        "user": UserResponse.from_orm(user).dict()
    }


@router.patch("/users/{user_id}/tutor-profile")
def update_tutor_profile(
    user_id: int,
    tutor_data: TutorProfileUpdate,
    db: Session = Depends(get_db)
) -> Dict[str, Any]:
    """
    Update or create tutor profile information.
    
    **Path Parameters:**
    - **user_id**: ID of the user
    
    **Request Body:**
    - **bio**: Optional bio text
    - **years_of_experience**: Optional years of experience
    - **tutoring_format**: Optional format ('in_person', 'online', 'hybrid')
    - **preferred_meeting_location**: Optional meeting location
    
    **Returns:**
    - Updated tutor profile object
    """
    from app.db.models import TutorProfile
    
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found"
        )
    
    # Get or create tutor profile
    tutor_profile = db.query(TutorProfile).filter(TutorProfile.user_id == user_id).first()
    
    if not tutor_profile:
        # Create new tutor profile
        tutor_profile = TutorProfile(
            user_id=user_id,
            bio=tutor_data.bio,
            years_of_experience=tutor_data.years_of_experience,
            tutoring_format=tutor_data.tutoring_format or 'hybrid',
            preferred_meeting_location=tutor_data.preferred_meeting_location,
            verification_status='pending'
        )
        db.add(tutor_profile)
    else:
        # Update existing tutor profile
        if tutor_data.bio is not None:
            tutor_profile.bio = tutor_data.bio
        if tutor_data.years_of_experience is not None:
            tutor_profile.years_of_experience = tutor_data.years_of_experience
        if tutor_data.tutoring_format is not None:
            tutor_profile.tutoring_format = tutor_data.tutoring_format
        if tutor_data.preferred_meeting_location is not None:
            tutor_profile.preferred_meeting_location = tutor_data.preferred_meeting_location
    
    db.commit()
    db.refresh(tutor_profile)
    
    return {
        "message": "Tutor profile updated successfully",
        "tutor_profile": {
            "bio": tutor_profile.bio,
            "years_of_experience": tutor_profile.years_of_experience,
            "tutoring_format": tutor_profile.tutoring_format,
            "preferred_meeting_location": tutor_profile.preferred_meeting_location,
            "verification_status": tutor_profile.verification_status,
        }
    }

