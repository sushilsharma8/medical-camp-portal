from sqlalchemy import Column, Integer, String, Text, Date, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func

from .database import Base


class Camp(Base):
    __tablename__ = "camps"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(150), nullable=False)
    date = Column(Date, nullable=False)
    location = Column(String(150), nullable=False)
    description = Column(Text, nullable=False)
    services = Column(String(500), nullable=False)  # comma-separated list
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    registrations = relationship(
        "Registration", back_populates="camp", cascade="all, delete-orphan"
    )


class Registration(Base):
    __tablename__ = "registrations"

    id = Column(Integer, primary_key=True, index=True)
    registration_id = Column(String(30), unique=True, nullable=False, index=True)
    full_name = Column(String(150), nullable=False)
    age = Column(Integer, nullable=False)
    gender = Column(String(20), nullable=False)
    contact_number = Column(String(20), nullable=False)
    email = Column(String(150), nullable=False)
    address = Column(String(300), nullable=False)
    camp_id = Column(Integer, ForeignKey("camps.id"), nullable=False)
    preferred_time = Column(String(50), nullable=True)
    health_concern = Column(Text, nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    camp = relationship("Camp", back_populates="registrations")
