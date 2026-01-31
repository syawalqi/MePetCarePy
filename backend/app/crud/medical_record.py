from sqlalchemy.orm import Session
from datetime import datetime, UTC
from app.models.medical_record import MedicalRecord
from app.schemas.medical_record import MedicalRecordCreate, MedicalRecordUpdate

def get_medical_record(db: Session, record_id: int):
    return db.query(MedicalRecord).filter(MedicalRecord.id == record_id, MedicalRecord.is_deleted == False).first()

def get_medical_records(db: Session, skip: int = 0, limit: int = 100):
    return db.query(MedicalRecord).filter(MedicalRecord.is_deleted == False).offset(skip).limit(limit).all()

def get_patient_history(db: Session, patient_id: int):
    return db.query(MedicalRecord).filter(
        MedicalRecord.patient_id == patient_id, 
        MedicalRecord.is_deleted == False
    ).order_by(MedicalRecord.created_at.desc(), MedicalRecord.id.desc()).all()

def create_medical_record(db: Session, record: MedicalRecordCreate):
    db_record = MedicalRecord(**record.model_dump())
    db.add(db_record)
    db.commit()
    db.refresh(db_record)
    return db_record

def update_medical_record(db: Session, record_id: int, record: MedicalRecordUpdate):
    db_record = get_medical_record(db, record_id)
    if not db_record:
        return None
    for key, value in record.model_dump(exclude_unset=True).items():
        setattr(db_record, key, value)
    db.commit()
    db.refresh(db_record)
    return db_record

def delete_medical_record(db: Session, record_id: int):
    db_record = get_medical_record(db, record_id)
    if not db_record:
        return None
    db_record.is_deleted = True
    db_record.deleted_at = datetime.now(UTC)
    db.commit()
    return db_record
