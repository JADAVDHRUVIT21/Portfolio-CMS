from datetime import datetime

from pydantic import BaseModel, EmailStr, Field


class AboutBase(BaseModel):
    title: str = Field(
        min_length=1,
        max_length=150
    )
    short_description: str
    long_description: str | None = None
    profile_image: str | None = None
    location: str | None = Field(
        default=None,
        max_length=150
    )
    email: EmailStr | None = None
    phone: str | None = Field(
        default=None,
        max_length=50
    )


class AboutCreate(AboutBase):
    pass


class AboutUpdate(AboutBase):
    pass


class AboutResponse(AboutBase):
    id: int
    updated_at: datetime

    model_config = {
        "from_attributes": True
    }