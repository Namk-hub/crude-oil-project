"""NewsAPI client for fetching oil and energy security articles."""

import logging
from dataclasses import dataclass
from datetime import datetime

import httpx

from app.config import DEFAULT_NEWS_KEYWORDS, get_settings

logger = logging.getLogger(__name__)


class NewsAPIError(Exception):
    """Raised when NewsAPI returns an error response."""


@dataclass(frozen=True)
class NewsAPIArticle:
    title: str
    description: str | None
    source: str
    url: str
    published_at: datetime
    keyword: str


def _parse_published_at(value: str) -> datetime:
    return datetime.fromisoformat(value.replace("Z", "+00:00"))


class NewsAPIClient:
    def __init__(
        self,
        api_key: str | None = None,
        base_url: str | None = None,
        timeout: float = 30.0,
    ) -> None:
        settings = get_settings()
        self.api_key = api_key if api_key is not None else settings.newsapi_key
        self.base_url = base_url or settings.newsapi_base_url
        self.timeout = timeout

    def is_configured(self) -> bool:
        return bool(self.api_key.strip())

    def fetch_articles_for_keyword(
        self,
        keyword: str,
        page_size: int | None = None,
    ) -> list[NewsAPIArticle]:
        if not self.is_configured():
            raise NewsAPIError("NEWSAPI_KEY is not configured.")

        settings = get_settings()
        size = page_size or settings.news_fetch_page_size

        params = {
            "q": keyword,
            "language": "en",
            "sortBy": "publishedAt",
            "pageSize": size,
            "apiKey": self.api_key,
        }

        url = f"{self.base_url.rstrip('/')}/everything"

        with httpx.Client(timeout=self.timeout) as client:
            response = client.get(url, params=params)
            response.raise_for_status()
            payload = response.json()

        if payload.get("status") != "ok":
            message = payload.get("message", "Unknown NewsAPI error")
            raise NewsAPIError(message)

        articles: list[NewsAPIArticle] = []
        for item in payload.get("articles", []):
            title = (item.get("title") or "").strip()
            article_url = (item.get("url") or "").strip()
            published_raw = item.get("publishedAt")

            if not title or not article_url or not published_raw:
                continue

            source_name = "Unknown"
            source = item.get("source")
            if isinstance(source, dict):
                source_name = (source.get("name") or "Unknown").strip()

            articles.append(
                NewsAPIArticle(
                    title=title[:500],
                    description=(item.get("description") or "").strip() or None,
                    source=source_name[:255],
                    url=article_url[:1000],
                    published_at=_parse_published_at(published_raw),
                    keyword=keyword,
                )
            )

        return articles

    def fetch_latest_articles(
        self,
        keywords: list[str] | None = None,
        page_size: int | None = None,
    ) -> list[NewsAPIArticle]:
        search_keywords = keywords or DEFAULT_NEWS_KEYWORDS
        seen_urls: set[str] = set()
        results: list[NewsAPIArticle] = []

        for keyword in search_keywords:
            try:
                batch = self.fetch_articles_for_keyword(keyword, page_size=page_size)
            except httpx.HTTPError as exc:
                logger.error("NewsAPI HTTP error for keyword '%s': %s", keyword, exc)
                continue
            except NewsAPIError as exc:
                logger.error("NewsAPI error for keyword '%s': %s", keyword, exc)
                raise

            for article in batch:
                if article.url in seen_urls:
                    continue
                seen_urls.add(article.url)
                results.append(article)

        results.sort(key=lambda article: article.published_at, reverse=True)
        return results
