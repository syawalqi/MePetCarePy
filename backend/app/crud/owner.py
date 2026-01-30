from sqlalchemy.orm import Session
from datetime import datetime, UTC
from app.models.owner import Owner
from app.schemas.owner import OwnerCreate, OwnerUpdate

def get_owner(db: Session, owner_id: int):
    return db.query(Owner).filter(Owner.id == owner_id, Owner.is_deleted == False).first()

def get_owners(db: Session, skip: int = 0, limit: int = 100):
    return db.query(Owner).filter(Owner.is_deleted == False).offset(skip).limit(limit).all()

def create_owner(db: Session, owner: OwnerCreate):
    db_owner = Owner(**owner.model_dump())
    db.add(db_owner)
    db.commit()
    db.refresh(db_owner)
    return db_owner

def update_owner(db: Session, owner_id: int, owner: OwnerUpdate):
    db_owner = get_owner(db, owner_id)
    if not db_owner:
        return None
    for key, value in owner.model_dump(exclude_unset=True).items():
        setattr(db_owner, key, value)
    db.commit()
    db.refresh(db_owner)
    return db_owner

def delete_owner(db: Session, owner_id: int):
    db_owner = get_owner(db, owner_id)
    if not db_owner:
        return None
    db_owner.is_deleted = True
    db_owner.deleted_at = datetime.now(UTC)
    db.commit()
    return db_owner

def search_owners(db: Session, query: str):
    return db.query(Owner).filter(
        Owner.is_deleted == False,
        (Owner.full_name.ilike(f"%{query}%")) | (Owner.phone_number.ilike(f"%{query}%"))
    ).all()
