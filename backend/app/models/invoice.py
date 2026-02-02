from sqlalchemy import Integer, String, ForeignKey, Float, DateTime, Enum as SQLEnum
from sqlalchemy.orm import Mapped, mapped_column, relationship
from datetime import datetime
import enum
from .base import Base, TimestampMixin, SoftDeleteMixin

class InvoiceStatus(str, enum.Enum):
    UNPAID = "UNPAID"
    PAID = "PAID"
    CANCELLED = "CANCELLED"

class Invoice(Base, TimestampMixin, SoftDeleteMixin):
    __tablename__ = "invoices"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    patient_id: Mapped[int] = mapped_column(Integer, ForeignKey("patients.id"))
    medical_record_id: Mapped[int | None] = mapped_column(Integer, ForeignKey("medical_records.id"), nullable=True)
    total_amount: Mapped[float] = mapped_column(Float, default=0.0)
    status: Mapped[InvoiceStatus] = mapped_column(SQLEnum(InvoiceStatus, name="invoice_status"), default=InvoiceStatus.UNPAID)
    paid_at: Mapped[datetime | None] = mapped_column(DateTime(timezone=True), nullable=True)

    patient = relationship("Patient", back_populates="invoices")
    medical_record = relationship("MedicalRecord")
    items = relationship("InvoiceItem", back_populates="invoice", cascade="all, delete-orphan")

class InvoiceItem(Base, TimestampMixin):
    __tablename__ = "invoice_items"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    invoice_id: Mapped[int] = mapped_column(Integer, ForeignKey("invoices.id"))
    description: Mapped[str] = mapped_column(String)
    quantity: Mapped[int] = mapped_column(Integer, default=1)
    unit_price_at_billing: Mapped[float] = mapped_column(Float)

    invoice = relationship("Invoice", back_populates="items")
