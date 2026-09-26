from sqlalchemy import String, Text, DateTime, Boolean
from sqlalchemy.orm import Mapped, mapped_column
from datetime import datetime, timezone

from app.core.database import Base


class Blog(Base):
    __tablename__ = "blogs"

    id: Mapped[int] = mapped_column(
        primary_key=True,
        index=True
    )

    title: Mapped[str] = mapped_column(
        String(250),
        nullable=False
    )

    slug: Mapped[str] = mapped_column(
        String(250),
        unique=True,
        index=True,
        nullable=False
    )

    excerpt: Mapped[str | None] = mapped_column(
        Text,
        nullable=True
    )

    content: Mapped[str] = mapped_column(
        Text,
        nullable=False
    )

    featured_image: Mapped[str | None] = mapped_column(
        String(500),
        nullable=True
    )

    is_published: Mapped[bool] = mapped_column(
        Boolean,
        default=False,
        nullable=False
    )

    published_at: Mapped[datetime | None] = mapped_column(
        DateTime(timezone=True),
        nullable=True
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