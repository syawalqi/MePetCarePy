from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from app.database import get_db
from app.schemas.user import ProfileRead
from app.crud import user as crud_user
from app.dependencies import get_current_user, check_role
from app.models.user import UserRole

router = APIRouter(prefix="/users", tags=["users"])

@router.get("/", response_model=List[ProfileRead])
def read_users(
    skip: int = 0,
    limit: int = 100,
    db: Session = Depends(get_db),
    _ = Depends(check_role([UserRole.ADMINISTRATOR]))
):
    return crud_user.get_profiles(db, skip=skip, limit=limit)

@router.get("/me", response_model=ProfileRead)
def read_user_me(
    current_user = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    profile = crud_user.get_profile(db, current_user.id)
    if not profile:
        raise HTTPException(status_code=404, detail="Profile not found")
    return profile
