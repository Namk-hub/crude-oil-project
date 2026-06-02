from pydantic import BaseModel, ConfigDict, Field


class SimulationCreate(BaseModel):
    country: str = Field(..., min_length=1, max_length=255)
    reduction_percentage: float = Field(..., ge=0, le=100)


class SimulationRead(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    country: str
    reduction_percentage: float
    supply_gap: float
    risk_level: str
    recommendation: str
