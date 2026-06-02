from datetime import datetime

from pydantic import BaseModel, ConfigDict, Field


class NewsArticleRead(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    title: str
    description: str | None = None
    source: str
    url: str | None = None
    keyword: str | None = None
    published_at: datetime
    sentiment: str
    sentiment_score: float = Field(..., ge=-1, le=1)


class NewsListResponse(BaseModel):
    count: int
    articles: list[NewsArticleRead]


class NewsFetchResponse(BaseModel):
    fetched: int
    stored: int
    skipped: int
