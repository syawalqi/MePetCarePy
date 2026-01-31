from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from app.database import get_db
from app.schemas.invoice import InvoiceCreate, InvoiceRead, InvoiceUpdate
from app.crud import invoice as crud_invoice
from app.dependencies import check_role
from app.models.user import UserRole
from app.logger import log_action

router = APIRouter(prefix="/invoices", tags=["invoices"])

# All staff can manage invoices and payments
ALL_STAFF = [UserRole.ADMINISTRATOR, UserRole.VETERINARIAN, UserRole.SUPPORT_STAFF]

@router.post("/", response_model=InvoiceRead, status_code=status.HTTP_201_CREATED)
def create_invoice(
    invoice: InvoiceCreate, 
    db: Session = Depends(get_db),
    current_profile = Depends(check_role(ALL_STAFF))
):
    db_invoice = crud_invoice.create_invoice(db, invoice)
    log_action(
        user_id=current_profile.id,
        role=current_profile.role,
        action="CREATE",
        entity="INVOICE",
        entity_id=str(db_invoice.id),
        data={"total": db_invoice.total_amount}
    )
    return db_invoice

@router.get("/", response_model=List[InvoiceRead])
def read_invoices(
    skip: int = 0, 
    limit: int = 100, 
    db: Session = Depends(get_db),
    _ = Depends(check_role(ALL_STAFF))
):
    return crud_invoice.get_invoices(db, skip=skip, limit=limit)

@router.get("/{invoice_id}", response_model=InvoiceRead)
def read_invoice(
    invoice_id: int, 
    db: Session = Depends(get_db),
    _ = Depends(check_role(ALL_STAFF))
):
    db_invoice = crud_invoice.get_invoice(db, invoice_id)
    if not db_invoice:
        raise HTTPException(status_code=404, detail="Invoice not found")
    return db_invoice

@router.patch("/{invoice_id}/status", response_model=InvoiceRead)
def update_status(
    invoice_id: int, 
    update: InvoiceUpdate, 
    db: Session = Depends(get_db),
    current_profile = Depends(check_role(ALL_STAFF))
):
    if not update.status:
        raise HTTPException(status_code=400, detail="Status is required")
        
    db_invoice = crud_invoice.update_invoice_status(db, invoice_id, update.status)
    if not db_invoice:
        raise HTTPException(status_code=404, detail="Invoice not found")
    
    log_action(
        user_id=current_profile.id,
        role=current_profile.role,
        action="UPDATE_STATUS",
        entity="INVOICE",
        entity_id=str(invoice_id),
        data={"new_status": update.status}
    )
    return db_invoice

@router.get("/reports/monthly", status_code=status.HTTP_200_OK)
def get_monthly_summary(
    year: int, 
    month: int, 
    db: Session = Depends(get_db),
    _ = Depends(check_role([UserRole.ADMINISTRATOR]))
):
    return crud_invoice.get_monthly_report(db, year=year, month=month)
