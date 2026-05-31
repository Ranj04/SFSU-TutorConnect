"""
tokens.py
---------
Stateless, signed authentication tokens (JWT-style) implemented with only the
Python standard library so the backend gains no extra runtime dependency.

A token is `base64url(payload).base64url(HMAC-SHA256(secret, payload))`, where
the payload is a small JSON object carrying the user id (`sub`) and an expiry
(`exp`, unix seconds). The signature is verified in constant time and the
expiry is enforced on every request.

Security notes:
- The signing key comes from settings.SECRET_KEY (required in production).
- Tokens are bearer credentials: anyone holding one is the user, so they must
  only ever be sent over HTTPS and stored carefully on the client.

Contributors: Ranjiv Jithendran
"""
import base64
import hashlib
import hmac
import json
import time
from typing import Optional

from app.config import settings


def _b64encode(raw: bytes) -> str:
    """URL-safe base64 without padding."""
    return base64.urlsafe_b64encode(raw).rstrip(b"=").decode("ascii")


def _b64decode(data: str) -> bytes:
    """Inverse of _b64encode (restores padding)."""
    padding = "=" * (-len(data) % 4)
    return base64.urlsafe_b64decode(data + padding)


def _sign(payload_b64: str) -> str:
    signature = hmac.new(
        settings.SECRET_KEY.encode("utf-8"),
        payload_b64.encode("ascii"),
        hashlib.sha256,
    ).digest()
    return _b64encode(signature)


def create_access_token(user_id: int, expires_in: Optional[int] = None) -> str:
    """
    Create a signed token for the given user id.

    Args:
        user_id: The authenticated user's id (becomes the token subject).
        expires_in: Optional override for the lifetime in seconds.

    Returns:
        A compact `payload.signature` token string.
    """
    if expires_in is None:
        expires_in = settings.ACCESS_TOKEN_EXPIRE_SECONDS

    payload = {"sub": int(user_id), "exp": int(time.time()) + int(expires_in)}
    payload_b64 = _b64encode(json.dumps(payload, separators=(",", ":")).encode("utf-8"))
    return f"{payload_b64}.{_sign(payload_b64)}"


def verify_access_token(token: str) -> Optional[int]:
    """
    Verify a token's signature and expiry.

    Returns:
        The user id (int) if the token is valid and unexpired, else None.
    """
    if not token or "." not in token:
        return None

    try:
        payload_b64, signature_b64 = token.split(".", 1)
    except ValueError:
        return None

    # Constant-time signature comparison.
    if not hmac.compare_digest(_sign(payload_b64), signature_b64):
        return None

    try:
        payload = json.loads(_b64decode(payload_b64))
    except (ValueError, json.JSONDecodeError):
        return None

    exp = payload.get("exp")
    if not isinstance(exp, (int, float)) or exp < time.time():
        return None

    sub = payload.get("sub")
    if sub is None:
        return None

    try:
        return int(sub)
    except (TypeError, ValueError):
        return None
