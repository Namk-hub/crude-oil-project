"""Seed database with sample India oil risk dashboard data."""

from datetime import date, datetime, timedelta, timezone

from sqlalchemy.orm import Session

from app.database import SessionLocal
from app.models.country import Country
from app.models.news_article import NewsArticle
from app.models.oil_price import OilPrice
from app.models.risk_score import RiskScore


def _ensure_russia_is_top_supplier(db: Session) -> None:
    """Align stored shares and risk scores with the latest seed values."""
    TARGET_SHARES = {
        "Russia": 40.0,
        "Iraq": 27.0,
        "Saudi Arabia": 23.0,
        "UAE": 18.0,
        "USA": 14.0,
        "Nigeria": 12.0,
        "Kuwait": 10.0,
        "Iran": 9.0,
        "Venezuela": 7.0,
        "Mexico": 5.0,
    }
    TARGET_GEO = {
        "Russia": 92.0,
    }

    # Update all country import_share and geopolitical_score values
    for country in db.query(Country).all():
        if country.name in TARGET_SHARES:
            country.import_share = TARGET_SHARES[country.name]
        if country.name in TARGET_GEO:
            country.geopolitical_score = TARGET_GEO[country.name]

    db.flush()

    # Recalculate risk scores for every country
    for country in db.query(Country).all():
        latest_risk = (
            db.query(RiskScore)
            .filter(RiskScore.country_id == country.id)
            .order_by(RiskScore.created_at.desc())
            .first()
        )
        if latest_risk:
            dependency = min(100.0, country.import_share * 3.5)
            sentiment = 40.0 + (country.geopolitical_score * 0.3)
            overall = round(
                (dependency * 0.4) + (sentiment * 0.25) + (country.geopolitical_score * 0.35),
                2,
            )
            latest_risk.dependency_score = round(dependency, 2)
            latest_risk.sentiment_score = round(sentiment, 2)
            latest_risk.geopolitical_score = country.geopolitical_score
            latest_risk.overall_risk_score = overall

    db.commit()


def seed(db: Session) -> None:
    if db.query(Country).count() > 0:
        _ensure_russia_is_top_supplier(db)
        return

    countries_data = [
        {"name": "Russia", "import_share": 40.0, "geopolitical_score": 92.0},
        {"name": "Iraq", "import_share": 27.0, "geopolitical_score": 74.0},
        {"name": "Saudi Arabia", "import_share": 23.0, "geopolitical_score": 45.0},
        {"name": "UAE", "import_share": 18.0, "geopolitical_score": 36.0},
        {"name": "USA", "import_share": 14.0, "geopolitical_score": 25.0},
        {"name": "Nigeria", "import_share": 12.0, "geopolitical_score": 55.0},
        {"name": "Kuwait", "import_share": 10.0, "geopolitical_score": 42.0},
        {"name": "Iran", "import_share": 9.0, "geopolitical_score": 85.0},
        {"name": "Venezuela", "import_share": 7.0, "geopolitical_score": 68.0},
        {"name": "Mexico", "import_share": 5.0, "geopolitical_score": 30.0},
    ]

    countries = [Country(**data) for data in countries_data]
    db.add_all(countries)
    db.flush()

    now = datetime.now(timezone.utc)
    for country in countries:
        dependency = min(100.0, country.import_share * 3.5)
        sentiment = 40.0 + (country.geopolitical_score * 0.3)
        overall = round(
            (dependency * 0.4) + (sentiment * 0.25) + (country.geopolitical_score * 0.35),
            2,
        )
        db.add(
            RiskScore(
                country_id=country.id,
                dependency_score=round(dependency, 2),
                sentiment_score=round(sentiment, 2),
                geopolitical_score=country.geopolitical_score,
                overall_risk_score=overall,
                created_at=now,
            )
        )

    base_date = date.today()
    base_price = 82.0
    for i in range(30):
        db.add(
            OilPrice(
                price=round(base_price + (i * 0.15) - (i % 5) * 0.4, 2),
                date=base_date - timedelta(days=29 - i),
            )
        )

    news_items = [
        {
            "title": "OPEC+ extends production cuts through Q3",
            "description": "Major oil producers agree to maintain supply restrictions affecting global crude prices.",
            "source": "Reuters",
            "sentiment": "negative",
            "sentiment_score": -0.45,
        },
        {
            "title": "India diversifies crude sourcing amid Red Sea disruptions",
            "description": "Indian refiners increase purchases from West Africa and Americas to offset Middle East risks.",
            "source": "Economic Times",
            "sentiment": "neutral",
            "sentiment_score": 0.05,
        },
        {
            "title": "Brent crude rises on Middle East tensions",
            "description": "Geopolitical uncertainty pushes benchmark oil prices higher in Asian trading.",
            "source": "Bloomberg",
            "sentiment": "negative",
            "sentiment_score": -0.62,
        },
        {
            "title": "Strategic petroleum reserve levels reviewed by government",
            "description": "India assesses emergency stockpile adequacy given rising import dependency.",
            "source": "Mint",
            "sentiment": "neutral",
            "sentiment_score": -0.1,
        },
        {
            "title": "Russian crude flows to India remain steady despite sanctions pressure",
            "description": "Discounted Urals grade continues to account for significant share of Indian imports.",
            "source": "Financial Express",
            "sentiment": "neutral",
            "sentiment_score": 0.15,
        },
    ]

    for i, item in enumerate(news_items):
        db.add(
            NewsArticle(
                title=item["title"],
                description=item["description"],
                source=item["source"],
                published_at=now - timedelta(hours=i * 6),
                sentiment=item["sentiment"],
                sentiment_score=item["sentiment_score"],
            )
        )

    db.commit()


def main() -> None:
    db = SessionLocal()
    try:
        seed(db)
        print("Database seeded successfully.")
    finally:
        db.close()


if __name__ == "__main__":
    main()
