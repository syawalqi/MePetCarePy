import pytest
from app.crud import owner as crud_owner
from app.crud import patient as crud_patient
from app.crud import medical_record as crud_mr
from app.crud import invoice as crud_invoice
from app.schemas.owner import OwnerCreate
from app.schemas.patient import PatientCreate
from app.schemas.medical_record import MedicalRecordCreate
from app.schemas.invoice import InvoiceCreate, InvoiceItemCreate

def test_owner_cascade_soft_delete(db):
    # 1. Setup: Create Owner
    owner_in = OwnerCreate(full_name="Cascade Owner", phone_number="1234567890")
    owner = crud_owner.create_owner(db, owner_in)
    
    # 2. Setup: Create Patient
    patient_in = PatientCreate(name="Cascade Pet", species="Dog", owner_id=owner.id)
    patient = crud_patient.create_patient(db, patient_in)
    
    # 3. Setup: Create Medical Record
    mr_in = MedicalRecordCreate(patient_id=patient.id, subjective="Initial checkup")
    mr = crud_mr.create_medical_record(db, mr_in)
    
    # 4. Setup: Create Invoice
    invoice_in = InvoiceCreate(
        patient_id=patient.id,
        items=[InvoiceItemCreate(description="Exam", quantity=1, unit_price_at_billing=50.0)]
    )
    invoice = crud_invoice.create_invoice(db, invoice_in)
    
    # Verify everything is present
    assert owner.is_deleted is False
    assert patient.is_deleted is False
    assert mr.is_deleted is False
    assert invoice.is_deleted is False
    
    # 5. EXECUTE: Delete Owner
    crud_owner.delete_owner(db, owner.id)
    
    # 6. VERIFY: Cascading soft deletes
    db.refresh(owner)
    db.refresh(patient)
    db.refresh(mr)
    db.refresh(invoice)
    
    assert owner.is_deleted is True
    assert patient.is_deleted is True, "Patient should be soft-deleted"
    assert mr.is_deleted is True, "Medical Record should be soft-deleted"
    assert invoice.is_deleted is True, "Invoice should be soft-deleted"
    
    # Verify they are not returned by standard GETs
    assert crud_owner.get_owner(db, owner.id) is None
    assert crud_patient.get_patient(db, patient.id) is None
    assert crud_mr.get_medical_record(db, mr.id) is None
    assert crud_invoice.get_invoice(db, invoice.id) is None
