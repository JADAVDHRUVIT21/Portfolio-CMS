from datetime import datetime

from pydantic import BaseModel


class MediaResponse(BaseModel):
    id: int
    filename: str
    original_filename: str | None
    file_url: str
    file_type: str | None
    file_size: int | None
    created_at: datetime

    model_config = {"from_attributes": True}