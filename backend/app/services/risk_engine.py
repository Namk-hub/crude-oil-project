"""Risk scoring engine for the India Oil Risk Dashboard."""

from enum import Enum

from pydantic import BaseModel, Field


class RiskCategory(str, Enum):
    LOW = "Low"
    MEDIUM = "Medium"
    HIGH = "High"


class RiskEngineInput(BaseModel):
    dependency_percentage: float = Field(
        ...,
        ge=0,
        le=100,
        description="Share of oil imports dependent on a single source (0-100).",
    )
    sentiment_score: float = Field(
        ...,
        ge=-1,
        le=1,
        description="Raw sentiment score from news analysis (-1 to 1).",
    )
    geopolitical_score: float = Field(
        ...,
        ge=0,
        le=100,
        description="Geopolitical instability score (0-100, higher is riskier).",
    )


class RiskEngineOutput(BaseModel):
    risk_score: float = Field(..., ge=0, le=100)
    risk_category: RiskCategory


DEPENDENCY_WEIGHT = 0.4
SENTIMENT_WEIGHT = 0.3
GEOPOLITICAL_WEIGHT = 0.3

LOW_THRESHOLD = 40
MEDIUM_THRESHOLD = 70


def normalize_sentiment(sentiment_score: float) -> float:
    """Map raw sentiment (-1 to 1) onto a 0-100 risk scale."""
    return (sentiment_score + 1) * 50


def categorize_risk(risk_score: float) -> RiskCategory:
    """
    Classify risk score into categories:
    - 0-40: Low
    - 41-70: Medium
    - 71-100: High
    """
    if risk_score <= LOW_THRESHOLD:
        return RiskCategory.LOW
    if risk_score <= MEDIUM_THRESHOLD:
        return RiskCategory.MEDIUM
    return RiskCategory.HIGH


def calculate_overall_risk(
    dependency_percentage: float,
    normalized_sentiment: float,
    geopolitical_score: float,
) -> float:
    """Compute weighted overall risk score."""
    score = (
        (DEPENDENCY_WEIGHT * dependency_percentage)
        + (SENTIMENT_WEIGHT * normalized_sentiment)
        + (GEOPOLITICAL_WEIGHT * geopolitical_score)
    )
    return round(min(100.0, max(0.0, score)), 2)


def calculate_risk(
    dependency_percentage: float,
    sentiment_score: float,
    geopolitical_score: float,
) -> RiskEngineOutput:
    """
    Calculate overall oil supply risk from dependency, sentiment, and geopolitical inputs.

    Formula:
        normalized_sentiment = (sentiment_score + 1) * 50
        overall_risk = 0.4 * dependency_percentage
                     + 0.3 * normalized_sentiment
                     + 0.3 * geopolitical_score
    """
    validated = RiskEngineInput(
        dependency_percentage=dependency_percentage,
        sentiment_score=sentiment_score,
        geopolitical_score=geopolitical_score,
    )

    normalized = normalize_sentiment(validated.sentiment_score)
    risk_score = calculate_overall_risk(
        validated.dependency_percentage,
        normalized,
        validated.geopolitical_score,
    )

    return RiskEngineOutput(
        risk_score=risk_score,
        risk_category=categorize_risk(risk_score),
    )


def calculate_risk_from_input(payload: RiskEngineInput) -> RiskEngineOutput:
    """Calculate risk from a pre-validated input model."""
    normalized = normalize_sentiment(payload.sentiment_score)
    risk_score = calculate_overall_risk(
        payload.dependency_percentage,
        normalized,
        payload.geopolitical_score,
    )

    return RiskEngineOutput(
        risk_score=risk_score,
        risk_category=categorize_risk(risk_score),
    )
