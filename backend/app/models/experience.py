from sqlalchemy import String, Text, DateTime, Integer, Boolean
from sqlalchemy.orm import Mapped, mapped_column
from datetime import datetime, timezone

from app.core.database import Base


class Experience(Base):
    __tablename__ = "experience"

    id: Mapped[int] = mapped_column(
        primary_key=True,
        index=True
    )

    company: Mapped[str] = mapped_column(
        String(200),
        nullable=False
    )

    position: Mapped[str] = mapped_column(
        String(200),
        nullable=False
    )

    description: Mapped[str | None] = mapped_column(
        Text,
        nullable=True
    )

    start_date: Mapped[str] = mapped_column(
        String(50),
        nullable=False
    )

    end_date: Mapped[str | None] = mapped_column(
        String(50),
        nullable=True
    )

    is_current: Mapped[bool] = mapped_column(
        Boolean,
        default=False,
        nullable=False
    )

    display_order: Mapped[int] = mapped_column(
        Integer,
        default=0,
        nullable=False
    )

    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        default=lambda: datetime.now(timezone.utc),
        nullable=False
    )