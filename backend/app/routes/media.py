from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.core.dependencies import require_admin
from app.models.media import Media
from app.models.user import User
from app.schemas.media import MediaResponse


router = APIRouter(
    prefix="/media",
    tags=["Media"],
)


@router.get(
    "",
    response_model=list[MediaResponse],
)
def get_media(
    db: Session = Depends(get_db),
    current_user: User = Depends(require_admin),
):
    media = (
        db.query(Media)
        .order_by(Media.created_at.desc(), Media.id.desc())
        .all()
    )

    return media


@router.get(
    "/{media_id}",
    response_model=MediaResponse,
)
def get_media_item(
    media_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_admin),
):
    media = (
        db.query(Media)
        .filter(Media.id == media_id)
        .first()
    )

    if media is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Media not found",
        )

    return media


@router.delete(
    "/{media_id}",
    status_code=status.HTTP_204_NO_CONTENT,
)
def delete_media(
    media_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_admin),
):
    media = (
        db.query(Media)
        .filter(Media.id == media_id)
        .first()
    )

    if media is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Media not found",
        )

    db.delete(media)
    db.commit()

    return None