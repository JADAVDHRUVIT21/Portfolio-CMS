from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.core.dependencies import get_current_user
from app.models.message import Message
from app.models.user import User
from app.schemas.contact import ContactResponse


router = APIRouter(
    prefix="/messages",
    tags=["Messages"],
)


@router.get(
    "",
    response_model=list[ContactResponse],
)
def get_messages(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    messages = (
        db.query(Message)
        .order_by(Message.created_at.desc(), Message.id.desc())
        .all()
    )

    return messages


@router.get(
    "/{message_id}",
    response_model=ContactResponse,
)
def get_message(
    message_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    message = (
        db.query(Message)
        .filter(Message.id == message_id)
        .first()
    )

    if message is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Message not found",
        )

    return message


@router.patch(
    "/{message_id}/read",
    response_model=ContactResponse,
)
def mark_message_as_read(
    message_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    message = (
        db.query(Message)
        .filter(Message.id == message_id)
        .first()
    )

    if message is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Message not found",
        )

    message.is_read = True

    db.commit()
    db.refresh(message)

    return message


@router.delete(
    "/{message_id}",
    status_code=status.HTTP_204_NO_CONTENT,
)
def delete_message(
    message_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    message = (
        db.query(Message)
        .filter(Message.id == message_id)
        .first()
    )

    if message is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Message not found",
        )

    db.delete(message)
    db.commit()

    return None