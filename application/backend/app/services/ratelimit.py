"""
ratelimit.py
------------
A small, dependency-free sliding-window rate limiter for sensitive endpoints
(login / registration) to blunt brute-force and enumeration attempts.

Usage:
    login_limiter = RateLimiter(max_requests=10, window_seconds=60)

    @router.post("/login", dependencies=[Depends(login_limiter)])
    def login(...): ...

Limitations:
- State is per-process and in-memory, so with multiple gunicorn workers each
  worker keeps its own counters. For production-grade limiting, also enforce
  limits at the reverse proxy or use a shared store (e.g. Redis). This provides a
  meaningful first line of defense without adding an external dependency.

Contributors: Ranjiv Jithendran
"""
import threading
import time
from collections import defaultdict, deque
from typing import Deque, Dict

from fastapi import HTTPException, Request, status


class RateLimiter:
    """Sliding-window limiter keyed by client IP + endpoint path."""

    def __init__(self, max_requests: int, window_seconds: int):
        self.max_requests = max_requests
        self.window_seconds = window_seconds
        self._hits: Dict[str, Deque[float]] = defaultdict(deque)
        self._lock = threading.Lock()

    def _client_key(self, request: Request) -> str:
        # X-Forwarded-For (first hop) when behind a trusted proxy, else peer IP.
        forwarded = request.headers.get("x-forwarded-for")
        if forwarded:
            client_ip = forwarded.split(",")[0].strip()
        else:
            client_ip = request.client.host if request.client else "unknown"
        return f"{client_ip}:{request.url.path}"

    def __call__(self, request: Request) -> None:
        now = time.time()
        cutoff = now - self.window_seconds
        key = self._client_key(request)

        with self._lock:
            bucket = self._hits[key]
            # Drop timestamps outside the window.
            while bucket and bucket[0] < cutoff:
                bucket.popleft()

            if len(bucket) >= self.max_requests:
                retry_after = int(self.window_seconds - (now - bucket[0])) + 1
                raise HTTPException(
                    status_code=status.HTTP_429_TOO_MANY_REQUESTS,
                    detail="Too many requests. Please slow down and try again later.",
                    headers={"Retry-After": str(max(retry_after, 1))},
                )

            bucket.append(now)
