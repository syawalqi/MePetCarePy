from pydantic import BaseModel, ConfigDict
from datetime import date, datetime
from typing import Optional

class PatientBase(BaseModel):
    name: str
    species: str
    breed: Optional[str] = None
    gender: Optional[str] = None
    date_of_birth: Optional[date] = None

class PatientCreate(PatientBase):
    owner_id: int

class PatientUpdate(BaseModel):
    name: Optional[str] = None
    species: Optional[str] = None
    breed: Optional[str] = None
    gender: Optional[str] = None
    date_of_birth: Optional[date] = None

class PatientRead(PatientBase):
    id: int
    owner_id: int
    created_at: datetime
    updated_at: datetime
    is_deleted: bool

    model_config = ConfigDict(from_attributes=True)
