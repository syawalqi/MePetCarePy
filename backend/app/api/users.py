from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from app.database import get_db
from app.schemas.user import ProfileRead, StaffCreate
from app.crud import user as crud_user
from app.dependencies import get_current_user, check_role, get_admin_client
from app.models.user import UserRole

router = APIRouter(prefix="/users", tags=["users"])

@router.post("/", response_model=ProfileRead, status_code=status.HTTP_201_CREATED)
def create_staff_user(
    staff_in: StaffCreate,
    db: Session = Depends(get_db),
    admin_client = Depends(get_admin_client),
    _ = Depends(check_role([UserRole.SUPERADMIN]))
):
    """
    Creates a new staff user in Supabase Auth and a corresponding entry in the public.profiles table.
    Restricted to ADMINISTRATORS.
    """
    try:
        # 1. Create user in Supabase Auth
        auth_res = admin_client.auth.admin.create_user({
            "email": staff_in.email,
            "password": staff_in.password,
            "email_confirm": True # Auto-confirm for staff
        })
        
        if not auth_res.user:
            raise HTTPException(status_code=400, detail="Failed to create auth user")

        user_id = auth_res.user.id

        # 2. Create profile in public.profiles
        profile_data = {
            "id": user_id,
            "full_name": staff_in.full_name,
            "email": staff_in.email,
            "role": staff_in.role
        }
        
        return crud_user.create_profile(db, profile_data)

    except Exception as e:
        # Detailed error reporting
        detail = str(e)
        if "already exists" in detail.lower():
            raise HTTPException(status_code=400, detail="User with this email already exists")
        raise HTTPException(status_code=500, detail=f"User creation failed: {detail}")

@router.get("/", response_model=List[ProfileRead])
def read_users(
    skip: int = 0,
    limit: int = 100,
    db: Session = Depends(get_db),
    _ = Depends(check_role([UserRole.SUPERADMIN, UserRole.ADMINISTRATOR]))
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

@router.delete("/{user_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_staff_user(
    user_id: str,
    db: Session = Depends(get_db),
    admin_client = Depends(get_admin_client),
    current_profile = Depends(check_role([UserRole.SUPERADMIN]))
):
    """
    Deletes a staff user from both Supabase Auth and the profiles table.
    Prevent self-deletion.
    """
    if user_id == current_profile.id:
        raise HTTPException(status_code=400, detail="You cannot delete your own account.")

    try:
        # 1. Delete from Supabase Auth
        admin_client.auth.admin.delete_user(user_id)
        
        # 2. Delete from Profiles table
        crud_user.delete_profile(db, user_id)
        
        return None
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to delete user: {str(e)}")
