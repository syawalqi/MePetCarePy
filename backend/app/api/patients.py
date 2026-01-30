from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from app.database import get_db
from app.schemas.patient import PatientCreate, PatientRead, PatientUpdate
from app.crud import patient as crud_patient

router = APIRouter(prefix="/patients", tags=["patients"])

@router.post("/", response_model=PatientRead, status_code=status.HTTP_201_CREATED)
def create_patient(patient: PatientCreate, db: Session = Depends(get_db)):
    return crud_patient.create_patient(db, patient)

@router.get("/", response_model=List[PatientRead])
def read_patients(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    return crud_patient.get_patients(db, skip=skip, limit=limit)

@router.get("/{patient_id}", response_model=PatientRead)
def read_patient(patient_id: int, db: Session = Depends(get_db)):
    db_patient = crud_patient.get_patient(db, patient_id)
    if db_patient is None:
        raise HTTPException(status_code=404, detail="Patient not found")
    return db_patient

@router.put("/{patient_id}", response_model=PatientRead)
def update_patient(patient_id: int, patient: PatientUpdate, db: Session = Depends(get_db)):
    db_patient = crud_patient.update_patient(db, patient_id, patient)
    if db_patient is None:
        raise HTTPException(status_code=404, detail="Patient not found")
    return db_patient

@router.delete("/{patient_id}", response_model=PatientRead)
def delete_patient(patient_id: int, db: Session = Depends(get_db)):
    db_patient = crud_patient.delete_patient(db, patient_id)
    if db_patient is None:
        raise HTTPException(status_code=404, detail="Patient not found")
    return db_patient
