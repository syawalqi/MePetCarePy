import pytest
from app.schemas.invoice import InvoiceCreate, InvoiceRead, InvoiceItemCreate, InvoiceItemRead

def test_invoice_item_schemas():
    # Create
    item_create = InvoiceItemCreate(description="Service", unit_price_at_billing=50.0, quantity=1)
    assert item_create.description == "Service"
    assert item_create.unit_price_at_billing == 50.0
    
    # Read
    assert "id" in InvoiceItemRead.model_fields

def test_invoice_schemas():
    # Create
    invoice_create = InvoiceCreate(
        patient_id=1,
        items=[InvoiceItemCreate(description="Service", unit_price_at_billing=50.0)]
    )
    assert invoice_create.patient_id == 1
    assert len(invoice_create.items) == 1
    
    # Read
    assert "id" in InvoiceRead.model_fields
    assert "status" in InvoiceRead.model_fields
    assert "total_amount" in InvoiceRead.model_fields
