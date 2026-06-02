from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.database import get_db
from app.models.country import Country
from app.schemas.country import CountryRead

router = APIRouter(tags=["countries"])


@router.get("/countries", response_model=list[CountryRead])
def list_countries(db: Session = Depends(get_db)) -> list[Country]:
    return db.query(Country).order_by(Country.name).all()
