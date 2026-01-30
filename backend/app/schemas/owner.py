from pydantic import BaseModel, EmailStr, ConfigDict
from datetime import datetime
from typing import Optional, List
from .patient import PatientRead

class OwnerBase(BaseModel):
    full_name: str
    email: Optional[EmailStr] = None
    phone_number: str
    address: Optional[str] = None

class OwnerCreate(OwnerBase):
    pass

class OwnerUpdate(BaseModel):
    full_name: Optional[str] = None
    email: Optional[EmailStr] = None
    phone_number: Optional[str] = None
    address: Optional[str] = None

class OwnerRead(OwnerBase):
    id: int
    created_at: datetime
    updated_at: datetime
    is_deleted: bool
    patients: List[PatientRead] = []

    model_config = ConfigDict(from_attributes=True)
