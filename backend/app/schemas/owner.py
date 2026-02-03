from pydantic import BaseModel, EmailStr, ConfigDict, Field
from datetime import datetime
from typing import Optional, List
from .patient import PatientRead

# Regex for phone number: allows optional +, then 7-15 digits
PHONE_REGEX = r"^\+?[0-9]{7,15}$"

class OwnerBase(BaseModel):
    full_name: str = Field(..., min_length=2, max_length=100)
    email: Optional[EmailStr] = None
    phone_number: str = Field(..., pattern=PHONE_REGEX)
    address: Optional[str] = Field(None, max_length=500)

class OwnerCreate(OwnerBase):
    pass

class OwnerUpdate(BaseModel):
    full_name: Optional[str] = Field(None, min_length=2, max_length=100)
    email: Optional[EmailStr] = None
    phone_number: Optional[str] = Field(None, pattern=PHONE_REGEX)
    address: Optional[str] = Field(None, max_length=500)

class OwnerRead(OwnerBase):
    id: int
    created_at: datetime
    updated_at: datetime
    is_deleted: bool
    patients: List[PatientRead] = []

    model_config = ConfigDict(from_attributes=True)

class PaginatedOwnerRead(BaseModel):
    items: List[OwnerRead]
    total: int
    page: int
    limit: int