from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.orm import Session

from app.database import get_db
from app.services.news_ingestion import fetch_and_store_news, list_stored_articles
from app.services.newsapi_client import NewsAPIError
from app.schemas.news_article import NewsFetchResponse, NewsListResponse

router = APIRouter(tags=["news"])


@router.get("/news", response_model=NewsListResponse)
def list_news(
    limit: int = Query(default=50, ge=1, le=200),
    source: str | None = Query(default=None),
    keyword: str | None = Query(default=None),
    sentiment: str | None = Query(default=None, description="positive, negative, or neutral"),
    db: Session = Depends(get_db),
) -> NewsListResponse:
    articles = list_stored_articles(
        db,
        limit=limit,
        source=source,
        keyword=keyword,
        sentiment=sentiment,
    )
    return NewsListResponse(count=len(articles), articles=articles)


@router.post("/news/fetch", response_model=NewsFetchResponse, status_code=status.HTTP_200_OK)
def sync_news_from_api(db: Session = Depends(get_db)) -> NewsFetchResponse:
    """Fetch latest articles from NewsAPI, analyze sentiment, and store in PostgreSQL."""
    try:
        result = fetch_and_store_news(db)
    except NewsAPIError as exc:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(exc)) from exc

    return NewsFetchResponse(
        fetched=result.fetched,
        stored=result.stored,
        skipped=result.skipped,
    )
