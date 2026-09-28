from fastapi import APIRouter, Depends, status
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.models.message import Message
from app.schemas.contact import ContactCreate, ContactResponse


router = APIRouter(
    prefix="/contact",
    tags=["Contact"],
)


@router.post(
    "",
    response_model=ContactResponse,
    status_code=status.HTTP_201_CREATED,
)
def create_contact_message(
    contact: ContactCreate,
    db: Session = Depends(get_db),
):
    message = Message(
        name=contact.name,
        email=contact.email,
        subject=contact.subject,
        message=contact.message,
    )

    db.add(message)
    db.commit()
    db.refresh(message)

    return message