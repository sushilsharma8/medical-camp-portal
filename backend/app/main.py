import os

from fastapi import FastAPI, Request, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from fastapi.exceptions import RequestValidationError
from sqlalchemy.exc import SQLAlchemyError

from .database import Base, engine
from .routes import camps, registrations

# Create all tables if they don't exist yet.
Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="Medical Camp Registration Portal API",
    description="REST API for browsing medical camps and managing registrations.",
    version="1.0.0",
)

origins_env = os.getenv("FRONTEND_ORIGIN", "http://localhost:5173")
origins = [o.strip() for o in origins_env.split(",") if o.strip()]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins if origins else ["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.exception_handler(RequestValidationError)
async def validation_exception_handler(request: Request, exc: RequestValidationError):
    """Return clean, field-level error messages instead of raw pydantic dumps."""
    errors = []
    for err in exc.errors():
        field = err["loc"][-1] if err.get("loc") else "field"
        errors.append({"field": field, "message": err.get("msg", "Invalid value")})
    return JSONResponse(
        status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
        content={"detail": "Validation failed", "errors": errors},
    )


@app.exception_handler(SQLAlchemyError)
async def db_exception_handler(request: Request, exc: SQLAlchemyError):
    return JSONResponse(
        status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
        content={"detail": "A database error occurred. Please try again later."},
    )


app.include_router(camps.router)
app.include_router(registrations.router)


@app.get("/", tags=["Health"])
def root():
    return {"status": "ok", "service": "Medical Camp Registration Portal API"}


@app.get("/api/health", tags=["Health"])
def health_check():
    return {"status": "healthy"}
