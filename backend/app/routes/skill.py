from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.core.dependencies import require_admin
from app.models.skill import Skill
from app.models.user import User
from app.schemas.skill import (
    SkillCreate,
    SkillUpdate,
    SkillResponse,
)


router = APIRouter(
    prefix="/skills",
    tags=["Skills"]
)


@router.get(
    "",
    response_model=list[SkillResponse]
)
def get_skills(
    db: Session = Depends(get_db)
):
    skills = (
        db.query(Skill)
        .order_by(Skill.display_order.asc(), Skill.id.asc())
        .all()
    )

    return skills


@router.get(
    "/{skill_id}",
    response_model=SkillResponse
)
def get_skill(
    skill_id: int,
    db: Session = Depends(get_db)
):
    skill = (
        db.query(Skill)
        .filter(Skill.id == skill_id)
        .first()
    )

    if skill is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Skill not found"
        )

    return skill


@router.post(
    "",
    response_model=SkillResponse,
    status_code=status.HTTP_201_CREATED
)
def create_skill(
    data: SkillCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_admin)
):
    skill = Skill(
        name=data.name,
        category=data.category,
        description=data.description,
        proficiency=data.proficiency,
        icon=data.icon,
        display_order=data.display_order,
    )

    db.add(skill)
    db.commit()
    db.refresh(skill)

    return skill


@router.put(
    "/{skill_id}",
    response_model=SkillResponse
)
def update_skill(
    skill_id: int,
    data: SkillUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_admin)
):
    skill = (
        db.query(Skill)
        .filter(Skill.id == skill_id)
        .first()
    )

    if skill is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Skill not found"
        )

    skill.name = data.name
    skill.category = data.category
    skill.description = data.description
    skill.proficiency = data.proficiency
    skill.icon = data.icon
    skill.display_order = data.display_order

    db.commit()
    db.refresh(skill)

    return skill


@router.delete(
    "/{skill_id}",
    status_code=status.HTTP_204_NO_CONTENT
)
def delete_skill(
    skill_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_admin)
):
    skill = (
        db.query(Skill)
        .filter(Skill.id == skill_id)
        .first()
    )

    if skill is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Skill not found"
        )

    db.delete(skill)
    db.commit()

    return None