"""
models.py
---------
SQLAlchemy ORM models for the TutorConnect database. Defines the schema
for users, postings, messages, courses, subjects, and related tables.

Contributors: Ranjiv Jithendran, Dhvanil Bhagat
"""
from sqlalchemy import (
    BigInteger, Boolean, Column, DateTime, Enum, ForeignKey,
    Integer, String, Text, DECIMAL, CheckConstraint, Index
)
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from datetime import datetime
from typing import List

from app.db.database import Base


class User(Base):
    """User model representing users table."""
    __tablename__ = "users"
    
    id = Column(BigInteger, primary_key=True, autoincrement=True)
    email = Column(String(255), nullable=False, unique=True)
    password_hash = Column(String(255), nullable=True)
    first_name = Column(String(50), nullable=False)
    last_name = Column(String(50), nullable=False)
    profile_photo_url = Column(Text, nullable=True)  # Changed from String(512) to Text to support base64 data URLs
    major = Column(String(100), nullable=True)
    account_status = Column(
        Enum('active', 'inactive', 'suspended', name='user_status'),
        nullable=False,
        default='active'
    )
    last_login = Column(DateTime(6), nullable=True)
    created_at = Column(DateTime(6), nullable=False, server_default=func.current_timestamp())
    updated_at = Column(
        DateTime(6),
        nullable=False,
        server_default=func.current_timestamp(),
        onupdate=func.current_timestamp()
    )
    
    # Relationships
    tutor_profile = relationship(
        "TutorProfile", 
        back_populates="user", 
        uselist=False,
        foreign_keys="[TutorProfile.user_id]"
    )
    
    @property
    def full_name(self) -> str:
        """Return user's full name."""
        return f"{self.first_name} {self.last_name}"


class TutorProfile(Base):
    """TutorProfile model representing tutor_profiles table."""
    __tablename__ = "tutor_profiles"
    
    id = Column(BigInteger, primary_key=True, autoincrement=True)
    user_id = Column(BigInteger, ForeignKey('users.id', ondelete='RESTRICT'), nullable=False, unique=True)
    bio = Column(Text, nullable=True)
    years_of_experience = Column(Integer, nullable=True)
    tutoring_format = Column(
        Enum('in_person', 'online', 'hybrid', name='tutoring_format'),
        nullable=True,
        default='hybrid'
    )
    preferred_meeting_location = Column(String(255), nullable=True)
    verification_status = Column(
        Enum('pending', 'approved', 'rejected', name='verification_status'),
        nullable=False,
        default='pending'
    )
    verified_at = Column(DateTime(6), nullable=True)
    verified_by = Column(BigInteger, ForeignKey('users.id', ondelete='SET NULL'), nullable=True)
    rejection_reason = Column(String(500), nullable=True)
    avg_rating = Column(DECIMAL(3, 2), nullable=True)
    review_count = Column(Integer, nullable=False, default=0)
    created_at = Column(DateTime(6), nullable=False, server_default=func.current_timestamp())
    updated_at = Column(
        DateTime(6),
        nullable=False,
        server_default=func.current_timestamp(),
        onupdate=func.current_timestamp()
    )
    
    # Relationships
    user = relationship("User", back_populates="tutor_profile", foreign_keys=[user_id])
    subjects = relationship("Subject", secondary="tutor_subjects", back_populates="tutors")
    courses = relationship("TutorCourse", back_populates="tutor_profile")
    reviews = relationship("Review", back_populates="tutor_profile")


class Subject(Base):
    """Subject model representing subjects table."""
    __tablename__ = "subjects"
    
    id = Column(BigInteger, primary_key=True, autoincrement=True)
    name = Column(String(120), nullable=False, unique=True)
    slug = Column(String(140), nullable=False, unique=True)
    created_at = Column(DateTime(6), nullable=False, server_default=func.current_timestamp())
    updated_at = Column(
        DateTime(6),
        nullable=False,
        server_default=func.current_timestamp(),
        onupdate=func.current_timestamp()
    )
    
    # Relationships
    tutors = relationship("TutorProfile", secondary="tutor_subjects", back_populates="subjects")


class Course(Base):
    """Course model representing courses table."""
    __tablename__ = "courses"
    
    id = Column(BigInteger, primary_key=True, autoincrement=True)
    department = Column(String(16), nullable=False)
    course_number = Column(String(16), nullable=False)
    title = Column(String(255), nullable=False)
    description = Column(Text, nullable=True)
    level = Column(
        Enum('undergraduate', 'graduate', 'both', name='course_level'),
        nullable=True,
        default='undergraduate'
    )
    credits = Column(Integer, nullable=True)
    prerequisites = Column(Text, nullable=True)
    subject_id = Column(BigInteger, ForeignKey('subjects.id', ondelete='RESTRICT'), nullable=False)
    created_at = Column(DateTime(6), nullable=False, server_default=func.current_timestamp())
    updated_at = Column(
        DateTime(6),
        nullable=False,
        server_default=func.current_timestamp(),
        onupdate=func.current_timestamp()
    )
    
    # Relationships
    subject = relationship("Subject", foreign_keys=[subject_id])
    tutor_courses = relationship("TutorCourse", back_populates="course")
    
    @property
    def course_code(self) -> str:
        """Return formatted course code (e.g., 'CSC 648')."""
        return f"{self.department} {self.course_number}"


