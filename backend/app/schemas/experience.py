from datetime import datetime
from pydantic import BaseModel, Field


class ExperienceBase(BaseModel):
    company: str = Field(min_length=1, max_length=200)
    position: str = Field(min_length=1, max_length=200)
    description: str | None = None
    start_date: str = Field(min_length=1, max_length=50)
    end_date: str | None = Field(default=None, max_length=50)
    is_current: bool = False
    display_order: int = Field(default=0, ge=0)


class ExperienceCreate(ExperienceBase):
    pass


class ExperienceUpdate(ExperienceBase):
    pass


class ExperienceResponse(ExperienceBase):
    id: int
    created_at: datetime

    model_config = {"from_attributes": True}