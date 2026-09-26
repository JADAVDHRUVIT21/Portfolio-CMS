from pydantic import BaseModel, Field


class TestimonialBase(BaseModel):
    name: str = Field(min_length=1, max_length=150)
    role: str | None = Field(default=None, max_length=150)
    company: str | None = Field(default=None, max_length=200)
    message: str
    profile_image: str | None = Field(default=None, max_length=500)
    rating: int | None = Field(default=None, ge=1, le=5)
    is_published: bool = True
    display_order: int = Field(default=0, ge=0)


class TestimonialCreate(TestimonialBase):
    pass


class TestimonialUpdate(TestimonialBase):
    pass


class TestimonialResponse(TestimonialBase):
    id: int

    model_config = {"from_attributes": True}