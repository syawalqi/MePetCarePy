from fastapi import APIRouter, Depends, HTTPException, status, Request
from sqlalchemy.orm import Session
from typing import List
from app.database import get_db
from app.schemas.medical_record import MedicalRecordCreate, MedicalRecordRead, MedicalRecordUpdate
from app.crud import medical_record as crud_mr
from app.dependencies import check_role
from app.models.user import UserRole
from app.logger import log_action
from app.limiter import limiter, get_dynamic_limit

router = APIRouter(prefix="/medical-records", tags=["medical-records"])

# RBAC Permissions
CLINICAL_STAFF = [UserRole.SUPERADMIN, UserRole.ADMINISTRATOR, UserRole.VETERINARIAN]
ALL_STAFF = [UserRole.SUPERADMIN, UserRole.ADMINISTRATOR, UserRole.VETERINARIAN, UserRole.SUPPORT_STAFF]

@router.post("/", response_model=MedicalRecordRead, status_code=status.HTTP_201_CREATED)
@limiter.limit(get_dynamic_limit)
def create_medical_record(
    request: Request,
    record: MedicalRecordCreate, 
    db: Session = Depends(get_db),
    current_profile = Depends(check_role(CLINICAL_STAFF))
):
    db_record = crud_mr.create_medical_record(db, record)
    log_action(
        user_id=current_profile.id,
        role=current_profile.role,
        action="CREATE",
        entity="MEDICAL_RECORD",
        entity_id=str(db_record.id),
        data=record.model_dump()
    )
    return db_record

@router.get("/", response_model=List[MedicalRecordRead])
@limiter.limit(get_dynamic_limit)
def read_medical_records(
    request: Request,
    skip: int = 0, 
    limit: int = 100, 
    db: Session = Depends(get_db),
    _ = Depends(check_role(ALL_STAFF))
):
    return crud_mr.get_medical_records(db, skip=skip, limit=limit)

@router.get("/patient/{patient_id}", response_model=List[MedicalRecordRead])
@limiter.limit(get_dynamic_limit)
def read_patient_history(
    request: Request,
    patient_id: int, 
    db: Session = Depends(get_db),
    _ = Depends(check_role(ALL_STAFF))
):
    return crud_mr.get_patient_history(db, patient_id=patient_id)

@router.get("/{record_id}", response_model=MedicalRecordRead)
@limiter.limit(get_dynamic_limit)
def read_medical_record(
    request: Request,
    record_id: int, 
    db: Session = Depends(get_db),
    _ = Depends(check_role(ALL_STAFF))
):
    db_record = crud_mr.get_medical_record(db, record_id)
    if db_record is None:
        raise HTTPException(status_code=404, detail="Medical record not found")
    return db_record

@router.put("/{record_id}", response_model=MedicalRecordRead)
@limiter.limit(get_dynamic_limit)
def update_medical_record(
    request: Request,
    record_id: int, 
    record: MedicalRecordUpdate, 
    db: Session = Depends(get_db),
    current_profile = Depends(check_role(CLINICAL_STAFF))
):
    db_record = crud_mr.update_medical_record(db, record_id, record)
    if db_record is None:
        raise HTTPException(status_code=404, detail="Medical record not found")
    
    log_action(
        user_id=current_profile.id,
        role=current_profile.role,
        action="UPDATE",
        entity="MEDICAL_RECORD",
        entity_id=str(record_id),
        data=record.model_dump(exclude_unset=True)
    )
    return db_record

@router.delete("/{record_id}", response_model=MedicalRecordRead)
@limiter.limit(get_dynamic_limit)
def delete_medical_record(
    request: Request,
    record_id: int, 
    db: Session = Depends(get_db),
    current_profile = Depends(check_role([UserRole.SUPERADMIN, UserRole.ADMINISTRATOR]))
):
    db_record = crud_mr.delete_medical_record(db, record_id)
    if db_record is None:
        raise HTTPException(status_code=404, detail="Medical record not found")
    
    log_action(
        user_id=current_profile.id,
        role=current_profile.role,
        action="DELETE",
        entity="MEDICAL_RECORD",
        entity_id=str(record_id)
    )
    return db_record
