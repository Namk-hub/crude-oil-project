"""initial schema

Revision ID: 001
Revises:
Create Date: 2026-05-30

"""
from typing import Sequence, Union

import sqlalchemy as sa
from alembic import op

revision: str = "001"
down_revision: Union[str, None] = None
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.create_table(
        "countries",
        sa.Column("id", sa.Integer(), autoincrement=True, nullable=False),
        sa.Column("name", sa.String(length=255), nullable=False),
        sa.Column("import_share", sa.Float(), nullable=False),
        sa.Column("geopolitical_score", sa.Float(), nullable=False),
        sa.PrimaryKeyConstraint("id"),
        sa.UniqueConstraint("name"),
    )
    op.create_index(op.f("ix_countries_name"), "countries", ["name"], unique=False)

    op.create_table(
        "oil_prices",
        sa.Column("id", sa.Integer(), autoincrement=True, nullable=False),
        sa.Column("price", sa.Float(), nullable=False),
        sa.Column("date", sa.Date(), nullable=False),
        sa.PrimaryKeyConstraint("id"),
        sa.UniqueConstraint("date"),
    )
    op.create_index(op.f("ix_oil_prices_date"), "oil_prices", ["date"], unique=False)

    op.create_table(
        "news_articles",
        sa.Column("id", sa.Integer(), autoincrement=True, nullable=False),
        sa.Column("title", sa.String(length=500), nullable=False),
        sa.Column("description", sa.Text(), nullable=True),
        sa.Column("source", sa.String(length=255), nullable=False),
        sa.Column("published_at", sa.DateTime(timezone=True), nullable=False),
        sa.Column("sentiment", sa.String(length=50), nullable=False),
        sa.Column("sentiment_score", sa.Float(), nullable=False),
        sa.PrimaryKeyConstraint("id"),
    )
    op.create_index(op.f("ix_news_articles_published_at"), "news_articles", ["published_at"], unique=False)
    op.create_index(op.f("ix_news_articles_source"), "news_articles", ["source"], unique=False)

    op.create_table(
        "simulations",
        sa.Column("id", sa.Integer(), autoincrement=True, nullable=False),
        sa.Column("country", sa.String(length=255), nullable=False),
        sa.Column("reduction_percentage", sa.Float(), nullable=False),
        sa.Column("supply_gap", sa.Float(), nullable=False),
        sa.Column("risk_level", sa.String(length=50), nullable=False),
        sa.Column("recommendation", sa.Text(), nullable=False),
        sa.PrimaryKeyConstraint("id"),
    )
    op.create_index(op.f("ix_simulations_country"), "simulations", ["country"], unique=False)

    op.create_table(
        "risk_scores",
        sa.Column("id", sa.Integer(), autoincrement=True, nullable=False),
        sa.Column("country_id", sa.Integer(), nullable=False),
        sa.Column("dependency_score", sa.Float(), nullable=False),
        sa.Column("sentiment_score", sa.Float(), nullable=False),
        sa.Column("geopolitical_score", sa.Float(), nullable=False),
        sa.Column("overall_risk_score", sa.Float(), nullable=False),
        sa.Column("created_at", sa.DateTime(timezone=True), server_default=sa.text("now()"), nullable=False),
        sa.ForeignKeyConstraint(["country_id"], ["countries.id"], ondelete="CASCADE"),
        sa.PrimaryKeyConstraint("id"),
    )
    op.create_index(op.f("ix_risk_scores_country_id"), "risk_scores", ["country_id"], unique=False)
    op.create_index(op.f("ix_risk_scores_created_at"), "risk_scores", ["created_at"], unique=False)


def downgrade() -> None:
    op.drop_index(op.f("ix_risk_scores_created_at"), table_name="risk_scores")
    op.drop_index(op.f("ix_risk_scores_country_id"), table_name="risk_scores")
    op.drop_table("risk_scores")
    op.drop_index(op.f("ix_simulations_country"), table_name="simulations")
    op.drop_table("simulations")
    op.drop_index(op.f("ix_news_articles_source"), table_name="news_articles")
    op.drop_index(op.f("ix_news_articles_published_at"), table_name="news_articles")
    op.drop_table("news_articles")
    op.drop_index(op.f("ix_oil_prices_date"), table_name="oil_prices")
    op.drop_table("oil_prices")
    op.drop_index(op.f("ix_countries_name"), table_name="countries")
    op.drop_table("countries")
