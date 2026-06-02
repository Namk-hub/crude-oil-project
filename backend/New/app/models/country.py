from typing import TYPE_CHECKING

from sqlalchemy import Float, Integer, String
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.database import Base

if TYPE_CHECKING:
    from app.models.risk_score import RiskScore


class Country(Base):
    __tablename__ = "countries"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    name: Mapped[str] = mapped_column(String(255), nullable=False, unique=True, index=True)
    import_share: Mapped[float] = mapped_column(Float, nullable=False)
    geopolitical_score: Mapped[float] = mapped_column(Float, nullable=False)

    risk_scores: Mapped[list["RiskScore"]] = relationship(
        "RiskScore",
        back_populates="country",
        cascade="all, delete-orphan",
    )
