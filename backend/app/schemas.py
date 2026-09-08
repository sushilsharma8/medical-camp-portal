import re
from datetime import date, datetime
from typing import Optional, List

from pydantic import BaseModel, EmailStr, field_validator, ConfigDict

PHONE_RE = re.compile(r"^\+?[0-9]{7,15}$")


# ---------- Camp schemas ----------

class CampBase(BaseModel):
    name: str
    date: date
    location: str
    description: str
    services: str


class CampCreate(CampBase):
    pass


class CampOut(CampBase):
    model_config = ConfigDict(from_attributes=True)

    id: int
    created_at: Optional[datetime] = None

    @property
    def services_list(self) -> List[str]:
        return [s.strip() for s in self.services.split(",") if s.strip()]


# ---------- Registration schemas ----------

class RegistrationBase(BaseModel):
    full_name: str
    age: int
    gender: str
    contact_number: str
    email: EmailStr
    address: str
    camp_id: int
    preferred_time: Optional[str] = None
    health_concern: Optional[str] = None

    @field_validator("full_name")
    @classmethod
    def name_not_empty(cls, v: str) -> str:
        if not v or not v.strip():
            raise ValueError("Full name cannot be empty")
        if len(v.strip()) < 2:
            raise ValueError("Full name must be at least 2 characters")
        return v.strip()

    @field_validator("age")
    @classmethod
    def age_valid(cls, v: int) -> int:
        if v <= 0:
            raise ValueError("Age must be a valid positive number")
        if v > 120:
            raise ValueError("Age must be a realistic number")
        return v

    @field_validator("gender")
    @classmethod
    def gender_not_empty(cls, v: str) -> str:
        if not v or not v.strip():
            raise ValueError("Gender is required")
        return v.strip()

    @field_validator("contact_number")
    @classmethod
    def phone_valid(cls, v: str) -> str:
        cleaned = v.strip().replace(" ", "").replace("-", "")
        if not PHONE_RE.match(cleaned):
            raise ValueError("Contact number must be a valid phone number (7-15 digits)")
        return cleaned

    @field_validator("address")
    @classmethod
    def address_not_empty(cls, v: str) -> str:
        if not v or not v.strip():
            raise ValueError("Address cannot be empty")
        return v.strip()


class RegistrationCreate(RegistrationBase):
    pass


class RegistrationUpdate(BaseModel):
    full_name: Optional[str] = None
    age: Optional[int] = None
    gender: Optional[str] = None
    contact_number: Optional[str] = None
    email: Optional[EmailStr] = None
    address: Optional[str] = None
    camp_id: Optional[int] = None
    preferred_time: Optional[str] = None
    health_concern: Optional[str] = None


class RegistrationOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    registration_id: str
    full_name: str
    age: int
    gender: str
    contact_number: str
    email: EmailStr
    address: str
    camp_id: int
    preferred_time: Optional[str] = None
    health_concern: Optional[str] = None
    created_at: Optional[datetime] = None
    camp: Optional[CampOut] = None


class MessageResponse(BaseModel):
    detail: str