class Posting(Base):
    """Posting model representing postings table."""
    __tablename__ = "postings"
    
    id = Column(BigInteger, primary_key=True, autoincrement=True)
    user_id = Column(BigInteger, ForeignKey('users.id', ondelete='CASCADE'), nullable=False)
    course_id = Column(BigInteger, ForeignKey('courses.id', ondelete='RESTRICT'), nullable=False)
    title = Column(String(255), nullable=False)
    description = Column(Text, nullable=False)
    status = Column(
        Enum('pending', 'approved', 'rejected', name='posting_status'),
        nullable=False,
        default='pending'
    )
    rejection_reason = Column(String(500), nullable=True)
    availability_notes = Column(String(255), nullable=True)
    avg_rating = Column(DECIMAL(3, 2), nullable=True)
    review_count = Column(Integer, nullable=False, default=0)
    created_at = Column(DateTime(6), nullable=False, server_default=func.current_timestamp())
    updated_at = Column(
        DateTime(6),
        nullable=False,
        server_default=func.current_timestamp(),
        onupdate=func.current_timestamp()
    )
    
    # Relationships
    user = relationship("User", foreign_keys=[user_id])
    course = relationship("Course", foreign_keys=[course_id])


class TutorSubject(Base):
    """TutorSubject association table for many-to-many relationship."""
    __tablename__ = "tutor_subjects"
    
    tutor_profile_id = Column(
        BigInteger,
        ForeignKey('tutor_profiles.id', ondelete='CASCADE'),
        primary_key=True
    )
    subject_id = Column(
        BigInteger,
        ForeignKey('subjects.id', ondelete='RESTRICT'),
        primary_key=True
    )
    created_at = Column(DateTime(6), nullable=False, server_default=func.current_timestamp())


class TutorCourse(Base):
    """TutorCourse association table for many-to-many relationship with additional fields."""
    __tablename__ = "tutor_courses"
    
    tutor_profile_id = Column(
        BigInteger,
        ForeignKey('tutor_profiles.id', ondelete='CASCADE'),
        primary_key=True
    )
    course_id = Column(
        BigInteger,
        ForeignKey('courses.id', ondelete='RESTRICT'),
        primary_key=True
    )
    qualification = Column(String(500), nullable=True)
    created_at = Column(DateTime(6), nullable=False, server_default=func.current_timestamp())
    
    # Relationships
    tutor_profile = relationship("TutorProfile", back_populates="courses")
    course = relationship("Course", back_populates="tutor_courses")


class Review(Base):
    """Review model representing reviews table."""
    __tablename__ = "reviews"
    
    id = Column(BigInteger, primary_key=True, autoincrement=True)
    student_user_id = Column(BigInteger, ForeignKey('users.id', ondelete='RESTRICT'), nullable=False)
    tutor_profile_id = Column(BigInteger, ForeignKey('tutor_profiles.id', ondelete='RESTRICT'), nullable=False)
    course_id = Column(BigInteger, ForeignKey('courses.id', ondelete='SET NULL'), nullable=True)
    rating = Column(Integer, nullable=False)
    comment = Column(Text, nullable=True)
    is_approved = Column(Boolean, nullable=False, default=True)
    is_flagged = Column(Boolean, nullable=False, default=False)
    is_deleted = Column(Boolean, nullable=False, default=False)
    created_at = Column(DateTime(6), nullable=False, server_default=func.current_timestamp())
    updated_at = Column(
        DateTime(6),
        nullable=False,
        server_default=func.current_timestamp(),
        onupdate=func.current_timestamp()
    )
    
    # Relationships
    tutor_profile = relationship("TutorProfile", back_populates="reviews")


class Message(Base):
    """
    Message model representing messages table for tutor-student communication.
    
    Note: This is a ONE-WAY messaging system. Students send initial contact messages
    to tutors, and tutors can mark them as read. Follow-up communication happens
    externally (email/phone). The parent_message_id field exists in the DB for
    future extensibility but is not used in the current API/ORM implementation.
    """
    __tablename__ = "messages"
    
    id = Column(BigInteger, primary_key=True, autoincrement=True)
    sender_user_id = Column(BigInteger, ForeignKey('users.id', ondelete='RESTRICT'), nullable=False)
    recipient_user_id = Column(BigInteger, ForeignKey('users.id', ondelete='RESTRICT'), nullable=False)
    posting_id = Column(BigInteger, ForeignKey('postings.id', ondelete='SET NULL'), nullable=True)
    posting_title_snapshot = Column(String(255), nullable=True)
    message_text = Column(Text, nullable=False)
    contact_info = Column(String(255), nullable=False, default='', server_default='')
    connection_status = Column(
        Enum('pending', 'accepted', 'declined', name='connection_status'),
        nullable=False,
        default='pending',
        server_default='pending'
    )
    sent_at = Column(DateTime(6), nullable=False, server_default=func.current_timestamp())
    is_read = Column(Boolean, nullable=False, default=False, server_default='0')
    created_at = Column(DateTime(6), nullable=False, server_default=func.current_timestamp())
    updated_at = Column(
        DateTime(6),
        nullable=False,
        server_default=func.current_timestamp(),
        onupdate=func.current_timestamp()
    )
    
    # Relationships
    sender = relationship("User", foreign_keys=[sender_user_id])
    recipient = relationship("User", foreign_keys=[recipient_user_id])
    posting = relationship("Posting", foreign_keys=[posting_id])
