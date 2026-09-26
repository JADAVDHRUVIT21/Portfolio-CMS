from sqlalchemy import String, Text, Integer, Boolean, DateTime
from sqlalchemy.orm import Mapped, mapped_column
from datetime import datetime, timezone

from app.core.database import Base


class Service(Base):
    __tablename__ = "services"

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

    icon: Mapped[str | None] = mapped_column(
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