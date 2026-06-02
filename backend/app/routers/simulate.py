from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.database import get_db
from app.schemas.simulation import SimulationCreate, SimulationRead
from app.services.simulation import run_simulation
from app.services.simulation_engine import SimulationEngineError

router = APIRouter(tags=["simulate"])


@router.post("/simulate", response_model=SimulationRead, status_code=status.HTTP_201_CREATED)
def simulate_supply_reduction(
    payload: SimulationCreate,
    db: Session = Depends(get_db),
) -> SimulationRead:
    try:
        return run_simulation(db, payload)
    except SimulationEngineError as exc:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(exc)) from exc
