from sqlalchemy import String, Text, DateTime, Integer, Boolean
from sqlalchemy.orm import Mapped, mapped_column
from datetime import datetime, timezone

from app.core.database import Base


class Testimonial(Base):
    __tablename__ = "testimonials"

    id: Mapped[int] = mapped_column(
        primary_key=True,
        index=True
    )

    name: Mapped[str] = mapped_column(
        String(150),
        nullable=False
    )

    role: Mapped[str | None] = mapped_column(
        String(150),
        nullable=True
    )

    company: Mapped[str | None] = mapped_column(
        String(200),
        nullable=True
    )

    message: Mapped[str] = mapped_column(
        Text,
        nullable=False
    )

    profile_image: Mapped[str | None] = mapped_column(
        String(500),
        nullable=True
    )

    rating: Mapped[int | None] = mapped_column(
        Integer,
        nullable=True
    )

    is_published: Mapped[bool] = mapped_column(
        Boolean,
        default=True,
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
    