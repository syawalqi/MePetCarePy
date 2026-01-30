import pytest
from sqlalchemy.orm import DeclarativeBase

# We anticipate these imports will fail initially
try:
    from app.models.owner import Owner
    from app.models.patient import Patient
except ImportError:
    pass

def test_models_exist():
    # This test is just to confirm we can import them, failing if we can't
    from app.models.owner import Owner
    from app.models.patient import Patient

def test_owner_model_structure():
    from app.models.owner import Owner
    assert hasattr(Owner, "id")
    assert hasattr(Owner, "full_name")
    assert hasattr(Owner, "email")
    assert hasattr(Owner, "phone_number")
    assert hasattr(Owner, "address")
    assert hasattr(Owner, "is_deleted")
    assert hasattr(Owner, "created_at")
    assert hasattr(Owner, "updated_at")

def test_patient_model_structure():
    from app.models.patient import Patient
    assert hasattr(Patient, "id")
    assert hasattr(Patient, "name")
    assert hasattr(Patient, "species")
    assert hasattr(Patient, "breed")
    assert hasattr(Patient, "date_of_birth")
    assert hasattr(Patient, "owner_id")
    assert hasattr(Patient, "is_deleted")
    assert hasattr(Patient, "created_at")
    assert hasattr(Patient, "updated_at")
