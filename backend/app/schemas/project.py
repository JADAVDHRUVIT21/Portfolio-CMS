from datetime import datetime

from pydantic import BaseModel, Field


class ProjectBase(BaseModel):
    title: str = Field(
        min_length=1,
        max_length=200
    )
    description: str
    image: str | None = Field(
        default=None,
        max_length=500
    )
    technologies: str | None = None
    live_url: str | None = Field(
        default=None,
        max_length=500
    )
    github_url: str | None = Field(
        default=None,
        max_length=500
    )
    display_order: int = Field(
        default=0,
        ge=0
    )
    is_published: bool = True


class ProjectCreate(ProjectBase):
    pass


class ProjectUpdate(ProjectBase):
    pass


class ProjectResponse(ProjectBase):
    id: int
    created_at: datetime
    updated_at: datetime

    model_config = {
        "from_attributes": True
    }
    