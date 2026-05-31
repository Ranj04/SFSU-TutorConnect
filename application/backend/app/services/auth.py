"""
auth.py
-------
Service for password hashing and verification using bcrypt.
Keeps passwords secure by never storing them in plain text.

Contributors: Ranjiv Jithendran, Dhvanil Bhagat
"""
import bcrypt
from typing import Optional


def hash_password(password: str) -> str:
    """
    Hash a plain text password using bcrypt.
    
    Args:
        password: Plain text password to hash
        
    Returns:
        Hashed password string (bcrypt format)
    """
    if not password:
        raise ValueError("Password cannot be empty")

    # bcrypt silently ignores bytes past position 72. Reject longer inputs here
    # (defense in depth; the API layer also validates) so two distinct long
    # passwords sharing a 72-byte prefix can never authenticate interchangeably.
    encoded = password.encode('utf-8')
    if len(encoded) > 72:
        raise ValueError("Password must be at most 72 bytes long")

    # Generate salt and hash password
    salt = bcrypt.gensalt()
    hashed = bcrypt.hashpw(encoded, salt)
    return hashed.decode('utf-8')


def verify_password(plain_password: str, hashed_password: str) -> bool:
    """
    Verify a plain text password against a hashed password.
    
    Args:
        plain_password: Plain text password to verify
        hashed_password: Hashed password from database
        
    Returns:
        True if password matches, False otherwise
    """
    if not plain_password or not hashed_password:
        return False
    
    try:
        return bcrypt.checkpw(
            plain_password.encode('utf-8'),
            hashed_password.encode('utf-8')
        )
    except (ValueError, TypeError):
        return False

