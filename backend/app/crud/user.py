from sqlalchemy.orm import Session
from app.models.user import Profile

def get_profile(db: Session, user_id: str):
    return db.query(Profile).filter(Profile.id == user_id).first()

def get_profiles(db: Session, skip: int = 0, limit: int = 100):
    return db.query(Profile).offset(skip).limit(limit).all()

def create_profile(db: Session, profile_in: dict):
    db_profile = Profile(**profile_in)
    db.add(db_profile)
    db.commit()
    db.refresh(db_profile)
    return db_profile
