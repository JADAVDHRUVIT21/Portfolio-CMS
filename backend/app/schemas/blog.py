from datetime import datetime

from pydantic import BaseModel, Field


class BlogBase(BaseModel):
    title: str = Field(
        min_length=1,
        max_length=250
    )
    slug: str = Field(
        min_length=1,
        max_length=250
    )
    excerpt: str | None = None
    content: str
    featured_image: str | None = Field(
        default=None,
        max_length=500
    )
    is_published: bool = False


class BlogCreate(BlogBase):
    pass


class BlogUpdate(BlogBase):
    pass


class BlogResponse(BlogBase):
    id: int
    published_at: datetime | None
    created_at: datetime
    updated_at: datetime

    model_config = {
        "from_attributes": True
    }