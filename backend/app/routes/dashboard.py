from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.core.dependencies import get_current_user
from app.models.user import User
from app.models.about import About
from app.models.skill import Skill
from app.models.project import Project
from app.models.blog import Blog
from app.models.experience import Experience
from app.models.testimonial import Testimonial
from app.models.service import Service
from app.models.message import Message
from app.models.media import Media


router = APIRouter(
    prefix="/dashboard",
    tags=["Dashboard"],
)


@router.get("/summary")
def get_dashboard_summary(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    return {
        "about": db.query(About).count(),
        "skills": db.query(Skill).count(),
        "projects": db.query(Project).count(),
        "blogs": db.query(Blog).count(),
        "experience": db.query(Experience).count(),
        "testimonials": db.query(Testimonial).count(),
        "services": db.query(Service).count(),
        "messages": db.query(Message).count(),
        "unread_messages": (
            db.query(Message)
            .filter(Message.is_read == False)
            .count()
        ),
        "media": db.query(Media).count(),
    }