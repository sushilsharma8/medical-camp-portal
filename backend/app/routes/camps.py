from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from .. import crud, schemas
from ..database import get_db

router = APIRouter(prefix="/api/camps", tags=["Camps"])


@router.get("", response_model=list[schemas.CampOut])
def list_camps(db: Session = Depends(get_db)):
    return crud.get_camps(db)


@router.get("/{camp_id}", response_model=schemas.CampOut)
def get_camp(camp_id: int, db: Session = Depends(get_db)):
    camp = crud.get_camp(db, camp_id)
    if not camp:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Camp not found")
    return camp


@router.post("", response_model=schemas.CampOut, status_code=status.HTTP_201_CREATED)
def create_camp(camp: schemas.CampCreate, db: Session = Depends(get_db)):
    return crud.create_camp(db, camp)
