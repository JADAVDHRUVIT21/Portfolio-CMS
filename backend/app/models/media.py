from sqlalchemy import String, DateTime, Integer
from sqlalchemy.orm import Mapped, mapped_column
from datetime import datetime, timezone

from app.core.database import Base


class Media(Base):
    __tablename__ = "media"

    id: Mapped[int] = mapped_column(
        primary_key=True,
        index=True
    )

    filename: Mapped[str] = mapped_column(
        String(255),
        nullable=False
    )

    original_filename: Mapped[str | None] = mapped_column(
        String(255),
        nullable=True
    )

    file_url: Mapped[str] = mapped_column(
        String(500),
        nullable=False
    )

    file_type: Mapped[str | None] = mapped_column(
        String(100),
        nullable=True
    )

    file_size: Mapped[int | None] = mapped_column(
        Integer,
        nullable=True
    )

    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        default=lambda: datetime.now(timezone.utc),
        nullable=False
    )