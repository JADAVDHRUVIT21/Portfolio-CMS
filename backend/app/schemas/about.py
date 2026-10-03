from datetime import datetime

from pydantic import BaseModel, Field


# =========================
# ABOUT MAIN CONTENT
# =========================

class AboutBase(BaseModel):
    title: str = Field(
        min_length=1,
        max_length=150
    )

    short_description: str = Field(
        min_length=1
    )

    long_description: str | None = None

    profile_image: str | None = Field(
        default=None,
        max_length=1000
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


# =========================
# ABOUT CARDS
# =========================

class AboutCardBase(BaseModel):
    title: str = Field(
        min_length=1,
        max_length=150
    )

    description: str = Field(
        min_length=1
    )

    icon: str | None = Field(
        default=None,
        max_length=1000
    )

    display_order: int = Field(
        default=1,
        ge=1
    )


class AboutCardCreate(AboutCardBase):
    pass


class AboutCardUpdate(AboutCardBase):
    pass


class AboutCardResponse(AboutCardBase):
    id: int
    about_id: int
    created_at: datetime

    model_config = {
        "from_attributes": True
    }