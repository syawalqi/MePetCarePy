from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from app.database import get_db
from app.schemas.medical_record import MedicalRecordCreate, MedicalRecordRead, MedicalRecordUpdate
from app.crud import medical_record as crud_mr
from app.dependencies import check_role
from app.models.user import UserRole

router = APIRouter(prefix="/medical-records", tags=["medical-records"])

# RBAC Permissions
CLINICAL_STAFF = [UserRole.ADMINISTRATOR, UserRole.VETERINARIAN]
ALL_STAFF = [UserRole.ADMINISTRATOR, UserRole.VETERINARIAN, UserRole.SUPPORT_STAFF]

@router.post("/", response_model=MedicalRecordRead, status_code=status.HTTP_201_CREATED)
def create_medical_record(
    record: MedicalRecordCreate, 
    db: Session = Depends(get_db),
    _ = Depends(check_role(CLINICAL_STAFF))
):
    return crud_mr.create_medical_record(db, record)

@router.get("/", response_model=List[MedicalRecordRead])
def read_medical_records(
    skip: int = 0, 
    limit: int = 100, 
    db: Session = Depends(get_db),
    _ = Depends(check_role(ALL_STAFF))
):
    return crud_mr.get_medical_records(db, skip=skip, limit=limit)

@router.get("/patient/{patient_id}", response_model=List[MedicalRecordRead])
def read_patient_history(
    patient_id: int, 
    db: Session = Depends(get_db),
    _ = Depends(check_role(ALL_STAFF))
):
    return crud_mr.get_patient_history(db, patient_id=patient_id)

@router.get("/{record_id}", response_model=MedicalRecordRead)
def read_medical_record(
    record_id: int, 
    db: Session = Depends(get_db),
    _ = Depends(check_role(ALL_STAFF))
):
    db_record = crud_mr.get_medical_record(db, record_id)
    if db_record is None:
        raise HTTPException(status_code=404, detail="Medical record not found")
    return db_record

@router.put("/{record_id}", response_model=MedicalRecordRead)
def update_medical_record(
    record_id: int, 
    record: MedicalRecordUpdate, 
    db: Session = Depends(get_db),
    _ = Depends(check_role(CLINICAL_STAFF))
):
    db_record = crud_mr.update_medical_record(db, record_id, record)
    if db_record is None:
        raise HTTPException(status_code=404, detail="Medical record not found")
    return db_record

@router.delete("/{record_id}", response_model=MedicalRecordRead)
def delete_medical_record(
    record_id: int, 
    db: Session = Depends(get_db),
    _ = Depends(check_role([UserRole.ADMINISTRATOR]))
):
    db_record = crud_mr.delete_medical_record(db, record_id)
    if db_record is None:
        raise HTTPException(status_code=404, detail="Medical record not found")
    return db_record
