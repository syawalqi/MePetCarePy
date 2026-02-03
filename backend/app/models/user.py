from sqlalchemy import String, Column, ForeignKey, Enum as SQLEnum, DateTime
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import Mapped, mapped_column, relationship
from .base import Base, TimestampMixin
import enum
from datetime import datetime, UTC

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

    sessions = relationship("UserSession", back_populates="user", cascade="all, delete-orphan")

class UserSession(Base):
    __tablename__ = "user_sessions"

    id: Mapped[int] = mapped_column(primary_key=True)
    user_id: Mapped[str] = mapped_column(String, ForeignKey("profiles.id"), unique=True) # Unique ensures single session
    session_token: Mapped[str] = mapped_column(String, index=True) # JWT or random token
    last_activity: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=lambda: datetime.now(UTC))
    expires_at: Mapped[datetime] = mapped_column(DateTime(timezone=True))
    
    user = relationship("Profile", back_populates="sessions")
