from datetime import datetime

from pydantic import BaseModel, EmailStr, Field


class ContactCreate(BaseModel):
    name: str = Field(..., min_length=2, max_length=150)
    email: EmailStr
    subject: str | None = Field(default=None, max_length=250)
    message: str = Field(..., min_length=1, max_length=5000)


class ContactResponse(BaseModel):
    id: int
    name: str
    email: str
    subject: str | None
    message: str
    is_read: bool
    created_at: datetime

    model_config = {"from_attributes": True}