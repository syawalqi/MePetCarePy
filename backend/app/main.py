import os
from fastapi import FastAPI, Request, Depends
from fastapi.middleware.cors import CORSMiddleware
from slowapi import _rate_limit_exceeded_handler
from slowapi.errors import RateLimitExceeded
from slowapi.middleware import SlowAPIMiddleware

from app.api import owners, patients, users, medical_records, invoices
from app.database import engine
from app.models import Base
from app.limiter import limiter, get_dynamic_limit

# Create database tables
Base.metadata.create_all(bind=engine)

app = FastAPI(title="MePetCarePy API", version="0.1.0")
app.state.limiter = limiter
app.add_exception_handler(RateLimitExceeded, _rate_limit_exceeded_handler)

@app.middleware("http")
async def add_security_headers(request: Request, call_next):
    response = await call_next(request)
    response.headers["Strict-Transport-Security"] = "max-age=31536000; includeSubDomains"
    response.headers["X-Content-Type-Options"] = "nosniff"
    response.headers["X-Frame-Options"] = "DENY"
    response.headers["X-XSS-Protection"] = "1; mode=block"
    # Refined CSP to allow Swagger UI to render while maintaining security
    response.headers["Content-Security-Policy"] = (
        "default-src 'self'; "
        "script-src 'self' 'unsafe-inline' https://cdn.jsdelivr.net; "
        "style-src 'self' 'unsafe-inline' https://cdn.jsdelivr.net; "
        "img-src 'self' data: https://fastapi.tiangolo.com; "
        "frame-ancestors 'none';"
    )
    return response

app.add_middleware(SlowAPIMiddleware)
ALLOWED_ORIGINS = os.getenv("ALLOWED_ORIGINS", "http://localhost:5173,http://127.0.0.1:5173").split(",")

app.add_middleware(
    CORSMiddleware,
    allow_origins=ALLOWED_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

from app.dependencies import get_current_user, check_role, check_session
from app.models.user import UserRole
from app.limiter import limiter, get_dynamic_limit

app.include_router(owners.router, dependencies=[Depends(check_session)])
app.include_router(patients.router, dependencies=[Depends(check_session)])
app.include_router(users.router) # Users router handles session creation itself
app.include_router(medical_records.router, dependencies=[Depends(check_session)])
app.include_router(invoices.router, dependencies=[Depends(check_session)])

ALL_STAFF = [UserRole.SUPERADMIN, UserRole.ADMINISTRATOR, UserRole.VETERINARIAN, UserRole.SUPPORT_STAFF]

@app.get("/")
@limiter.limit(get_dynamic_limit)
async def read_root(request: Request, _ = Depends(check_role(ALL_STAFF)), _s = Depends(check_session)):
    return {"message": "Welcome to MePetCarePy API"}
