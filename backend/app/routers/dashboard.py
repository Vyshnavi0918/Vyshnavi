from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from sqlalchemy import func
from app.database import get_db
from app import models

router = APIRouter(
    prefix="/dashboard",
    tags=["Dashboard"]
)

@router.get("/stats")
def get_dashboard_stats(db: Session = Depends(get_db)):
    # Total Revenue (sum of paid invoices)
    total_rev = db.query(func.sum(models.Invoice.total_amount)).filter(models.Invoice.status == "paid").scalar() or 0.0
    
    # Active Customers count
    active_cust = db.query(models.Customer).filter(models.Customer.status == "Active").count()
    
    # Active Plans count
    active_plans = db.query(models.Plan).filter(models.Plan.status == "Active").count()
    
    # Total Invoices count
    total_invs = db.query(models.Invoice).count()

    return {
        "stats": [
            {
                "title": "Total Revenue",
                "value": f"₹{int(total_rev):,}",
                "subtitle": "This financial year",
                "trend": "up",
                "trendValue": "+18.2%"
            },
            {
                "title": "Active Customers",
                "value": str(active_cust),
                "subtitle": "+32 new this month",
                "trend": "up",
                "trendValue": "+8.4%"
            },
            {
                "title": "Active Plans",
                "value": str(active_plans),
                "subtitle": "3 launching soon",
                "trend": "up",
                "trendValue": "+2"
            },
            {
                "title": "Total Invoices",
                "value": str(total_invs),
                "subtitle": "Generated today",
                "trend": "up",
                "trendValue": "+12.7%"
            }
        ]
    }

@router.get("/revenue")
def get_revenue_chart_data(period: str = "monthly", db: Session = Depends(get_db)):
    # Dummy mock chart data corresponding to standard months matching frontend expectations
    return [
        { "month": "Jan", "revenue": 12000, "expenses": 8000, "profit": 4000 },
        { "month": "Feb", "revenue": 18000, "expenses": 11000, "profit": 7000 },
        { "month": "Mar", "revenue": 15000, "expenses": 9500, "profit": 5500 },
        { "month": "Apr", "revenue": 22000, "expenses": 13000, "profit": 9000 },
        { "month": "May", "revenue": 30000, "expenses": 16000, "profit": 14000 },
        { "month": "Jun", "revenue": 28000, "expenses": 15000, "profit": 13000 },
        { "month": "Jul", "revenue": 35000, "expenses": 18000, "profit": 17000 }
    ]

@router.get("/subscriptions")
def get_subscription_chart_data(db: Session = Depends(get_db)):
    trial_cnt = db.query(models.Subscription).filter(models.Subscription.status == "trial").count()
    active_cnt = db.query(models.Subscription).filter(models.Subscription.status == "active").count()
    past_due_cnt = db.query(models.Subscription).filter(models.Subscription.status == "past_due").count()
    cancelled_cnt = db.query(models.Subscription).filter(models.Subscription.status == "cancelled").count()

    return [
        { "name": "Active", "value": active_cnt },
        { "name": "Trial", "value": trial_cnt },
        { "name": "Past Due", "value": past_due_cnt },
        { "name": "Cancelled", "value": cancelled_cnt }
    ]
