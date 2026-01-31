from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.database import get_db
from app.schemas.user import ProfileRead
from app.crud import user as crud_user
from app.dependencies import get_current_user

router = APIRouter(prefix="/users", tags=["users"])

@router.get("/me", response_model=ProfileRead)
def read_user_me(
    current_user = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    profile = crud_user.get_profile(db, current_user.id)
    if not profile:
        raise HTTPException(status_code=404, detail="Profile not found")
    return profile
