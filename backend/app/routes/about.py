from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.core.dependencies import get_current_user
from app.models.about import About
from app.models.user import User
from app.schemas.about import AboutCreate, AboutUpdate, AboutResponse


router = APIRouter(
    prefix="/about",
    tags=["About"]
)


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
    current_user: User = Depends(get_current_user)
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
        location=data.location,
        email=data.email,
        phone=data.phone,
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
    current_user: User = Depends(get_current_user)
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
    about.location = data.location
    about.email = data.email
    about.phone = data.phone

    db.commit()
    db.refresh(about)

    return about