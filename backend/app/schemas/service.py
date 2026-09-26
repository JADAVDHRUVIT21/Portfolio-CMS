from pydantic import BaseModel, Field


class ServiceBase(BaseModel):
    title: str = Field(min_length=1, max_length=200)
    description: str
    icon: str | None = Field(default=None, max_length=500)
    display_order: int = Field(default=0, ge=0)
    is_published: bool = True


class ServiceCreate(ServiceBase):
    pass


class ServiceUpdate(ServiceBase):
    pass


class ServiceResponse(ServiceBase):
    id: int

    model_config = {"from_attributes": True}    