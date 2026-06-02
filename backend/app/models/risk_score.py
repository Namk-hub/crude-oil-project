from datetime import datetime

from typing import TYPE_CHECKING

from sqlalchemy import DateTime, Float, ForeignKey, Integer, func
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.database import Base

if TYPE_CHECKING:
    from app.models.country import Country


class RiskScore(Base):
    __tablename__ = "risk_scores"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    country_id: Mapped[int] = mapped_column(
        Integer,
        ForeignKey("countries.id", ondelete="CASCADE"),
        nullable=False,
        index=True,
    )
    dependency_score: Mapped[float] = mapped_column(Float, nullable=False)
    sentiment_score: Mapped[float] = mapped_column(Float, nullable=False)
    geopolitical_score: Mapped[float] = mapped_column(Float, nullable=False)
    overall_risk_score: Mapped[float] = mapped_column(Float, nullable=False)
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        nullable=False,
        server_default=func.now(),
        index=True,
    )

    country: Mapped["Country"] = relationship("Country", back_populates="risk_scores")
