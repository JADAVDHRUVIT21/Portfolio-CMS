from sqlalchemy import String, Text, DateTime
from sqlalchemy.orm import Mapped, mapped_column
from datetime import datetime, timezone

from app.core.database import Base


class About(Base):
    __tablename__ = "about"

    id: Mapped[int] = mapped_column(primary_key=True, index=True)

    title: Mapped[str] = mapped_column(
        String(150),
        nullable=False
    )

    short_description: Mapped[str] = mapped_column(
        Text,
        nullable=False
    )

    long_description: Mapped[str] = mapped_column(
        Text,
        nullable=True
    )

    profile_image: Mapped[str | None] = mapped_column(
        String(500),
        nullable=True
    )

    location: Mapped[str | None] = mapped_column(
        String(150),
        nullable=True
    )

    email: Mapped[str | None] = mapped_column(
        String(255),
        nullable=True
    )

    phone: Mapped[str | None] = mapped_column(
        String(50),
        nullable=True
    )

    updated_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        default=lambda: datetime.now(timezone.utc),
        onupdate=lambda: datetime.now(timezone.utc),
        nullable=False
    )
    