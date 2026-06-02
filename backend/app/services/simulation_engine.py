"""Supply reduction simulation engine for the India Oil Risk Dashboard."""

from enum import Enum

from pydantic import BaseModel, Field, field_validator


class SimulationRiskLevel(str, Enum):
    LOW = "Low"
    MEDIUM = "Medium"
    HIGH = "High"


IMPORT_SHARES: dict[str, float] = {
    "Russia": 35.0,
    "Iraq": 22.0,
    "Saudi Arabia": 18.0,
    "UAE": 12.0,
    "Others": 13.0,
}

RISK_INCREASE_MULTIPLIER = 2.0

LOW_THRESHOLD = 5.0
MEDIUM_THRESHOLD = 15.0

RECOMMENDATIONS: dict[SimulationRiskLevel, str] = {
    SimulationRiskLevel.HIGH: "Increase imports from Saudi Arabia and UAE.",
    SimulationRiskLevel.MEDIUM: "Use strategic petroleum reserves.",
    SimulationRiskLevel.LOW: "Monitor situation.",
}


class SimulationEngineError(ValueError):
    """Raised when simulation input cannot be processed."""


class SimulationEngineInput(BaseModel):
    country: str = Field(..., min_length=1, max_length=255)
    reduction_percentage: float = Field(..., ge=0, le=100)

    @field_validator("country")
    @classmethod
    def normalize_country(cls, value: str) -> str:
        return value.strip()


class SimulationEngineOutput(BaseModel):
    country: str
    reduction_percentage: float
    import_share: float
    supply_gap: float
    risk_increase: float
    risk_level: SimulationRiskLevel
    recommendation: str

    def to_json(self) -> dict:
        return self.model_dump(mode="json")


def get_import_share(country: str) -> float:
    """Resolve import share for a country using case-insensitive lookup."""
    normalized = country.strip().casefold()
    for name, share in IMPORT_SHARES.items():
        if name.casefold() == normalized:
            return share
    known = ", ".join(IMPORT_SHARES.keys())
    raise SimulationEngineError(
        f"Unknown country '{country}'. Supported countries: {known}."
    )


def calculate_supply_gap(import_share: float, reduction_percentage: float) -> float:
    """
    Compute supply gap from import share and reduction percentage.

    Example: Russia 35% import share, 30% reduction
        supply_gap = 35 × 0.30 = 10.5
    """
    return round(import_share * (reduction_percentage / 100), 2)


def calculate_risk_increase(supply_gap: float) -> float:
    """Risk increase equals supply gap multiplied by 2."""
    return round(supply_gap * RISK_INCREASE_MULTIPLIER, 2)


def classify_risk_level(risk_increase: float) -> SimulationRiskLevel:
    """
    Classify risk based on risk increase:
    - 0-5: Low
    - 5-15: Medium
    - 15+: High
    """
    if risk_increase <= LOW_THRESHOLD:
        return SimulationRiskLevel.LOW
    if risk_increase <= MEDIUM_THRESHOLD:
        return SimulationRiskLevel.MEDIUM
    return SimulationRiskLevel.HIGH


def get_recommendation(risk_level: SimulationRiskLevel) -> str:
    return RECOMMENDATIONS[risk_level]


def run_simulation_engine(
    country: str,
    reduction_percentage: float,
) -> SimulationEngineOutput:
    """Run a supply reduction simulation and return a JSON-serializable result."""
    payload = SimulationEngineInput(
        country=country,
        reduction_percentage=reduction_percentage,
    )

    import_share = get_import_share(payload.country)
    supply_gap = calculate_supply_gap(import_share, payload.reduction_percentage)
    risk_increase = calculate_risk_increase(supply_gap)
    risk_level = classify_risk_level(risk_increase)

    canonical_country = next(
        name for name in IMPORT_SHARES if name.casefold() == payload.country.casefold()
    )

    return SimulationEngineOutput(
        country=canonical_country,
        reduction_percentage=payload.reduction_percentage,
        import_share=import_share,
        supply_gap=supply_gap,
        risk_increase=risk_increase,
        risk_level=risk_level,
        recommendation=get_recommendation(risk_level),
    )


def run_simulation_from_input(payload: SimulationEngineInput) -> SimulationEngineOutput:
    """Run simulation from a pre-validated input model."""
    return run_simulation_engine(payload.country, payload.reduction_percentage)
