from datetime import date

from pydantic import BaseModel, ConfigDict, Field


class OilPriceRead(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    price: float = Field(..., gt=0)
    date: date
