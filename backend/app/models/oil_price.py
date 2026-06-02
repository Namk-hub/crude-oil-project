from datetime import date

from sqlalchemy import Date, Float, Integer
from sqlalchemy.orm import Mapped, mapped_column

from app.database import Base


class OilPrice(Base):
    __tablename__ = "oil_prices"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    price: Mapped[float] = mapped_column(Float, nullable=False)
    date: Mapped[date] = mapped_column(Date, nullable=False, unique=True, index=True)
