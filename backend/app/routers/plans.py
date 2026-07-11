from fastapi import APIRouter, Depends, HTTPException # type: ignore
from sqlalchemy.orm import Session # type: ignore

from app.database import get_db
from app import crud, schemas

router = APIRouter(
    prefix="/plans",
    tags=["Plans"]
)


@router.get("/", response_model=list[schemas.PlanResponse])
def get_all_plans(db: Session = Depends(get_db)):
    return crud.get_plans(db)


@router.post("/", response_model=schemas.PlanResponse)
def add_plan(
    plan: schemas.PlanCreate,
    db: Session = Depends(get_db)
):
    return crud.create_plan(db, plan)


@router.put("/{plan_id}", response_model=schemas.PlanResponse)
def update_plan(
    plan_id: int,
    plan: schemas.PlanCreate,
    db: Session = Depends(get_db)
):
    updated = crud.update_plan(db, plan_id, plan)
    if not updated:
        raise HTTPException(status_code=404, detail="Plan not found")
    return updated


@router.patch("/{plan_id}/archive", response_model=schemas.PlanResponse)
def archive_plan(
    plan_id: int,
    db: Session = Depends(get_db)
):
    archived = crud.archive_plan(db, plan_id)
    if not archived:
        raise HTTPException(status_code=404, detail="Plan not found")
    return archived