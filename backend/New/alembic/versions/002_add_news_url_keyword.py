"""Add url and keyword columns to news_articles.

Revision ID: 002
Revises: 001
Create Date: 2026-05-30

"""
from typing import Sequence, Union

import sqlalchemy as sa
from alembic import op

revision: str = "002"
down_revision: Union[str, None] = "001"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.add_column("news_articles", sa.Column("url", sa.String(length=1000), nullable=True))
    op.add_column("news_articles", sa.Column("keyword", sa.String(length=100), nullable=True))
    op.create_index(op.f("ix_news_articles_url"), "news_articles", ["url"], unique=True)
    op.create_index(op.f("ix_news_articles_keyword"), "news_articles", ["keyword"], unique=False)


def downgrade() -> None:
    op.drop_index(op.f("ix_news_articles_keyword"), table_name="news_articles")
    op.drop_index(op.f("ix_news_articles_url"), table_name="news_articles")
    op.drop_column("news_articles", "keyword")
    op.drop_column("news_articles", "url")
