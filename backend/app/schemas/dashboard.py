from datetime import date, datetime

from pydantic import BaseModel, Field

from app.schemas.country import CountryRead
from app.schemas.news_article import NewsArticleRead
from app.schemas.oil_price import OilPriceRead
from app.schemas.risk_score import RiskScoreWithCountryRead


class DashboardSummary(BaseModel):
    total_countries: int
    average_overall_risk: float = Field(..., ge=0, le=100)
    latest_oil_price: float | None = None
    latest_oil_price_date: date | None = None
    recent_news_count: int
    high_risk_countries: int


class DashboardResponse(BaseModel):
    summary: DashboardSummary
    countries: list[CountryRead]
    latest_risk_scores: list[RiskScoreWithCountryRead]
    recent_oil_prices: list[OilPriceRead]
    recent_news: list[NewsArticleRead]
    generated_at: datetime
