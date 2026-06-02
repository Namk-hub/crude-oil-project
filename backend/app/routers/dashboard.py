from datetime import datetime, timezone

from fastapi import APIRouter, Depends
from sqlalchemy import func
from sqlalchemy.orm import Session, joinedload

from app.database import get_db
from app.models.country import Country
from app.models.news_article import NewsArticle
from app.models.oil_price import OilPrice
from app.models.risk_score import RiskScore
from app.schemas.dashboard import DashboardResponse, DashboardSummary
from app.schemas.risk_score import RiskScoreWithCountryRead

router = APIRouter(tags=["dashboard"])

@router.get("/insights")
def insights():
    return {
        "insights": [
            "Russia remains highest geopolitical risk",
            "Brent crude above $90 indicates supply stress",
            "India import dependency remains elevated"
        ]
    }
@router.get("/dashboard", response_model=DashboardResponse)
def get_dashboard(db: Session = Depends(get_db)) -> DashboardResponse:
    countries = db.query(Country).order_by(Country.import_share.desc()).all()

    latest_risk_subq = (
        db.query(
            RiskScore.country_id,
            func.max(RiskScore.created_at).label("max_created_at"),
        )
        .group_by(RiskScore.country_id)
        .subquery()
    )

    latest_risk_scores = (
        db.query(RiskScore)
        .join(
            latest_risk_subq,
            (RiskScore.country_id == latest_risk_subq.c.country_id)
            & (RiskScore.created_at == latest_risk_subq.c.max_created_at),
        )
        .options(joinedload(RiskScore.country))
        .order_by(RiskScore.overall_risk_score.desc())
        .all()
    )

    recent_oil_prices = (
        db.query(OilPrice)
        .order_by(OilPrice.date.desc())
        .limit(30)
        .all()
    )

    recent_news = (
        db.query(NewsArticle)
        .order_by(NewsArticle.published_at.desc())
        .limit(10)
        .all()
    )

    avg_risk = (
        db.query(func.avg(RiskScore.overall_risk_score)).scalar() or 0.0
    )
    high_risk_count = sum(1 for rs in latest_risk_scores if rs.overall_risk_score >= 50)

    latest_price = recent_oil_prices[0] if recent_oil_prices else None

    summary = DashboardSummary(
        total_countries=len(countries),
        average_overall_risk=round(float(avg_risk), 2),
        latest_oil_price=latest_price.price if latest_price else None,
        latest_oil_price_date=latest_price.date if latest_price else None,
        recent_news_count=len(recent_news),
        high_risk_countries=high_risk_count,
    )

    risk_scores_with_country = [
        RiskScoreWithCountryRead(
            id=rs.id,
            country_id=rs.country_id,
            dependency_score=rs.dependency_score,
            sentiment_score=rs.sentiment_score,
            geopolitical_score=rs.geopolitical_score,
            overall_risk_score=rs.overall_risk_score,
            created_at=rs.created_at,
            country_name=rs.country.name,
        )
        for rs in latest_risk_scores
    ]

    

    return DashboardResponse(
        summary=summary,
        countries=countries,
        latest_risk_scores=risk_scores_with_country,
        recent_oil_prices=recent_oil_prices,
        recent_news=recent_news,
        generated_at=datetime.now(timezone.utc),
    )
