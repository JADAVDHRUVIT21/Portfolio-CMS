from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
import os

from app.core.database import Base, engine

from app.routes.auth import router as auth_router
from app.routes.about import router as about_router
from app.routes.skill import router as skill_router
from app.routes.project import router as project_router
from app.routes.blog import router as blog_router
from app.routes.experience import router as experience_router
from app.routes.testimonial import router as testimonial_router
from app.routes.service import router as service_router
from app.routes.media import router as media_router
from app.routes.contact import router as contact_router
from app.routes.messages import router as messages_router
from app.routes.dashboard import router as dashboard_router

# Import all models so SQLAlchemy knows about every table
from app import models


# ---------------------------------------------------------
# CREATE DATABASE TABLES
# ---------------------------------------------------------

Base.metadata.create_all(bind=engine)


# ---------------------------------------------------------
# FASTAPI APP
# ---------------------------------------------------------

app = FastAPI(
    title="Portfolio CMS API",
    version="1.0.0",
)


# ---------------------------------------------------------
# CORS CONFIGURATION
# ---------------------------------------------------------
# Allow both local dev AND production Vercel domains.
# Add your own custom domain here too if you have one.

origins = [
    # Local development
    "http://localhost:5173",
    "http://127.0.0.1:5173",
    "http://localhost:5174",
    "http://127.0.0.1:5174",
    "http://localhost:3000",
    "http://127.0.0.1:3000",

    # Production - Portfolio frontend
    "https://dhruvit-portfolio-cms.vercel.app",

    # Production - Admin panel
    "https://portfolio-cms-admin-panel.vercel.app",

    # Optional: allow all Vercel preview deployments for your projects
    # (Wildcards are NOT supported by CORSMiddleware, so list them explicitly
    #  or use a regex below.)
]

# Also allow any preview deployment URL of your Vercel projects
# and any extra origins from env variable ALLOWED_ORIGINS (comma-separated)
extra_origins = os.getenv("ALLOWED_ORIGINS", "")
if extra_origins:
    origins.extend([o.strip() for o in extra_origins.split(",") if o.strip()])

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_origin_regex=r"https://.*\.vercel\.app",  # allow all *.vercel.app preview URLs
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# ---------------------------------------------------------
# STATIC UPLOADS
# ---------------------------------------------------------
# Ensure uploads dir exists so StaticFiles doesn't crash on first boot

os.makedirs("uploads", exist_ok=True)

app.mount(
    "/uploads",
    StaticFiles(directory="uploads"),
    name="uploads",
)


# ---------------------------------------------------------
# API ROUTES
# ---------------------------------------------------------

app.include_router(auth_router,         prefix="/api/v1")
app.include_router(about_router,        prefix="/api/v1")
app.include_router(skill_router,        prefix="/api/v1")
app.include_router(project_router,      prefix="/api/v1")
app.include_router(blog_router,         prefix="/api/v1")
app.include_router(experience_router,   prefix="/api/v1")
app.include_router(testimonial_router,  prefix="/api/v1")
app.include_router(service_router,      prefix="/api/v1")
app.include_router(media_router,        prefix="/api/v1")
app.include_router(contact_router,      prefix="/api/v1")
app.include_router(messages_router,     prefix="/api/v1")
app.include_router(dashboard_router,    prefix="/api/v1")


# ---------------------------------------------------------
# BASIC ROUTES
# ---------------------------------------------------------

@app.get("/")
def root():
    return {"message": "Portfolio CMS API is running"}


@app.get("/health")
def health():
    return {"status": "healthy"}