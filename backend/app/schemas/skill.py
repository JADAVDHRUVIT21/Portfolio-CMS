from pydantic import BaseModel, Field


class SkillBase(BaseModel):
    name: str = Field(
        min_length=1,
        max_length=100
    )
    category: str | None = Field(
        default=None,
        max_length=100
    )
    description: str | None = None
    proficiency: int | None = Field(
        default=None,
        ge=0,
        le=100
    )
    icon: str | None = Field(
        default=None,
        max_length=500
    )
    display_order: int = Field(
        default=0,
        ge=0
    )


class SkillCreate(SkillBase):
    pass


class SkillUpdate(SkillBase):
    pass


class SkillResponse(SkillBase):
    id: int

    model_config = {
        "from_attributes": True
    }