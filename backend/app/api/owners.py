from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from app.database import get_db
from app.schemas.owner import OwnerCreate, OwnerRead, OwnerUpdate
from app.crud import owner as crud_owner

router = APIRouter(prefix="/owners", tags=["owners"])

@router.post("/", response_model=OwnerRead, status_code=status.HTTP_201_CREATED)
def create_owner(owner: OwnerCreate, db: Session = Depends(get_db)):
    return crud_owner.create_owner(db, owner)

@router.get("/", response_model=List[OwnerRead])
def read_owners(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    return crud_owner.get_owners(db, skip=skip, limit=limit)

@router.get("/search/", response_model=List[OwnerRead])
def search_owners(query: str, db: Session = Depends(get_db)):
    return crud_owner.search_owners(db, query=query)

@router.get("/{owner_id}", response_model=OwnerRead)
def read_owner(owner_id: int, db: Session = Depends(get_db)):
    db_owner = crud_owner.get_owner(db, owner_id)
    if db_owner is None:
        raise HTTPException(status_code=404, detail="Owner not found")
    return db_owner

@router.put("/{owner_id}", response_model=OwnerRead)
def update_owner(owner_id: int, owner: OwnerUpdate, db: Session = Depends(get_db)):
    db_owner = crud_owner.update_owner(db, owner_id, owner)
    if db_owner is None:
        raise HTTPException(status_code=404, detail="Owner not found")
    return db_owner

@router.delete("/{owner_id}", response_model=OwnerRead)
def delete_owner(owner_id: int, db: Session = Depends(get_db)):
    db_owner = crud_owner.delete_owner(db, owner_id)
    if db_owner is None:
        raise HTTPException(status_code=404, detail="Owner not found")
    return db_owner
