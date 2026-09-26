from sqlalchemy import String, Text, DateTime, Integer, Boolean
from sqlalchemy.orm import Mapped, mapped_column
from datetime import datetime, timezone

from app.core.database import Base


class Project(Base):
    __tablename__ = "projects"

    id: Mapped[int] = mapped_column(
        primary_key=True,
        index=True
    )

    title: Mapped[str] = mapped_column(
        String(200),
        nullable=False
    )

    description: Mapped[str] = mapped_column(
        Text,
        nullable=False
    )

    image: Mapped[str | None] = mapped_column(
        String(500),
        nullable=True
    )

    technologies: Mapped[str | None] = mapped_column(
        Text,
        nullable=True
    )

    live_url: Mapped[str | None] = mapped_column(
        String(500),
        nullable=True
    )

    github_url: Mapped[str | None] = mapped_column(
        String(500),
        nullable=True
    )

    display_order: Mapped[int] = mapped_column(
        Integer,
        default=0,
        nullable=False
    )

    is_published: Mapped[bool] = mapped_column(
        Boolean,
        default=True,
        nullable=False
    )

    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        default=lambda: datetime.now(timezone.utc),
        nullable=False
    )

    updated_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        default=lambda: datetime.now(timezone.utc),
        onupdate=lambda: datetime.now(timezone.utc),
        nullable=False
    )