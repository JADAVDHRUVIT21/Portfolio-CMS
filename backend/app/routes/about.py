from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.core.dependencies import require_admin

from app.models.about import About
from app.models.about_card import AboutCard
from app.models.user import User

from app.schemas.about import (
    AboutCreate,
    AboutUpdate,
    AboutResponse,
    AboutCardCreate,
    AboutCardUpdate,
    AboutCardResponse,
)


router = APIRouter(
    prefix="/about",
    tags=["About"]
)


# =========================================================
# MAIN ABOUT CONTENT
# =========================================================

@router.get(
    "",
    response_model=AboutResponse
)
def get_about(
    db: Session = Depends(get_db)
):
    about = db.query(About).first()

    if about is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="About information not found"
        )

    return about


@router.post(
    "",
    response_model=AboutResponse,
    status_code=status.HTTP_201_CREATED
)
def create_about(
    data: AboutCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_admin)
):
    existing_about = db.query(About).first()

    if existing_about:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="About information already exists"
        )

    about = About(
        title=data.title,
        short_description=data.short_description,
        long_description=data.long_description,
        profile_image=data.profile_image,
    )

    db.add(about)
    db.commit()
    db.refresh(about)

    return about


@router.put(
    "",
    response_model=AboutResponse
)
def update_about(
    data: AboutUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_admin)
):
    about = db.query(About).first()

    if about is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="About information not found"
        )

    about.title = data.title
    about.short_description = data.short_description
    about.long_description = data.long_description
    about.profile_image = data.profile_image

    db.commit()
    db.refresh(about)

    return about


# =========================================================
# ABOUT CARDS
# =========================================================

@router.get(
    "/cards",
    response_model=list[AboutCardResponse]
)
def get_about_cards(
    db: Session = Depends(get_db)
):
    cards = (
        db.query(AboutCard)
        .order_by(AboutCard.display_order.asc())
        .all()
    )

    return cards


@router.post(
    "/cards",
    response_model=AboutCardResponse,
    status_code=status.HTTP_201_CREATED
)
def create_about_card(
    data: AboutCardCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_admin)
):
    about = db.query(About).first()

    if about is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Create About information before adding About cards"
        )

    card = AboutCard(
        about_id=about.id,
        title=data.title,
        description=data.description,
        icon=data.icon,
        display_order=data.display_order,
    )

    db.add(card)
    db.commit()
    db.refresh(card)

    return card


@router.put(
    "/cards/{card_id}",
    response_model=AboutCardResponse
)
def update_about_card(
    card_id: int,
    data: AboutCardUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_admin)
):
    card = (
        db.query(AboutCard)
        .filter(AboutCard.id == card_id)
        .first()
    )

    if card is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="About card not found"
        )

    card.title = data.title
    card.description = data.description
    card.icon = data.icon
    card.display_order = data.display_order

    db.commit()
    db.refresh(card)

    return card


@router.delete(
    "/cards/{card_id}",
    status_code=status.HTTP_204_NO_CONTENT
)
def delete_about_card(
    card_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_admin)
):
    card = (
        db.query(AboutCard)
        .filter(AboutCard.id == card_id)
        .first()
    )

    if card is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="About card not found"
        )

    db.delete(card)
    db.commit()

    return None