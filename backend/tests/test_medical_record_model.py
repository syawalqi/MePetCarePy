import pytest
from app.models.medical_record import MedicalRecord

def test_medical_record_model_structure():
    # Verify presence of all required fields from the specification
    assert hasattr(MedicalRecord, "id")
    assert hasattr(MedicalRecord, "patient_id")
    assert hasattr(MedicalRecord, "subjective")
    assert hasattr(MedicalRecord, "objective")
    assert hasattr(MedicalRecord, "assessment")
    assert hasattr(MedicalRecord, "plan")
    
    # Vital Signs
    assert hasattr(MedicalRecord, "weight")
    assert hasattr(MedicalRecord, "temperature")
    assert hasattr(MedicalRecord, "heart_rate")
    assert hasattr(MedicalRecord, "respiration_rate")
    
    # Infrastructure fields
    assert hasattr(MedicalRecord, "is_deleted")
    assert hasattr(MedicalRecord, "created_at")
    assert hasattr(MedicalRecord, "updated_at")
