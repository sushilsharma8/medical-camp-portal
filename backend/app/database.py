"""
Database engine and session configuration.

Reads DATABASE_URL from the environment (see .env.example). The project is
designed for MySQL + SQLAlchemy, but if no DATABASE_URL is set it falls back
to a local SQLite file so the app can still be started for a quick smoke
test without a MySQL server installed.
"""
import os
from dotenv import load_dotenv
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base

load_dotenv()

DATABASE_URL = os.getenv("DATABASE_URL", "sqlite:///./medical_camp.db")

connect_args = {}
if DATABASE_URL.startswith("sqlite"):
    # Needed only for SQLite when used with FastAPI's threaded requests.
    connect_args = {"check_same_thread": False}

engine = create_engine(DATABASE_URL, connect_args=connect_args, pool_pre_ping=True)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()


def get_db():
    """FastAPI dependency that yields a DB session and always closes it."""
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
