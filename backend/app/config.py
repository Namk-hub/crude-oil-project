from functools import lru_cache

from pydantic_settings import BaseSettings, SettingsConfigDict

DEFAULT_NEWS_KEYWORDS = [
    "Russia oil",
    "Saudi oil",
    "OPEC",
    "Crude oil",
    "Energy security",
]


class Settings(BaseSettings):
    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        case_sensitive=False,
    )

    database_url: str = "postgresql://postgres:1234@localhost:5432/india_oil_risk"
    app_env: str = "development"
    app_host: str = "0.0.0.0"
    app_port: int = 8000
    app_title: str = "India Oil Risk Dashboard"
    app_version: str = "1.0.0"
    newsapi_key: str = "780e2f6bfeae4bef9edb1b624797b9c8"
    newsapi_base_url: str = "https://newsapi.org/v2"
    news_fetch_page_size: int = 20
    news_fetch_on_startup: bool = True


@lru_cache
def get_settings() -> Settings:
    return Settings()


