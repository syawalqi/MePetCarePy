from sqlalchemy import Integer, String, Text
from sqlalchemy.orm import Mapped, mapped_column, relationship
from .base import Base, TimestampMixin, SoftDeleteMixin

class Owner(Base, TimestampMixin, SoftDeleteMixin):
    __tablename__ = "owners"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    full_name: Mapped[str] = mapped_column(String, index=True)
    email: Mapped[str] = mapped_column(String, unique=True, index=True, nullable=True)
    phone_number: Mapped[str] = mapped_column(String, index=True)
    address: Mapped[str] = mapped_column(Text, nullable=True)

    patients = relationship("Patient", back_populates="owner")
