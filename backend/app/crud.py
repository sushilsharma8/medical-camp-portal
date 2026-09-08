import random
import string
from datetime import datetime

from sqlalchemy.orm import Session

from . import models, schemas


# ---------- Camps ----------

def get_camps(db: Session):
    return db.query(models.Camp).order_by(models.Camp.date.asc()).all()


def get_camp(db: Session, camp_id: int):
    return db.query(models.Camp).filter(models.Camp.id == camp_id).first()


def create_camp(db: Session, camp: schemas.CampCreate):
    db_camp = models.Camp(**camp.model_dump())
    db.add(db_camp)
    db.commit()
    db.refresh(db_camp)
    return db_camp


# ---------- Registrations ----------

def _generate_registration_id(db: Session) -> str:
    """Generate a unique ID like MC-2026-001."""
    year = datetime.utcnow().year
    while True:
        suffix = "".join(random.choices(string.digits, k=4))
        candidate = f"MC-{year}-{suffix}"
        exists = (
            db.query(models.Registration)
            .filter(models.Registration.registration_id == candidate)
            .first()
        )
        if not exists:
            return candidate


def create_registration(db: Session, reg: schemas.RegistrationCreate):
    registration_id = _generate_registration_id(db)
    db_reg = models.Registration(
        registration_id=registration_id,
        **reg.model_dump(),
    )
    db.add(db_reg)
    db.commit()
    db.refresh(db_reg)
    return db_reg


def get_registrations(db: Session):
    return (
        db.query(models.Registration)
        .order_by(models.Registration.created_at.desc())
        .all()
    )


def get_registration(db: Session, registration_id: int):
    return (
        db.query(models.Registration)
        .filter(models.Registration.id == registration_id)
        .first()
    )


def update_registration(db: Session, registration_id: int, data: schemas.RegistrationUpdate):
    db_reg = get_registration(db, registration_id)
    if not db_reg:
        return None
    update_data = data.model_dump(exclude_unset=True)
    for key, value in update_data.items():
        setattr(db_reg, key, value)
    db.commit()
    db.refresh(db_reg)
    return db_reg


def delete_registration(db: Session, registration_id: int):
    db_reg = get_registration(db, registration_id)
    if not db_reg:
        return False
    db.delete(db_reg)
    db.commit()
    return True
