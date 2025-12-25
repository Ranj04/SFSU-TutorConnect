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
from fastapi.responses import JSONResponse
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

# Create FastAPI application
# Note: To handle large base64-encoded images, uvicorn should be started with:
# uvicorn app.main:app --reload --limit-max-requests 1000
# For production, configure your reverse proxy (nginx/apache) to allow larger request bodies
app = FastAPI(
    title="TutorConnect API",
    description="SFSU Tutoring Platform API for Milestone 3",
    version="0.2.0"
)


# Startup event to verify database schema
@app.on_event("startup")
async def verify_database_schema():
    """Verify critical database schema on startup. Non-blocking - won't fail app startup."""
    try:
        from app.db.database import get_db
        from sqlalchemy import text
        
        # Get a database session
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
        # Log warning but don't fail startup - database might not be available yet
        logger.warning(f"Could not verify database schema on startup: {e}")
        logger.info("Application will continue to start - schema verification is optional")


# Configure CORS for frontend integration
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# Request size limit middleware
@app.middleware("http")
async def check_request_size(request: Request, call_next):
    """Check request body size to prevent 413 errors."""
    # Maximum request body size: 10MB (for base64-encoded images)
    MAX_BODY_SIZE = 10 * 1024 * 1024  # 10MB
    
    if request.method in ("POST", "PUT", "PATCH"):
        content_length = request.headers.get("content-length")
        if content_length:
            try:
                size = int(content_length)
                if size > MAX_BODY_SIZE:
                    return JSONResponse(
                        status_code=413,
                        content={
                            "error": "Payload Too Large",
                            "message": f"Request body size ({size} bytes) exceeds maximum allowed size ({MAX_BODY_SIZE} bytes)",
                            "detail": "Please reduce the size of your request. For images, consider compressing them or using a smaller file."
                        }
                    )
            except ValueError:
                pass  # Invalid content-length, let it through
    
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
            "detail": str(exc) if settings.API_DEBUG else "Please contact support if the problem persists"
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

@app.get("/")
def root():
    return {
        "message": "Welcome to TutorConnect API",
        "version": "0.1.0",
        "docs": "/docs"
    }

@app.get("/api/v1/health")
def api_health():
    return {"status": "ok", "api": "v1"}