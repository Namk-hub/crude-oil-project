from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session, joinedload

from app.database import get_db
from app.models.risk_score import RiskScore
from app.schemas.risk_score import RiskScoreWithCountryRead

router = APIRouter(tags=["risk-scores"])


@router.get("/risk-scores", response_model=list[RiskScoreWithCountryRead])
def list_risk_scores(
    country_id: int | None = Query(default=None),
    limit: int = Query(default=100, ge=1, le=500),
    db: Session = Depends(get_db),
) -> list[RiskScoreWithCountryRead]:
    query = (
        db.query(RiskScore)
        .options(joinedload(RiskScore.country))
        .order_by(RiskScore.created_at.desc())
    )

    if country_id is not None:
        query = query.filter(RiskScore.country_id == country_id)

    scores = query.limit(limit).all()

    return [
        RiskScoreWithCountryRead(
            id=rs.id,
            country_id=rs.country_id,
            dependency_score=rs.dependency_score,
            sentiment_score=rs.sentiment_score,
            geopolitical_score=rs.geopolitical_score,
            overall_risk_score=rs.overall_risk_score,
            created_at=rs.created_at,
            country_name=rs.country.name,
            import_share=rs.country.import_share,
        )
        for rs in scores
    ]
