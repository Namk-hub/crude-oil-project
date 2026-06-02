"""Fetch NewsAPI articles, analyze sentiment, and persist to PostgreSQL."""

import logging
from dataclasses import dataclass

from sqlalchemy.orm import Session

from app.config import DEFAULT_NEWS_KEYWORDS
from app.database import SessionLocal
from app.models.news_article import NewsArticle
from app.services.newsapi_client import NewsAPIArticle, NewsAPIClient, NewsAPIError
from app.services.sentiment_analyzer import analyze_article

logger = logging.getLogger(__name__)


@dataclass(frozen=True)
class NewsIngestionResult:
    fetched: int
    stored: int
    skipped: int


def store_articles(db: Session, articles: list[NewsAPIArticle]) -> NewsIngestionResult:
    stored = 0
    skipped = 0

    for article in articles:
        existing = (
            db.query(NewsArticle)
            .filter(NewsArticle.url == article.url)
            .first()
        )
        if existing:
            skipped += 1
            continue

        sentiment = analyze_article(article.title, article.description)

        db.add(
            NewsArticle(
                title=article.title,
                description=article.description,
                source=article.source,
                url=article.url,
                keyword=article.keyword,
                published_at=article.published_at,
                sentiment=sentiment.sentiment,
                sentiment_score=sentiment.sentiment_score,
            )
        )
        stored += 1

    if stored:
        db.commit()

    return NewsIngestionResult(
        fetched=len(articles),
        stored=stored,
        skipped=skipped,
    )


def fetch_and_store_news(
    db: Session,
    keywords: list[str] | None = None,
    page_size: int | None = None,
) -> NewsIngestionResult:
    client = NewsAPIClient()

    if not client.is_configured():
        raise NewsAPIError("NEWSAPI_KEY is not configured.")

    articles = client.fetch_latest_articles(keywords=keywords, page_size=page_size)
    return store_articles(db, articles)


def fetch_and_store_news_background(
    keywords: list[str] | None = None,
) -> NewsIngestionResult | None:
    """Background-safe ingestion using its own DB session."""
    client = NewsAPIClient()
    if not client.is_configured():
        logger.warning("Skipping news fetch: NEWSAPI_KEY is not configured.")
        return None

    db = SessionLocal()
    try:
        result = fetch_and_store_news(db, keywords=keywords or DEFAULT_NEWS_KEYWORDS)
        logger.info(
            "News ingestion complete: fetched=%s stored=%s skipped=%s",
            result.fetched,
            result.stored,
            result.skipped,
        )
        return result
    except NewsAPIError as exc:
        logger.error("News ingestion failed: %s", exc)
        return None
    finally:
        db.close()


def list_stored_articles(
    db: Session,
    *,
    limit: int = 50,
    source: str | None = None,
    keyword: str | None = None,
    sentiment: str | None = None,
) -> list[NewsArticle]:
    query = db.query(NewsArticle).order_by(NewsArticle.published_at.desc())

    if source:
        query = query.filter(NewsArticle.source.ilike(f"%{source}%"))
    if keyword:
        query = query.filter(NewsArticle.keyword.ilike(f"%{keyword}%"))
    if sentiment:
        query = query.filter(NewsArticle.sentiment.ilike(sentiment))

    return query.limit(limit).all()
