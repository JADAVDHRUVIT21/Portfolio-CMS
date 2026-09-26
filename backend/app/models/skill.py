from sqlalchemy import String, Text, Integer
from sqlalchemy.orm import Mapped, mapped_column

from app.core.database import Base


class Skill(Base):
    __tablename__ = "skills"

    id: Mapped[int] = mapped_column(
        primary_key=True,
        index=True
    )

    name: Mapped[str] = mapped_column(
        String(100),
        nullable=False
    )

    category: Mapped[str | None] = mapped_column(
        String(100),
        nullable=True
    )

    description: Mapped[str | None] = mapped_column(
        Text,
        nullable=True
    )

    proficiency: Mapped[int | None] = mapped_column(
        Integer,
        nullable=True
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