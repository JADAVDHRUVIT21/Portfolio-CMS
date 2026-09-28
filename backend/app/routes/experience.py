from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.core.dependencies import require_admin
from app.models.experience import Experience
from app.models.user import User
from app.schemas.experience import (
    ExperienceCreate,
    ExperienceUpdate,
    ExperienceResponse,
)


router = APIRouter(
    prefix="/experience",
    tags=["Experience"]
)


@router.get(
    "",
    response_model=list[ExperienceResponse]
)
def get_experiences(
    db: Session = Depends(get_db)
):
    experiences = (
        db.query(Experience)
        .order_by(
            Experience.display_order.asc(),
            Experience.id.asc()
        )
        .all()
    )

    return experiences


@router.get(
    "/{experience_id}",
    response_model=ExperienceResponse
)
def get_experience(
    experience_id: int,
    db: Session = Depends(get_db),
):
    experience = (
        db.query(Experience)
        .filter(Experience.id == experience_id)
        .first()
    )

    if experience is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Experience not found",
        )

    return experience


@router.post(
    "",
    response_model=ExperienceResponse,
    status_code=status.HTTP_201_CREATED,
)
def create_experience(
    data: ExperienceCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_admin),
):
    experience = Experience(
        company=data.company,
        position=data.position,
        description=data.description,
        start_date=data.start_date,
        end_date=data.end_date,
        is_current=data.is_current,
        display_order=data.display_order,
    )

    db.add(experience)
    db.commit()
    db.refresh(experience)

    return experience


@router.put(
    "/{experience_id}",
    response_model=ExperienceResponse,
)
def update_experience(
    experience_id: int,
    data: ExperienceUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_admin),
):
    experience = (
        db.query(Experience)
        .filter(Experience.id == experience_id)
        .first()
    )

    if experience is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Experience not found",
        )

    experience.company = data.company
    experience.position = data.position
    experience.description = data.description
    experience.start_date = data.start_date
    experience.end_date = data.end_date
    experience.is_current = data.is_current
    experience.display_order = data.display_order

    db.commit()
    db.refresh(experience)

    return experience


@router.delete(
    "/{experience_id}",
    status_code=status.HTTP_204_NO_CONTENT,
)
def delete_experience(
    experience_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_admin),
):
    experience = (
        db.query(Experience)
        .filter(Experience.id == experience_id)
        .first()
    )

    if experience is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Experience not found",
        )

    db.delete(experience)
    db.commit()

    return None