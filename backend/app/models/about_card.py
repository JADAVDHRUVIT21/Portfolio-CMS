from datetime import datetime, timezone

from sqlalchemy import String, Text, DateTime, ForeignKey
from sqlalchemy.orm import Mapped, mapped_column

from app.core.database import Base


class AboutCard(Base):
    __tablename__ = "about_cards"

    id: Mapped[int] = mapped_column(
        primary_key=True,
        index=True
    )

    about_id: Mapped[int] = mapped_column(
        ForeignKey("about.id", ondelete="CASCADE"),
        nullable=False,
        index=True
    )

    title: Mapped[str] = mapped_column(
        String(150),
        nullable=False
    )

    description: Mapped[str] = mapped_column(
        Text,
        nullable=False
    )

    icon: Mapped[str | None] = mapped_column(
        String(100),
        nullable=True
    )

    display_order: Mapped[int] = mapped_column(
        default=1,
        nullable=False
    )

    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        default=lambda: datetime.now(timezone.utc),
        nullable=False
    )