from sqlalchemy.orm import Session
from datetime import datetime, UTC
from app.models.invoice import Invoice, InvoiceItem
from app.schemas.invoice import InvoiceCreate, InvoiceUpdate

def get_invoice(db: Session, invoice_id: int):
    return db.query(Invoice).filter(Invoice.id == invoice_id, Invoice.is_deleted == False).first()

def get_invoices(db: Session, skip: int = 0, limit: int = 100):
    return db.query(Invoice).filter(Invoice.is_deleted == False).offset(skip).limit(limit).all()

def create_invoice(db: Session, invoice_in: InvoiceCreate):
    # 1. Calculate total amount
    total = sum(item.unit_price_at_billing * item.quantity for item in invoice_in.items)
    
    # 2. Create the invoice
    db_invoice = Invoice(
        patient_id=invoice_in.patient_id,
        medical_record_id=invoice_in.medical_record_id,
        total_amount=total,
        status="UNPAID"
    )
    db.add(db_invoice)
    db.commit()
    db.refresh(db_invoice)
    
    # 3. Create items
    for item in invoice_in.items:
        db_item = InvoiceItem(
            invoice_id=db_invoice.id,
            **item.model_dump()
        )
        db.add(db_item)
    
    db.commit()
    db.refresh(db_invoice)
    return db_invoice

from sqlalchemy import func, extract

def update_invoice_status(db: Session, invoice_id: int, status: str):
    db_invoice = get_invoice(db, invoice_id)
    if not db_invoice:
        return None
    db_invoice.status = status
    if status == "PAID":
        db_invoice.paid_at = datetime.now(UTC)
    db.commit()
    db.refresh(db_invoice)
    return db_invoice

def get_monthly_report(db: Session, year: int, month: int):
    """
    Aggregates financial data for a specific month.
    Only considers PAID invoices.
    """
    # 1. Total Earnings
    total_earnings = db.query(func.sum(Invoice.total_amount)).filter(
        Invoice.status == "PAID",
        Invoice.is_deleted == False,
        extract('year', Invoice.paid_at) == year,
        extract('month', Invoice.paid_at) == month
    ).scalar() or 0.0

    # 2. Total Patients Billed
    total_patients = db.query(func.count(func.distinct(Invoice.patient_id))).filter(
        Invoice.status == "PAID",
        Invoice.is_deleted == False,
        extract('year', Invoice.paid_at) == year,
        extract('month', Invoice.paid_at) == month
    ).scalar() or 0

    return {
        "year": year,
        "month": month,
        "total_earnings": float(total_earnings),
        "total_patients": total_patients
    }
