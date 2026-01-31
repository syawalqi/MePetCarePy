import pytest
from app.models.invoice import Invoice, InvoiceItem

def test_invoice_model_structure():
    assert hasattr(Invoice, "id")
    assert hasattr(Invoice, "patient_id")
    assert hasattr(Invoice, "medical_record_id")
    assert hasattr(Invoice, "total_amount")
    assert hasattr(Invoice, "status")
    assert hasattr(Invoice, "created_at")
    assert hasattr(Invoice, "paid_at")

def test_invoice_item_model_structure():
    assert hasattr(InvoiceItem, "id")
    assert hasattr(InvoiceItem, "invoice_id")
    assert hasattr(InvoiceItem, "description")
    assert hasattr(InvoiceItem, "quantity")
    assert hasattr(InvoiceItem, "unit_price_at_billing")
