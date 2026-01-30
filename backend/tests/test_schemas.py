import pytest
from datetime import date

def test_schemas_exist():
    from app.schemas.owner import OwnerCreate, OwnerRead, OwnerUpdate
    from app.schemas.patient import PatientCreate, PatientRead, PatientUpdate

def test_owner_schemas():
    from app.schemas.owner import OwnerCreate, OwnerRead
    # Create
    assert "full_name" in OwnerCreate.model_fields
    assert "phone_number" in OwnerCreate.model_fields
    
    # Read
    assert "id" in OwnerRead.model_fields
    assert "created_at" in OwnerRead.model_fields
    assert "patients" in OwnerRead.model_fields # Should include list of patients

def test_patient_schemas():
    from app.schemas.patient import PatientCreate, PatientRead
    # Create
    assert "name" in PatientCreate.model_fields
    assert "species" in PatientCreate.model_fields
    assert "owner_id" in PatientCreate.model_fields

    # Read
    assert "id" in PatientRead.model_fields
    assert "created_at" in PatientRead.model_fields
