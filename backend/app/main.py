import asyncio
import logging
from contextlib import asynccontextmanager

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.config import get_settings
from app.routers import countries, dashboard, news, oil_prices, risk_scores, simulate

settings = get_settings()
logger = logging.getLogger(__name__)


@asynccontextmanager
async def lifespan(app: FastAPI):
    if settings.news_fetch_on_startup and settings.newsapi_key:
        logger.info("Starting background news fetch from NewsAPI...")
        asyncio.create_task(asyncio.to_thread(_startup_news_fetch))
    yield


def _startup_news_fetch() -> None:
    from app.services.news_ingestion import fetch_and_store_news_background

    fetch_and_store_news_background()


def create_app() -> FastAPI:
    app = FastAPI(
        title=settings.app_title,
        version=settings.app_version,
        lifespan=lifespan,
    )
    app.add_middleware(
        CORSMiddleware,
        allow_origins=["*"],
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )

    app.include_router(dashboard.router)
    app.include_router(oil_prices.router)
    app.include_router(countries.router)
    app.include_router(risk_scores.router)
    app.include_router(news.router)
    app.include_router(simulate.router)

    @app.get("/health", tags=["health"])
    def health_check() -> dict[str, str]:
        return {"status": "ok"}

    return app


app = create_app()
