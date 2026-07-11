from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from datetime import date, datetime, timedelta
from app.database import get_db
from app import models

router = APIRouter(
    prefix="/seed",
    tags=["System Seeding"]
)

@router.get("/stats")
def get_db_stats(db: Session = Depends(get_db)):
    try:
        customers_cnt = db.query(models.Customer).count()
        plans_cnt = db.query(models.Plan).count()
        subs_cnt = db.query(models.Subscription).count()
        cycles_cnt = db.query(models.BillingCycle).count()
        invoices_cnt = db.query(models.Invoice).count()
        payments_cnt = db.query(models.Payment).count()
        audit_cnt = db.query(models.AuditLog).count()
        
        # Legacy billing table count
        billing_cnt = db.query(models.Billing).count()

        return {
            "customers": customers_cnt,
            "plans": plans_cnt,
            "subscriptions": subs_cnt,
            "billing_cycles": cycles_cnt,
            "invoices": invoices_cnt,
            "payments": payments_cnt,
            "audit_logs": audit_cnt,
            "legacy_bills": billing_cnt
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.post("/reset")
def reset_database(db: Session = Depends(get_db)):
    try:
        # Delete in order of foreign key dependencies
        db.query(models.AuditLog).delete()
        db.query(models.Payment).delete()
        db.query(models.Invoice).delete()
        db.query(models.BillingCycle).delete()
        db.query(models.Billing).delete()
        db.query(models.Subscription).delete()
        db.query(models.Customer).delete()
        db.query(models.Plan).delete()
        
        db.commit()
        return {"message": "Database successfully cleared and reset 🚀"}
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=str(e))


