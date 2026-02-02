from sqlalchemy.orm import Session
from app.models.user import Profile, UserRole, UserSession
from datetime import datetime, UTC, timedelta

def get_profile(db: Session, user_id: str):
    return db.query(Profile).filter(Profile.id == user_id).first()

def get_profiles(db: Session, skip: int = 0, limit: int = 100):
    return db.query(Profile).filter(Profile.role != UserRole.SUPERADMIN).offset(skip).limit(limit).all()

def create_profile(db: Session, profile_in: dict):
    db_profile = Profile(**profile_in)
    db.add(db_profile)
    db.commit()
    db.refresh(db_profile)
    return db_profile

def delete_profile(db: Session, user_id: str):
    db_profile = get_profile(db, user_id)
    if db_profile:
        db.delete(db_profile)
        db.commit()
    return db_profile

# --- SESSION MANAGEMENT ---

def get_session(db: Session, user_id: str):
    return db.query(UserSession).filter(UserSession.user_id == user_id).first()

def create_or_update_session(db: Session, user_id: str, token: str):
    db_session = get_session(db, user_id)
    now = datetime.now(UTC)
    
    if db_session:
        # If session exists, we update the token and timestamp (handles relogin)
        db_session.session_token = token
        db_session.last_activity = now
    else:
        db_session = UserSession(user_id=user_id, session_token=token, last_activity=now)
        db.add(db_session)
    
    db.commit()
    db.refresh(db_session)
    return db_session

def delete_session(db: Session, user_id: str):
    db_session = get_session(db, user_id)
    if db_session:
        db.delete(db_session)
        db.commit()
    return True

def validate_session(db: Session, user_id: str, token: str):
    db_session = get_session(db, user_id)
    if not db_session:
        return False, "No active session found."
    
    if db_session.session_token != token:
        return False, "Session token mismatch. User might be logged in elsewhere."
    
    # Check inactivity (1 hour)
    if datetime.now(UTC) - db_session.last_activity > timedelta(hours=1):
        db.delete(db_session)
        db.commit()
        return False, "Session expired due to inactivity."
    
    # Update last activity
    db_session.last_activity = datetime.now(UTC)
    db.commit()
    return True, "Valid"
