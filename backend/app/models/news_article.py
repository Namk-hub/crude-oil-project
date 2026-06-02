from datetime import datetime

from sqlalchemy import DateTime, Float, Integer, String, Text
from sqlalchemy.orm import Mapped, mapped_column

from app.database import Base


class NewsArticle(Base):
    __tablename__ = "news_articles"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    title: Mapped[str] = mapped_column(String(500), nullable=False)
    description: Mapped[str | None] = mapped_column(Text, nullable=True)
    source: Mapped[str] = mapped_column(String(255), nullable=False, index=True)
    url: Mapped[str | None] = mapped_column(String(1000), nullable=True, unique=True, index=True)
    keyword: Mapped[str | None] = mapped_column(String(100), nullable=True, index=True)
    published_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), nullable=False, index=True)
    sentiment: Mapped[str] = mapped_column(String(50), nullable=False)
    sentiment_score: Mapped[float] = mapped_column(Float, nullable=False)
