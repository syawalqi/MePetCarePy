import os
from typing import List
from fastapi import Depends, HTTPException, status, Request
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from sqlalchemy.orm import Session
from supabase import create_client, Client
from dotenv import load_dotenv

from app.database import get_db
from app.models.user import UserRole
from app.crud import user as crud_user

# Load .env
base_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
load_dotenv(os.path.join(base_dir, ".env"))

SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_ANON_KEY = os.getenv("SUPABASE_ANON_KEY")
SUPABASE_SERVICE_ROLE_KEY = os.getenv("SUPABASE_SERVICE_ROLE_KEY")

# Standard client for public/auth actions
supabase: Client = create_client(SUPABASE_URL, SUPABASE_ANON_KEY)

# Admin client for bypass-RLS and auth management
supabase_admin: Client = create_client(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY) if SUPABASE_SERVICE_ROLE_KEY else None

security = HTTPBearer()

async def get_current_user(request: Request, credentials: HTTPAuthorizationCredentials = Depends(security)):
    """
    Verifies the JWT token using Supabase Auth and populates request state.
    """
    try:
        user_res = supabase.auth.get_user(credentials.credentials)
        if not user_res.user:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid authentication credentials",
                headers={"WWW-Authenticate": "Bearer"},
            )
        # Store in request state for rate limiter
        request.state.user = user_res.user
        return user_res.user
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail=f"Could not validate credentials: {str(e)}",
            headers={"WWW-Authenticate": "Bearer"},
        )

def check_role(required_roles: List[UserRole]):
    """
    Dependency factory to check if the current user has one of the required roles.
    """
    async def role_checker(
        request: Request,
        current_user = Depends(get_current_user),
        db: Session = Depends(get_db)
    ):
        profile = crud_user.get_profile(db, current_user.id)
        if not profile:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="User profile not found. Please complete registration."
            )
        
        # Store role in request state for rate limiter
        request.state.user_role = profile.role
        
        if profile.role not in required_roles:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="You do not have permission to perform this action."
            )
        return profile
    
    return role_checker

def get_admin_client():

    if not supabase_admin:

        raise HTTPException(

            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,

            detail="Supabase Service Role Key not configured."

        )

    return supabase_admin



async def check_session(

    request: Request,

    current_user = Depends(get_current_user),

    db: Session = Depends(get_db)

):

    """

    Validates that the user has an active session in the DB 

    matching their current bearer token.

    """

    # Extract token from header

    auth_header = request.headers.get("Authorization")

    if not auth_header or not auth_header.startswith("Bearer "):

        raise HTTPException(status_code=401, detail="Missing or invalid session token")

    

    token = auth_header.split(" ")[1]

    

    is_valid, message = crud_user.validate_session(db, current_user.id, token)

    if not is_valid:

        raise HTTPException(status_code=401, detail=message)

    

    return True
