from pydantic import BaseModel, ConfigDict
from datetime import datetime
from typing import Optional

class MedicalRecordBase(BaseModel):
    subjective: Optional[str] = None
    objective: Optional[str] = None
    assessment: Optional[str] = None
    plan: Optional[str] = None
    weight: Optional[float] = None
    temperature: Optional[float] = None
    heart_rate: Optional[int] = None
    respiration_rate: Optional[int] = None

class MedicalRecordCreate(MedicalRecordBase):
    patient_id: int

class MedicalRecordUpdate(MedicalRecordBase):
    pass

class MedicalRecordRead(MedicalRecordBase):
    id: int
    patient_id: int
    created_at: datetime
    updated_at: datetime
    is_deleted: bool

    model_config = ConfigDict(from_attributes=True)
