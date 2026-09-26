from fastapi import FastAPI

from app.core.database import Base, engine
from app.routes.auth import router as auth_router

# Import all models so SQLAlchemy knows about every table
from app import models


Base.metadata.create_all(bind=engine)


app = FastAPI(
    title="Portfolio CMS API",
    version="1.0.0"
)


app.include_router(
    auth_router,
    prefix="/api/v1"
)


@app.get("/")
def root():
    return {
        "message": "Portfolio CMS API is running"
    }


@app.get("/health")
def health():
    return {
        "status": "healthy"
    }