from pydantic import BaseModel, EmailStr, ConfigDict, Field
from datetime import datetime
from typing import Optional
from app.models.user import UserRole

class ProfileBase(BaseModel):
    full_name: str = Field(..., min_length=2, max_length=100)
    role: UserRole
    email: EmailStr

class StaffCreate(ProfileBase):
    password: str

class ProfileCreate(ProfileBase):
    id: str # The Supabase UID

class ProfileUpdate(BaseModel):
    full_name: Optional[str] = None
    role: Optional[UserRole] = None

class ProfileRead(ProfileBase):
    id: str
    created_at: datetime
    updated_at: datetime

    model_config = ConfigDict(from_attributes=True)
