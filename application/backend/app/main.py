"""
main.py
-------
The main FastAPI application entry point. Sets up CORS, logging,
exception handling, and registers all API routers.

Contributors: Ranjiv Jithendran, Dhvanil Bhagat
"""
from fastapi import FastAPI, Request, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.exceptions import RequestValidationError
from fastapi.responses import JSONResponse, FileResponse
from fastapi.staticfiles import StaticFiles
from contextlib import asynccontextmanager
import os
import time
import logging

from app.config import settings
from app.routes import search, auth, messaging, postings, courses, reviews

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s - %(name)s - %(levelname)s - %(message)s"
)
logger = logging.getLogger(__name__)

# Lifespan handler: verify critical DB schema on startup (non-fatal). Replaces
# the deprecated @app.on_event("startup") hook (removed in newer Starlette).
@asynccontextmanager
async def lifespan(app: FastAPI):
    try:
        from app.db.database import get_db
        from sqlalchemy import text

        db = next(get_db())
        try:
            # Check if profile_photo_url column is TEXT type
            result = db.execute(text("""
                SELECT DATA_TYPE, CHARACTER_MAXIMUM_LENGTH
                FROM INFORMATION_SCHEMA.COLUMNS
                WHERE TABLE_SCHEMA = DATABASE()
                AND TABLE_NAME = 'users'
                AND COLUMN_NAME = 'profile_photo_url'
            """))
            column_info = result.fetchone()

            if column_info:
                data_type = column_info[0].lower() if column_info[0] else None
                if data_type not in ('text', 'longtext', 'mediumtext'):
                    logger.warning(
                        f"profile_photo_url column is {column_info[0]}, not TEXT. "
                        f"Please run migration 008_update_profile_photo_url.sql or fix_profile_photo_column.py"
                    )
                else:
                    logger.info(f"Database schema verified: profile_photo_url is {column_info[0]} type")
            else:
                logger.warning("Could not verify profile_photo_url column type")
        finally:
            db.close()
    except Exception as e:
        # Log but don't fail startup - the database might not be available yet.
        logger.error(f"Could not verify database schema on startup: {e}")
        logger.info("Application will continue to start - schema verification is optional")

    yield


# Create FastAPI application.
# Request body size is bounded by the middleware below and SHOULD also be enforced
# at the reverse proxy (nginx: client_max_body_size). Note: uvicorn's
# --limit-max-requests controls request COUNT before worker restart, NOT body size.
app = FastAPI(
    title="TutorConnect API",
    description="SFSU Tutoring Platform API",
    version="0.2.0",
    lifespan=lifespan,
)


# Configure CORS for frontend integration. Methods/headers are restricted to the
# set the app actually uses (credentialed CORS with wildcards is unsafe).
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allow_headers=["Authorization", "Content-Type"],
)


# Request size limit middleware
@app.middleware("http")
async def check_request_size(request: Request, call_next):
    """Check request body size to prevent 413 errors."""
    # Maximum request body size: 10MB (for base64-encoded images)
    MAX_BODY_SIZE = 10 * 1024 * 1024  # 10MB
    
    if request.method in ("POST", "PUT", "PATCH"):
        content_length = request.headers.get("content-length")
        # Require Content-Length on body-bearing requests so the limit cannot be
        # bypassed by omitting the header (or using chunked transfer encoding).
        if content_length is None:
            return JSONResponse(
                status_code=411,
                content={
                    "error": "Length Required",
                    "message": "A Content-Length header is required for this request.",
                }
            )
        try:
            size = int(content_length)
        except ValueError:
            return JSONResponse(
                status_code=400,
                content={
                    "error": "Bad Request",
                    "message": "Invalid Content-Length header.",
                }
            )
        if size > MAX_BODY_SIZE:
            return JSONResponse(
                status_code=413,
                content={
                    "error": "Payload Too Large",
                    "message": f"Request body size ({size} bytes) exceeds maximum allowed size ({MAX_BODY_SIZE} bytes)",
                    "detail": "Please reduce the size of your request. For images, consider compressing them or using a smaller file."
                }
            )

    response = await call_next(request)
    return response


