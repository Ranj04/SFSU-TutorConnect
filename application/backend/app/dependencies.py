"""
dependencies.py
---------------
Reusable FastAPI dependencies for authentication and authorization.

`get_current_user` resolves the acting principal from the Bearer token on the
request and is the single source of truth for "who is calling". Routes must
derive identity from this dependency and never trust a client-supplied user_id.

`get_current_admin` additionally requires the user to have the is_admin flag,
gating moderation endpoints.

Contributors: Ranjiv Jithendran
"""
from typing import Optional

from fastapi import Depends, Header, HTTPException, status
from sqlalchemy.orm import Session

from app.db.database import get_db
from app.db.models import User
from app.services.tokens import verify_access_token

_UNAUTHENTICATED = HTTPException(
    status_code=status.HTTP_401_UNAUTHORIZED,
    detail="Not authenticated",
    headers={"WWW-Authenticate": "Bearer"},
)


def get_current_user(
    authorization: Optional[str] = Header(None),
    db: Session = Depends(get_db),
) -> User:
    """
    Resolve the authenticated user from the `Authorization: Bearer <token>`
    header. Raises 401 if the token is missing, malformed, invalid, or expired,
    and 403 if the account is not active.
    """
    if not authorization or not authorization.lower().startswith("bearer "):
        raise _UNAUTHENTICATED

    token = authorization[len("bearer "):].strip()
    user_id = verify_access_token(token)
    if user_id is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid or expired token",
            headers={"WWW-Authenticate": "Bearer"},
        )

    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise _UNAUTHENTICATED

    if user.account_status != "active":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail=f"Account is {user.account_status}",
        )

    return user


def get_current_admin(current_user: User = Depends(get_current_user)) -> User:
    """Require that the authenticated user is an administrator."""
    if not getattr(current_user, "is_admin", False):
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Admin privileges required",
        )
    return current_user