@router.post("/sample")
def seed_sample_data(db: Session = Depends(get_db)):
    try:
        # 1. Reset first to avoid duplicate email/name errors
        db.query(models.AuditLog).delete()
        db.query(models.Payment).delete()
        db.query(models.Invoice).delete()
        db.query(models.BillingCycle).delete()
        db.query(models.Billing).delete()
        db.query(models.Subscription).delete()
        db.query(models.Customer).delete()
        db.query(models.Plan).delete()
        db.commit()

        # 2. Add default Plans
        plans_data = [
            {"plan_name": "Basic", "price": 499, "billing_cycle": "Monthly", "description": "Perfect for freelancers and small teams.", "trial_days": 7, "features": "1 User, 5 Projects, Standard Analytics, Email Support"},
            {"plan_name": "Standard", "price": 1499, "billing_cycle": "Monthly", "description": "Great for growing SaaS applications.", "trial_days": 14, "features": "5 Users, 20 Projects, Premium Analytics, 24/7 Support"},
            {"plan_name": "Premium", "price": 2999, "billing_cycle": "Monthly", "description": "Designed for professional scale usage.", "trial_days": 30, "features": "Unlimited Users, Unlimited Projects, Advanced AI Insights, Dedicated Manager"},
            {"plan_name": "Enterprise", "price": 9999, "billing_cycle": "Yearly", "description": "Custom security and scaling for large orgs.", "trial_days": 0, "features": "Dedicated Server, SLA Guarantee, Customized Integrations, Custom Billing Cycles"}
        ]
        
        plans = []
        for p in plans_data:
            plan = models.Plan(
                plan_name=p["plan_name"],
                price=p["price"],
                billing_cycle=p["billing_cycle"],
                description=p["description"],
                trial_days=p["trial_days"],
                features=p["features"],
                status="Active"
            )
            db.add(plan)
            plans.append(plan)
        db.commit()
        for p in plans:
            db.refresh(p)

        # 3. Add default Customers
        customers_data = [
            {"name": "Vyshnavi K", "email": "vyshnavi@example.com", "phone": "+91 9876543210", "company": "Vyshnavi Tech Labs", "status": "Active"},
            {"name": "Rahul Sharma", "email": "rahul.sharma@example.com", "phone": "+91 9123456789", "company": "Sharma Consulting", "status": "Active"},
            {"name": "Sai Charan", "email": "charan.sai@example.com", "phone": "+91 8877665544", "company": "Charan Enterprises", "status": "Active"},
            {"name": "Priya Nair", "email": "priya.nair@example.com", "phone": "+91 7766554433", "company": "Nair Media Group", "status": "Active"},
            {"name": "Karthik M", "email": "karthik.m@example.com", "phone": "+91 9988776655", "company": "Karthik SaaS Corp", "status": "Active"}
        ]

        customers = []
        for c in customers_data:
            cust = models.Customer(
                name=c["name"],
                email=c["email"],
                phone=c["phone"],
                company=c["company"],
                status=c["status"]
            )
            db.add(cust)
            customers.append(cust)
        db.commit()
        for c in customers:
            db.refresh(c)

        # 4. Add Subscriptions and related invoices, payments, audit logs, billing cycles
        today = date.today()
        
        # Subscription 1: Vyshnavi - Premium (Active)
        sub1 = models.Subscription(
            customer_id=customers[0].id,
            plan_id=plans[2].id, # Premium
            start_date=today - timedelta(days=20),
            end_date=today + timedelta(days=10),
            status="active",
            status_updated_at=datetime.utcnow() - timedelta(days=20)
        )
        db.add(sub1)

        # Subscription 2: Rahul - Basic (trial)
        sub2 = models.Subscription(
            customer_id=customers[1].id,
            plan_id=plans[0].id, # Basic
            start_date=today - timedelta(days=2),
            end_date=today + timedelta(days=5), # 7-day trial
            status="trial",
            status_updated_at=datetime.utcnow() - timedelta(days=2)
        )
        db.add(sub2)

        # Subscription 3: Sai Charan - Enterprise (past_due)
        sub3 = models.Subscription(
            customer_id=customers[2].id,
            plan_id=plans[3].id, # Enterprise
            start_date=today - timedelta(days=365),
            end_date=today - timedelta(days=1), # expired yesterday
            status="past_due",
            status_updated_at=datetime.utcnow() - timedelta(days=1)
        )
        db.add(sub3)

        # Subscription 4: Priya - Standard (cancelled)
        sub4 = models.Subscription(
            customer_id=customers[3].id,
            plan_id=plans[1].id, # Standard
            start_date=today - timedelta(days=60),
            end_date=today - timedelta(days=30),
            status="cancelled",
            status_updated_at=datetime.utcnow() - timedelta(days=30)
        )
        db.add(sub4)

        db.commit()
        db.refresh(sub1)
        db.refresh(sub2)
        db.refresh(sub3)
        db.refresh(sub4)

        # 5. Add Billing Cycles
        cycles = [
            models.BillingCycle(subscription_id=sub1.id, cycle_start_date=sub1.start_date, cycle_end_date=sub1.end_date, renewal_date=sub1.end_date, status="pending"),
            models.BillingCycle(subscription_id=sub2.id, cycle_start_date=sub2.start_date, cycle_end_date=sub2.end_date, renewal_date=sub2.end_date, status="pending"),
            models.BillingCycle(subscription_id=sub3.id, cycle_start_date=sub3.start_date, cycle_end_date=sub3.end_date, renewal_date=sub3.end_date, status="pending"),
            models.BillingCycle(subscription_id=sub4.id, cycle_start_date=sub4.start_date, cycle_end_date=sub4.end_date, renewal_date=sub4.end_date, status="completed")
        ]
        for cy in cycles:
            db.add(cy)

        # 6. Add Invoices (and Legacy Billing records for backwards compatibility)
        # Invoice 1 (Paid)
        inv1 = models.Invoice(
            invoice_number=f"INV-{sub1.id}-1",
            subscription_id=sub1.id,
            customer_id=customers[0].id,
            invoice_date=sub1.start_date,
            due_date=sub1.end_date,
            subtotal=2999.0,
            tax_amount=539.82,
            total_amount=3538.82,
            status="paid"
        )
        # Legacy bill 1
        bill1 = models.Billing(
            customer_id=customers[0].id,
            plan_id=plans[2].id,
            amount=3538.82,
            payment_status="Paid",
            payment_method="UPI",
            invoice_number=inv1.invoice_number,
            billing_date=sub1.start_date,
            due_date=sub1.end_date
        )
        
        # Invoice 2 (Draft)
        inv2 = models.Invoice(
            invoice_number=f"INV-{sub2.id}-1",
            subscription_id=sub2.id,
            customer_id=customers[1].id,
            invoice_date=sub2.start_date,
            due_date=sub2.end_date,
            subtotal=499.0,
            tax_amount=89.82,
            total_amount=588.82,
            status="draft"
        )
        # Legacy bill 2
        bill2 = models.Billing(
            customer_id=customers[1].id,
            plan_id=plans[0].id,
            amount=588.82,
            payment_status="Pending",
            payment_method="Card",
            invoice_number=inv2.invoice_number,
            billing_date=sub2.start_date,
            due_date=sub2.end_date
        )

        # Invoice 3 (Unpaid)
        inv3 = models.Invoice(
            invoice_number=f"INV-{sub3.id}-1",
            subscription_id=sub3.id,
            customer_id=customers[2].id,
            invoice_date=sub3.start_date,
            due_date=sub3.end_date,
            subtotal=9999.0,
            tax_amount=1799.82,
            total_amount=11798.82,
            status="unpaid"
        )
        # Legacy bill 3
        bill3 = models.Billing(
            customer_id=customers[2].id,
            plan_id=plans[3].id,
            amount=11798.82,
            payment_status="Pending",
            payment_method="Net Banking",
            invoice_number=inv3.invoice_number,
            billing_date=sub3.start_date,
            due_date=sub3.end_date
        )

        db.add(inv1)
        db.add(inv2)
        db.add(inv3)
        db.add(bill1)
        db.add(bill2)
        db.add(bill3)
        db.commit()
        db.refresh(inv1)
        db.refresh(inv2)
        db.refresh(inv3)

        # 7. Add Payments
        pay1 = models.Payment(
            invoice_id=inv1.id,
            payment_reference="txn_9988776655",
            amount=inv1.total_amount,
            payment_method="UPI",
            status="success",
            payment_date=datetime.utcnow() - timedelta(days=20)
        )
        db.add(pay1)

        # 8. Add Audit Logs
        logs = [
            models.AuditLog(entity_type="plan", entity_id=plans[0].id, action="create", new_value="Created Basic Plan", performed_by="System"),
            models.AuditLog(entity_type="customer", entity_id=customers[0].id, action="create", new_value="Registered Vyshnavi K", performed_by="Admin"),
            models.AuditLog(entity_type="subscription", entity_id=sub1.id, action="create", new_value="Created Premium subscription, status: trial", performed_by="System"),
            models.AuditLog(entity_type="subscription", entity_id=sub1.id, action="status_transition", old_value="status: trial", new_value="status: active", performed_by="System"),
            models.AuditLog(entity_type="payment", entity_id=pay1.id, action="create", new_value="Received payment reference txn_9988776655", performed_by="Gateway")
        ]
        for l in logs:
            db.add(l)

        db.commit()
        return {"message": "Sample data seeded successfully 🚀"}
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=str(e))
