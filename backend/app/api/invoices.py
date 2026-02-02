from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from datetime import datetime
from app.database import get_db
from app.schemas.invoice import InvoiceCreate, InvoiceRead, InvoiceUpdate
from app.crud import invoice as crud_invoice
from app.dependencies import check_role
from app.models.user import UserRole
from app.logger import log_action

router = APIRouter(prefix="/invoices", tags=["invoices"])

# All staff can manage invoices and payments
ALL_STAFF = [UserRole.SUPERADMIN, UserRole.ADMINISTRATOR, UserRole.VETERINARIAN, UserRole.SUPPORT_STAFF]

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
        data={
            "total": db_invoice.total_amount,
            "patient_id": db_invoice.patient_id,
            "item_count": len(invoice.items)
        }
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
    current_profile = Depends(check_role([UserRole.SUPERADMIN, UserRole.ADMINISTRATOR, UserRole.VETERINARIAN]))
):
    if not update.status:
        raise HTTPException(status_code=400, detail="Status is required")
        
    # Fetch current invoice to log old status
    db_invoice = crud_invoice.get_invoice(db, invoice_id)
    if not db_invoice:
        raise HTTPException(status_code=404, detail="Invoice not found")
    
    old_status = db_invoice.status
    db_invoice = crud_invoice.update_invoice_status(db, invoice_id, update.status)
    
    log_action(
        user_id=current_profile.id,
        role=current_profile.role,
        action="UPDATE_STATUS",
        entity="INVOICE",
        entity_id=str(invoice_id),
        data={
            "old_status": old_status,
            "new_status": update.status
        }
    )
    return db_invoice

@router.delete("/{invoice_id}", response_model=InvoiceRead)
def delete_invoice(
    invoice_id: int,
    db: Session = Depends(get_db),
    current_profile = Depends(check_role([UserRole.SUPERADMIN]))
):
    db_invoice = crud_invoice.delete_invoice(db, invoice_id)
    if not db_invoice:
        raise HTTPException(status_code=404, detail="Invoice not found")
    
    log_action(
        user_id=current_profile.id,
        role=current_profile.role,
        action="DELETE",
        entity="INVOICE",
        entity_id=str(invoice_id)
    )
    return db_invoice

import io
from fastapi.responses import StreamingResponse
from reportlab.pdfgen import canvas
from reportlab.lib.pagesizes import letter

@router.get("/reports/monthly", status_code=status.HTTP_200_OK)
def get_monthly_summary(
    year: int, 
    month: int, 
    db: Session = Depends(get_db),
    _ = Depends(check_role([UserRole.SUPERADMIN, UserRole.ADMINISTRATOR]))
):
    return crud_invoice.get_monthly_report(db, year=year, month=month)

@router.get("/reports/monthly/pdf")
def export_monthly_report_pdf(
    year: int, 
    month: int, 
    db: Session = Depends(get_db),
    _ = Depends(check_role([UserRole.SUPERADMIN, UserRole.ADMINISTRATOR]))
):
    report = crud_invoice.get_monthly_report(db, year=year, month=month)
    month_name = datetime(year, month, 1).strftime('%B')
    
    # Generate PDF in memory
    buffer = io.BytesIO()
    p = canvas.Canvas(buffer, pagesize=letter)
    
    # Header
    p.setFont("Helvetica-Bold", 20)
    p.drawString(50, 750, "MePetCarePy Clinic")
    p.setFont("Helvetica", 14)
    p.drawString(50, 730, f"Monthly Financial Summary: {month_name} {year}")
    p.line(50, 720, 550, 720)
    
    # Data
    p.setFont("Helvetica", 12)
    p.drawString(70, 680, f"Total Monthly Earnings:")
    p.setFont("Helvetica-Bold", 12)
    p.drawString(250, 680, f"${report['total_earnings']:,.2f}")
    
    p.setFont("Helvetica", 12)
    p.drawString(70, 650, f"Total Patients Billed:")
    p.setFont("Helvetica-Bold", 12)
    p.drawString(250, 650, f"{report['total_patients']}")
    
    # Footer
    p.setFont("Helvetica-Oblique", 10)
    p.drawString(50, 50, f"Report generated on: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
    
    p.showPage()
    p.save()
    
    buffer.seek(0)
    filename = f"Financial_Report_{year}_{month}.pdf"
    return StreamingResponse(
        buffer, 
        media_type="application/pdf",
        headers={"Content-Disposition": f"attachment; filename={filename}"}
    )
