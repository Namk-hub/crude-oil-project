from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session

from app.database import get_db
from app.models.oil_price import OilPrice
from app.schemas.oil_price import OilPriceRead

router = APIRouter(tags=["oil-prices"])


@router.get("/oil-prices", response_model=list[OilPriceRead])
def list_oil_prices(
    limit: int = Query(default=100, ge=1, le=500),
    db: Session = Depends(get_db),
) -> list[OilPrice]:
    return (
        db.query(OilPrice)
        .order_by(OilPrice.date.desc())
        .limit(limit)
        .all()
    )
