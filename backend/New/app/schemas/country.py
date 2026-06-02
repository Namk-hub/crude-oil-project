from pydantic import BaseModel, ConfigDict, Field


class CountryRead(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    name: str
    import_share: float = Field(..., ge=0, le=100)
    geopolitical_score: float = Field(..., ge=0, le=100)
