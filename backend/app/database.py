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
from sqlalchemy.pool import NullPool

load_dotenv()

_schema_ready = False


def _database_url() -> str:
    url = os.getenv("DATABASE_URL")
    if url:
        return url
    # Vercel's function filesystem is read-only outside /tmp, and a SQLite
    # file there does not survive across instances. Set DATABASE_URL to a
    # hosted MySQL database for any real deployment.
    if os.getenv("VERCEL"):
        return "sqlite:////tmp/medical_camp.db"
    return "sqlite:///./medical_camp.db"


DATABASE_URL = _database_url()

connect_args = {}
engine_kwargs = {"pool_pre_ping": True}
if DATABASE_URL.startswith("sqlite"):
    # Needed only for SQLite when used with FastAPI's threaded requests.
    connect_args = {"check_same_thread": False}
elif os.getenv("VERCEL"):
    # Do not keep a process-wide pool on Fluid Compute; each invocation
    # should open and close its own connection.
    engine_kwargs["poolclass"] = NullPool
    connect_args = {"connect_timeout": 10}

engine = create_engine(DATABASE_URL, connect_args=connect_args, **engine_kwargs)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()


def ensure_schema() -> None:
    """Create tables, then seed sample camps if the table is empty.

    Called from application startup and from the first database request.
    Importing the app must not open a database. A fresh SQLite file (including
    the ephemeral ``/tmp`` file on Vercel) therefore gets the sample camps on
    every new process.
    """
    global _schema_ready
    if _schema_ready:
        return
    Base.metadata.create_all(bind=engine)
    # Imported here so this module can finish loading before models import Base.
    from .seed_data import seed_camps

    db = SessionLocal()
    try:
        seed_camps(db)
    except Exception:
        db.rollback()
        raise
    finally:
        db.close()
    _schema_ready = True


def get_db():
    """FastAPI dependency that yields a DB session and always closes it."""
    ensure_schema()
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
