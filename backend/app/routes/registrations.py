from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from .. import crud, schemas
from ..database import get_db

router = APIRouter(prefix="/api/registrations", tags=["Registrations"])


@router.post("", response_model=schemas.RegistrationOut, status_code=status.HTTP_201_CREATED)
def create_registration(reg: schemas.RegistrationCreate, db: Session = Depends(get_db)):
    camp = crud.get_camp(db, reg.camp_id)
    if not camp:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Selected camp does not exist. Please choose a valid camp.",
        )
    try:
        return crud.create_registration(db, reg)
    except Exception as exc:  # pragma: no cover - safety net for DB errors
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Could not save registration: {str(exc)}",
        )


@router.get("", response_model=list[schemas.RegistrationOut])
def list_registrations(db: Session = Depends(get_db)):
    return crud.get_registrations(db)


@router.get("/{registration_id}", response_model=schemas.RegistrationOut)
def get_registration(registration_id: int, db: Session = Depends(get_db)):
    reg = crud.get_registration(db, registration_id)
    if not reg:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Registration not found")
    return reg


@router.put("/{registration_id}", response_model=schemas.RegistrationOut)
def update_registration(
    registration_id: int, data: schemas.RegistrationUpdate, db: Session = Depends(get_db)
):
    if data.camp_id is not None and not crud.get_camp(db, data.camp_id):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST, detail="Selected camp does not exist"
        )
    reg = crud.update_registration(db, registration_id, data)
    if not reg:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Registration not found")
    return reg


@router.delete("/{registration_id}", response_model=schemas.MessageResponse)
def delete_registration(registration_id: int, db: Session = Depends(get_db)):
    deleted = crud.delete_registration(db, registration_id)
    if not deleted:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Registration not found")
    return {"detail": "Registration deleted successfully"}
