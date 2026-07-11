from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.database import get_db
from app import crud, schemas

router = APIRouter(
    prefix="/subscriptions",
    tags=["Subscriptions"]
)


@router.get("/", response_model=list[schemas.SubscriptionResponse])
def get_subscriptions(db: Session = Depends(get_db)):
    return crud.get_subscriptions(db)


@router.post("/", response_model=schemas.SubscriptionResponse)
def create_subscription(
    subscription: schemas.SubscriptionCreate,
    db: Session = Depends(get_db),
):
    try:
        return crud.create_subscription(db, subscription)
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))


@router.put("/{subscription_id}/status", response_model=schemas.SubscriptionResponse)
def update_subscription_status(
    subscription_id: int,
    status_update: schemas.SubscriptionStatusUpdate,
    db: Session = Depends(get_db)
):
    try:
        updated = crud.update_subscription_status(db, subscription_id, status_update.status)
        if not updated:
            raise HTTPException(status_code=404, detail="Subscription not found")
        return updated
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))


@router.post("/{subscription_id}/change-plan", response_model=schemas.SubscriptionResponse)
def change_subscription_plan(
    subscription_id: int,
    change_req: schemas.SubscriptionChangePlan,
    db: Session = Depends(get_db)
):
    try:
        return crud.change_subscription_plan(db, subscription_id, change_req.plan_id)
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))


@router.post("/{subscription_id}/pause", response_model=schemas.SubscriptionResponse)
def pause_subscription(subscription_id: int, db: Session = Depends(get_db)):
    try:
        updated = crud.update_subscription_status(db, subscription_id, "paused")
        if not updated:
            raise HTTPException(status_code=404, detail="Subscription not found")
        return updated
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))


@router.post("/{subscription_id}/resume", response_model=schemas.SubscriptionResponse)
def resume_subscription(subscription_id: int, db: Session = Depends(get_db)):
    try:
        updated = crud.update_subscription_status(db, subscription_id, "active")
        if not updated:
            raise HTTPException(status_code=404, detail="Subscription not found")
        return updated
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))


@router.post("/{subscription_id}/cancel", response_model=schemas.SubscriptionResponse)
def cancel_subscription(subscription_id: int, db: Session = Depends(get_db)):
    try:
        updated = crud.update_subscription_status(db, subscription_id, "cancelled")
        if not updated:
            raise HTTPException(status_code=404, detail="Subscription not found")
        return updated
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))


@router.post("/{subscription_id}/renew", response_model=schemas.SubscriptionResponse)
def renew_subscription_cycle(subscription_id: int, db: Session = Depends(get_db)):
    try:
        return crud.renew_subscription_cycle(db, subscription_id)
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))