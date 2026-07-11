from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.database import get_db
from app import models, schemas, crud

router = APIRouter(
    prefix="/billing-cycles",
    tags=["Billing Cycles"]
)

@router.get("/", response_model=list[schemas.BillingCycleResponse])
def get_billing_cycles(subscription_id: int = None, db: Session = Depends(get_db)):
    query = db.query(models.BillingCycle)
    if subscription_id is not None:
        query = query.filter(models.BillingCycle.subscription_id == subscription_id)
    return query.order_by(models.BillingCycle.id.desc()).all()

@router.post("/generate", response_model=schemas.SubscriptionResponse)
def generate_next_billing_cycle(req: dict, db: Session = Depends(get_db)):
    sub_id = req.get("subscription_id")
    if not sub_id:
        raise HTTPException(status_code=400, detail="subscription_id is required")
    try:
        return crud.renew_subscription_cycle(db, sub_id)
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@router.get("/current/{subscription_id}", response_model=schemas.BillingCycleResponse)
def get_current_billing_cycle(subscription_id: int, db: Session = Depends(get_db)):
    cycle = db.query(models.BillingCycle).filter(
        models.BillingCycle.subscription_id == subscription_id,
        models.BillingCycle.status == "pending"
    ).order_by(models.BillingCycle.id.desc()).first()
    
    if not cycle:
        cycle = db.query(models.BillingCycle).filter(
            models.BillingCycle.subscription_id == subscription_id
        ).order_by(models.BillingCycle.id.desc()).first()
        
    if not cycle:
        raise HTTPException(status_code=404, detail="No billing cycle found for this subscription")
    return cycle
