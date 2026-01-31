from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from app.database import get_db
from app.schemas.patient import PatientCreate, PatientRead, PatientUpdate
from app.crud import patient as crud_patient
from app.dependencies import check_role
from app.models.user import UserRole
from app.logger import log_action

router = APIRouter(prefix="/patients", tags=["patients"])

# Access aliases
ALL_STAFF = [UserRole.ADMINISTRATOR, UserRole.VETERINARIAN, UserRole.SUPPORT_STAFF]
MANAGEMENT = [UserRole.ADMINISTRATOR, UserRole.SUPPORT_STAFF]
ADMIN_ONLY = [UserRole.ADMINISTRATOR]

@router.post("/", response_model=PatientRead, status_code=status.HTTP_201_CREATED)
def create_patient(
    patient: PatientCreate, 
    db: Session = Depends(get_db),
    current_profile = Depends(check_role(MANAGEMENT))
):
    db_patient = crud_patient.create_patient(db, patient)
    log_action(
        user_id=current_profile.id,
        role=current_profile.role,
        action="CREATE",
        entity="PATIENT",
        entity_id=str(db_patient.id),
        data=patient.model_dump()
    )
    return db_patient

@router.get("/", response_model=List[PatientRead])
def read_patients(
    skip: int = 0, 
    limit: int = 100, 
    db: Session = Depends(get_db),
    _ = Depends(check_role(ALL_STAFF))
):
    return crud_patient.get_patients(db, skip=skip, limit=limit)

@router.get("/search/", response_model=List[PatientRead])
def search_patients(
    query: str, 
    db: Session = Depends(get_db),
    _ = Depends(check_role(ALL_STAFF))
):
    return crud_patient.search_patients(db, query=query)

@router.get("/{patient_id}", response_model=PatientRead)
def read_patient(
    patient_id: int, 
    db: Session = Depends(get_db),
    _ = Depends(check_role(ALL_STAFF))
):
    db_patient = crud_patient.get_patient(db, patient_id)
    if db_patient is None:
        raise HTTPException(status_code=404, detail="Patient not found")
    return db_patient

@router.put("/{patient_id}", response_model=PatientRead)
def update_patient(
    patient_id: int, 
    patient: PatientUpdate, 
    db: Session = Depends(get_db),
    current_profile = Depends(check_role(MANAGEMENT))
):
    db_patient = crud_patient.update_patient(db, patient_id, patient)
    if db_patient is None:
        raise HTTPException(status_code=404, detail="Patient not found")
    
    log_action(
        user_id=current_profile.id,
        role=current_profile.role,
        action="UPDATE",
        entity="PATIENT",
        entity_id=str(patient_id),
        data=patient.model_dump(exclude_unset=True)
    )
    return db_patient

@router.delete("/{patient_id}", response_model=PatientRead)
def delete_patient(
    patient_id: int, 
    db: Session = Depends(get_db),
    current_profile = Depends(check_role(ADMIN_ONLY))
):
    db_patient = crud_patient.delete_patient(db, patient_id)
    if db_patient is None:
        raise HTTPException(status_code=404, detail="Patient not found")
    
    log_action(
        user_id=current_profile.id,
        role=current_profile.role,
        action="DELETE",
        entity="PATIENT",
        entity_id=str(patient_id)
    )
    return db_patient