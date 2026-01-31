import pytest
from app.schemas.medical_record import MedicalRecordCreate, MedicalRecordRead

def test_medical_record_schemas_structure():
    # Create Schema
    assert "patient_id" in MedicalRecordCreate.model_fields
    assert "subjective" in MedicalRecordCreate.model_fields
    assert "objective" in MedicalRecordCreate.model_fields
    assert "assessment" in MedicalRecordCreate.model_fields
    assert "plan" in MedicalRecordCreate.model_fields
    
    # Read Schema
    assert "id" in MedicalRecordRead.model_fields
    assert "created_at" in MedicalRecordRead.model_fields
    assert "updated_at" in MedicalRecordRead.model_fields
