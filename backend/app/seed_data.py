"""Sample camps shared by startup and by `python seed.py`."""
from datetime import date

from . import models

CAMPS = [
    dict(
        name="General Health Checkup Camp",
        date=date(2026, 10, 15),
        location="Chandigarh",
        description=(
            "A comprehensive general health screening covering blood pressure, "
            "blood sugar, BMI, and a consultation with a general physician. "
            "Suitable for all age groups."
        ),
        services="General Checkup, Blood Pressure, Blood Sugar, BMI, Physician Consultation",
    ),
    dict(
        name="Free Eye Checkup Camp",
        date=date(2026, 10, 20),
        location="Mohali",
        description=(
            "Free vision testing and eye health screening conducted by qualified "
            "ophthalmologists, with on-the-spot spectacle prescriptions for those who need them."
        ),
        services="Vision Test, Eye Pressure Check, Cataract Screening, Ophthalmologist Consultation",
    ),
    dict(
        name="Diabetes Screening Camp",
        date=date(2026, 10, 25),
        location="Delhi",
        description=(
            "Free blood sugar screening, HbA1c testing, and dietary counselling "
            "aimed at early detection and management of diabetes."
        ),
        services="Blood Sugar Test, HbA1c Test, Dietary Counselling, Endocrinologist Consultation",
    ),
    dict(
        name="Women's Health Camp",
        date=date(2026, 10, 30),
        location="Gurgaon",
        description=(
            "A dedicated health camp for women covering general wellness checks, "
            "nutrition guidance, and consultations with gynaecologists."
        ),
        services="General Checkup, Nutrition Guidance, Gynaecologist Consultation, Bone Density Test",
    ),
]


def seed_camps(db) -> int:
    """Insert the sample camps when the table is empty.

    Returns the number of rows inserted. A non-empty table is left unchanged,
    so a restart or a second request does not duplicate camps.
    """
    existing = db.query(models.Camp).count()
    if existing > 0:
        return 0
    for camp_data in CAMPS:
        db.add(models.Camp(**camp_data))
    db.commit()
    return len(CAMPS)
