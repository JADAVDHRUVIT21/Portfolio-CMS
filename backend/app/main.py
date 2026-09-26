from fastapi import FastAPI

from app.core.database import Base, engine
from app.routes.auth import router as auth_router
from app.routes.about import router as about_router
from app.routes.skill import router as skill_router
from app.routes.project import router as project_router

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

app.include_router(
    about_router,
    prefix="/api/v1"
)

app.include_router(
    skill_router,
    prefix="/api/v1"
)

app.include_router(
    project_router,
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