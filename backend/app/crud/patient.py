from sqlalchemy.orm import Session
from datetime import datetime, UTC
from app.models.patient import Patient
from app.models.owner import Owner
from app.schemas.patient import PatientCreate, PatientUpdate

def get_patient(db: Session, patient_id: int):
    return db.query(Patient).filter(Patient.id == patient_id, Patient.is_deleted == False).first()

def get_patients(db: Session, skip: int = 0, limit: int = 100):
    return db.query(Patient).filter(Patient.is_deleted == False).order_by(Patient.id.desc()).offset(skip).limit(limit).all()

def get_patients_count(db: Session) -> int:
    return db.query(Patient).filter(Patient.is_deleted == False).count()

def create_patient(db: Session, patient: PatientCreate):
    db_patient = Patient(**patient.model_dump())
    db.add(db_patient)
    db.commit()
    db.refresh(db_patient)
    return db_patient

def update_patient(db: Session, patient_id: int, patient: PatientUpdate):
    db_patient = get_patient(db, patient_id)
    if not db_patient:
        return None
    for key, value in patient.model_dump(exclude_unset=True).items():
        setattr(db_patient, key, value)
    db.commit()
    db.refresh(db_patient)
    return db_patient

def delete_patient(db: Session, patient_id: int):
    db_patient = get_patient(db, patient_id)
    if not db_patient:
        return None
    
    now = datetime.now(UTC)
    
    # Cascade soft delete to medical records
    from app.crud.medical_record import delete_medical_record
    records = list(db_patient.medical_records)
    for record in records:
        if not record.is_deleted:
            delete_medical_record(db, record.id)
            
    # Cascade soft delete to invoices
    from app.crud.invoice import delete_invoice
    invoices = list(db_patient.invoices)
    for invoice in invoices:
        if not invoice.is_deleted:
            delete_invoice(db, invoice.id)
            
    db_patient.is_deleted = True
    db_patient.deleted_at = now
    db.commit()
    return db_patient

def search_patients(db: Session, query: str):
    return db.query(Patient).join(Owner).filter(
        Patient.is_deleted == False,
        (Patient.name.ilike(f"%{query}%")) | (Owner.phone_number.ilike(f"%{query}%"))
    ).order_by(Patient.id.desc()).all()
