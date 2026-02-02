from sqlalchemy import String, Column, ForeignKey, Enum as SQLEnum
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import Mapped, mapped_column
from .base import Base, TimestampMixin
import enum

class UserRole(str, enum.Enum):
    SUPERADMIN = "SUPERADMIN"
    ADMINISTRATOR = "ADMINISTRATOR"
    VETERINARIAN = "VETERINARIAN"
    SUPPORT_STAFF = "SUPPORT_STAFF"

class Profile(Base, TimestampMixin):
    __tablename__ = "profiles"

    # ID matches Supabase auth.users.id
    id: Mapped[str] = mapped_column(String, primary_key=True, index=True)
    full_name: Mapped[str] = mapped_column(String, index=True)
    role: Mapped[UserRole] = mapped_column(SQLEnum(UserRole, name="user_role"), default=UserRole.SUPPORT_STAFF)
    email: Mapped[str] = mapped_column(String, unique=True, index=True)
