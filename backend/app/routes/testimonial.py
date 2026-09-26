from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.core.dependencies import get_current_user
from app.models.testimonial import Testimonial
from app.models.user import User
from app.schemas.testimonial import (
    TestimonialCreate,
    TestimonialUpdate,
    TestimonialResponse,
)

router = APIRouter(prefix="/testimonials", tags=["Testimonials"])


@router.get("", response_model=list[TestimonialResponse])
def get_testimonials(db: Session = Depends(get_db)):
    testimonials = (
        db.query(Testimonial)
        .filter(Testimonial.is_published == True)
        .order_by(
            Testimonial.display_order.asc(),
            Testimonial.id.asc()
        )
        .all()
    )
    return testimonials


@router.get("/{testimonial_id}", response_model=TestimonialResponse)
def get_testimonial(
    testimonial_id: int,
    db: Session = Depends(get_db),
):
    testimonial = (
        db.query(Testimonial)
        .filter(
            Testimonial.id == testimonial_id,
            Testimonial.is_published == True,
        )
        .first()
    )

    if testimonial is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Testimonial not found",
        )

    return testimonial


@router.post(
    "",
    response_model=TestimonialResponse,
    status_code=status.HTTP_201_CREATED,
)
def create_testimonial(
    data: TestimonialCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    testimonial = Testimonial(
        name=data.name,
        role=data.role,
        company=data.company,
        message=data.message,
        profile_image=data.profile_image,
        rating=data.rating,
        is_published=data.is_published,
        display_order=data.display_order,
    )

    db.add(testimonial)
    db.commit()
    db.refresh(testimonial)

    return testimonial


@router.put(
    "/{testimonial_id}",
    response_model=TestimonialResponse,
)
def update_testimonial(
    testimonial_id: int,
    data: TestimonialUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    testimonial = (
        db.query(Testimonial)
        .filter(Testimonial.id == testimonial_id)
        .first()
    )

    if testimonial is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Testimonial not found",
        )

    testimonial.name = data.name
    testimonial.role = data.role
    testimonial.company = data.company
    testimonial.message = data.message
    testimonial.profile_image = data.profile_image
    testimonial.rating = data.rating
    testimonial.is_published = data.is_published
    testimonial.display_order = data.display_order

    db.commit()
    db.refresh(testimonial)

    return testimonial


@router.delete(
    "/{testimonial_id}",
    status_code=status.HTTP_204_NO_CONTENT,
)
def delete_testimonial(
    testimonial_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    testimonial = (
        db.query(Testimonial)
        .filter(Testimonial.id == testimonial_id)
        .first()
    )

    if testimonial is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Testimonial not found",
        )

    db.delete(testimonial)
    db.commit()

    return None