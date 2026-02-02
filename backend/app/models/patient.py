from datetime import date
from sqlalchemy import Integer, String, ForeignKey, Date
from sqlalchemy.orm import Mapped, mapped_column, relationship
from .base import Base, TimestampMixin, SoftDeleteMixin

class Patient(Base, TimestampMixin, SoftDeleteMixin):
    __tablename__ = "patients"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    name: Mapped[str] = mapped_column(String, index=True)
    species: Mapped[str] = mapped_column(String)
    breed: Mapped[str] = mapped_column(String, nullable=True)
    date_of_birth: Mapped[date] = mapped_column(Date, nullable=True)
    owner_id: Mapped[int] = mapped_column(Integer, ForeignKey("owners.id"))

    owner = relationship("Owner", back_populates="patients")
    medical_records = relationship("MedicalRecord", back_populates="patient", cascade="all, delete-orphan")
    invoices = relationship("Invoice", back_populates="patient", cascade="all, delete-orphan")