# Request logging middleware
@app.middleware("http")
async def log_requests(request: Request, call_next):
    """Log all incoming requests with method, path, status, and duration."""
    start_time = time.time()
    
    # Process request
    response = await call_next(request)
    
    # Calculate duration
    duration_ms = int((time.time() - start_time) * 1000)
    
    # Log request
    logger.info(f"{request.method} {request.url.path} - {response.status_code} - {duration_ms}ms")
    
    return response


# Global exception handlers
@app.exception_handler(RequestValidationError)
async def validation_exception_handler(request: Request, exc: RequestValidationError):
    """Handle validation errors with consistent JSON format."""
    errors = exc.errors()
    error_messages = []
    for error in errors:
        loc = " -> ".join(str(x) for x in error["loc"])
        error_messages.append(f"{loc}: {error['msg']}")
    
    return JSONResponse(
        status_code=status.HTTP_400_BAD_REQUEST,
        content={
            "error": "Validation Error",
            "message": "Request validation failed",
            "detail": error_messages
        }
    )


@app.exception_handler(Exception)
async def global_exception_handler(request: Request, exc: Exception):
    """Handle all unhandled exceptions with consistent JSON format."""
    logger.error(f"Unhandled exception: {exc}", exc_info=True)
    
    return JSONResponse(
        status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
        content={
            "error": "Internal Server Error",
            "message": "An unexpected error occurred",
            "detail": str(exc) if (settings.API_DEBUG and not settings.is_production) else "Please contact support if the problem persists"
        }
    )


# Register routers
app.include_router(search.router)
app.include_router(auth.router)
app.include_router(messaging.router)
app.include_router(postings.router)
app.include_router(courses.router)
app.include_router(reviews.router)

# Health check endpoints
@app.get("/health")
def health_check():
    return {"status": "ok", "message": "TutorConnect API is running"}

@app.get("/api/v1/health")
def api_health():
    return {"status": "ok", "api": "v1"}


# ---------------------------------------------------------------------------
# Static frontend (single-service / combined deploy)
# ---------------------------------------------------------------------------
# In the combined Railway deployment the Vite build is copied to ./static
# (see Dockerfile), so FastAPI serves the SPA from the SAME origin as the API
# and no CORS is required. When the build is absent (e.g. API-only local dev),
# all of this is skipped and "/" returns the JSON welcome instead.
_STATIC_DIR = os.path.normpath(os.path.join(os.path.dirname(__file__), "..", "static"))
_STATIC_INDEX = os.path.join(_STATIC_DIR, "index.html")
_SERVE_SPA = os.path.isfile(_STATIC_INDEX)

if _SERVE_SPA:
    _assets_dir = os.path.join(_STATIC_DIR, "assets")
    if os.path.isdir(_assets_dir):
        # Hashed, immutable Vite assets.
        app.mount("/assets", StaticFiles(directory=_assets_dir), name="assets")


@app.get("/")
def root():
    if _SERVE_SPA:
        return FileResponse(_STATIC_INDEX)
    return {
        "message": "Welcome to TutorConnect API",
        "version": "0.2.0",
        "docs": "/docs",
    }


if _SERVE_SPA:
    # SPA catch-all: serve a real static file when one exists, otherwise return
    # index.html so client-side routes (e.g. /dashboard) work on hard refresh.
    # Registered LAST so it never shadows /api/*, /health, /docs, or /openapi.json
    # (those routes are registered earlier and therefore match first).
    @app.get("/{full_path:path}")
    def spa_fallback(full_path: str):
        # Never hijack the API surface: unknown API/docs paths get a real 404.
        if full_path.startswith("api/") or full_path in ("health", "docs", "redoc", "openapi.json"):
            return JSONResponse(status_code=404, content={"error": "Not Found"})
        # Serve the requested file if it resolves to a real file inside the
        # static dir (guards against path traversal); else fall back to the SPA.
        candidate = os.path.normpath(os.path.join(_STATIC_DIR, full_path))
        if candidate.startswith(_STATIC_DIR + os.sep) and os.path.isfile(candidate):
            return FileResponse(candidate)
        return FileResponse(_STATIC_INDEX)