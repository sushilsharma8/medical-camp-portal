"""
Seed sample camps. The API also does this when the camps table is empty,
so this script is only needed if you want to run it by hand:

    cd backend
    python seed.py
"""
from app.database import Base, SessionLocal, engine
from app.seed_data import seed_camps
from app import models


def seed():
    Base.metadata.create_all(bind=engine)
    db = SessionLocal()
    try:
        added = seed_camps(db)
        if added:
            print(f"Seeded {added} camps successfully.")
            return
        existing = db.query(models.Camp).count()
        print(f"Camps table already has {existing} rows — skipping seed.")
    finally:
        db.close()


if __name__ == "__main__":
    seed()
