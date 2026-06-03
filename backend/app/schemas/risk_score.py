from datetime import datetime

from pydantic import BaseModel, ConfigDict, Field


class RiskScoreRead(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    country_id: int
    dependency_score: float = Field(..., ge=0, le=100)
    sentiment_score: float = Field(..., ge=0, le=100)
    geopolitical_score: float = Field(..., ge=0, le=100)
    overall_risk_score: float = Field(..., ge=0, le=100)
    created_at: datetime


class RiskScoreWithCountryRead(RiskScoreRead):
    country_name: str
    import_share: float

