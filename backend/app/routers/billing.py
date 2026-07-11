from fastapi import APIRouter, Depends # type: ignore
from sqlalchemy.orm import Session # type: ignore

from app.database import get_db
from app import crud, schemas

router = APIRouter(prefix="/billing", tags=["Billing"])

@router.get("/", response_model=list[schemas.BillingResponse])
def get_all_bills(db: Session = Depends(get_db)):
    return crud.get_bills(db)

@router.post("/", response_model=schemas.BillingResponse)
def add_bill(
    bill: schemas.BillingCreate,
    db: Session = Depends(get_db)
):
    return crud.create_bill(db, bill)