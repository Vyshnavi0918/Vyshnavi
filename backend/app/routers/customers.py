from fastapi import APIRouter, Depends, HTTPException # type: ignore
from sqlalchemy.orm import Session # type: ignore

from app.database import get_db
from app import crud, schemas

router = APIRouter(
    prefix="/customers",
    tags=["Customers"]
)


@router.get("/", response_model=list[schemas.CustomerResponse])
def get_all_customers(db: Session = Depends(get_db)):
    return crud.get_customers(db)


@router.get("/{customer_id}", response_model=schemas.CustomerResponse)
def get_customer(customer_id: int, db: Session = Depends(get_db)):
    customer = crud.get_customer_by_id(db, customer_id)
    if not customer:
        raise HTTPException(status_code=404, detail="Customer not found")
    return customer


@router.post("/", response_model=schemas.CustomerResponse)
def add_customer(
    customer: schemas.CustomerCreate,
    db: Session = Depends(get_db)
):
    return crud.create_customer(db, customer)


@router.put("/{customer_id}", response_model=schemas.CustomerResponse)
def update_customer(
    customer_id: int,
    customer: schemas.CustomerCreate,
    db: Session = Depends(get_db)
):
    updated = crud.update_customer(db, customer_id, customer)
    if not updated:
        raise HTTPException(status_code=404, detail="Customer not found")
    return updated


@router.delete("/{customer_id}", response_model=schemas.CustomerResponse)
def delete_customer(customer_id: int, db: Session = Depends(get_db)):
    deleted = crud.delete_customer(db, customer_id)
    if not deleted:
        raise HTTPException(status_code=404, detail="Customer not found")
    return deleted