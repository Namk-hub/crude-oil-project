from sqlalchemy.orm import Session

from app.models.simulation import Simulation
from app.schemas.simulation import SimulationCreate
from app.services.simulation_engine import run_simulation_engine


def run_simulation(db: Session, payload: SimulationCreate) -> Simulation:
    result = run_simulation_engine(payload.country, payload.reduction_percentage)

    simulation = Simulation(
        country=result.country,
        reduction_percentage=result.reduction_percentage,
        supply_gap=result.supply_gap,
        risk_level=result.risk_level.value,
        recommendation=result.recommendation,
    )
    db.add(simulation)
    db.commit()
    db.refresh(simulation)
    return simulation
