from sqlalchemy.orm import Session # type: ignore
from datetime import datetime, date
from app import models
from app import security


# ===========================
# Authentication
# ===========================

def get_user_by_email(db: Session, email: str):
    return (
        db.query(models.AuthUser)
        .filter(models.AuthUser.email == email)
        .first()
    )


def create_user(db: Session, name: str, email: str, password: str):
    hashed = security.hash_password(password)

    user = models.AuthUser(
        name=name,
        email=email,
        password_hash=hashed
    )

    db.add(user)
    db.commit()
    db.refresh(user)

    return user


# ===========================
# Customers
# ===========================

def get_customers(db: Session):
    return (
        db.query(models.Customer)
        .order_by(models.Customer.id.desc())
        .all()
    )


def get_customer_by_id(db: Session, customer_id: int):
    return (
        db.query(models.Customer)
        .filter(models.Customer.id == customer_id)
        .first()
    )


def create_customer(db: Session, customer):
    new_customer = models.Customer(
        name=customer.name,
        email=customer.email,
        phone=customer.phone,
        company=customer.company,
        status="Active"
    )

    db.add(new_customer)
    db.commit()
    db.refresh(new_customer)

    return new_customer


def update_customer(db: Session, customer_id: int, customer):
    existing = get_customer_by_id(db, customer_id)

    if not existing:
        return None

    existing.name = customer.name
    existing.email = customer.email
    existing.phone = customer.phone
    existing.company = customer.company

    db.commit()
    db.refresh(existing)

    return existing


def delete_customer(db: Session, customer_id: int):
    customer = get_customer_by_id(db, customer_id)

    if not customer:
        return None

    # Cascade delete subscriptions and billing records
    db.query(models.Subscription).filter(models.Subscription.customer_id == customer_id).delete()
    db.query(models.Billing).filter(models.Billing.customer_id == customer_id).delete()
    db.query(models.Invoice).filter(models.Invoice.customer_id == customer_id).delete()
    
    db.delete(customer)
    db.commit()

    return customer


# ===========================
# Plans
# ===========================

def get_plans(db: Session):
    return db.query(models.Plan).order_by(models.Plan.id.desc()).all()


def get_plan_by_id(db: Session, plan_id: int):
    return db.query(models.Plan).filter(models.Plan.id == plan_id).first()


def create_plan(db: Session, plan):
    new_plan = models.Plan(
        plan_name=plan.plan_name,
        price=plan.price,
        billing_cycle=plan.billing_cycle,
        description=plan.description,
        trial_days=plan.trial_days if plan.trial_days is not None else 14,
        features=plan.features if plan.features is not None else "",
        status="Active"
    )

    db.add(new_plan)
    db.commit()
    db.refresh(new_plan)

    return new_plan


def update_plan(db: Session, plan_id: int, plan):
    existing = get_plan_by_id(db, plan_id)
    if not existing:
        return None

    existing.plan_name = plan.plan_name
    existing.price = plan.price
    existing.billing_cycle = plan.billing_cycle
    existing.description = plan.description
    existing.trial_days = plan.trial_days
    existing.features = plan.features

    db.commit()
    db.refresh(existing)
    return existing


def archive_plan(db: Session, plan_id: int):
    existing = get_plan_by_id(db, plan_id)
    if not existing:
        return None

    existing.status = "Archived"
    db.commit()
    db.refresh(existing)
    return existing


# ===========================
# Billing / Bills
# ===========================

def get_bills(db: Session):
    return db.query(models.Billing).all()


def create_bill(db: Session, bill):
    new_bill = models.Billing(
        customer_id=bill.customer_id,
        plan_id=bill.plan_id,
        amount=bill.amount,
        payment_method=bill.payment_method,
        billing_date=bill.billing_date,
        due_date=bill.due_date,
        invoice_number=f"INV-{bill.customer_id}-{bill.plan_id}",
        payment_status="Pending"
    )

    db.add(new_bill)
    db.commit()
    db.refresh(new_bill)

    return new_bill


# ===========================
# Subscriptions
# ===========================

def get_subscriptions(db: Session):
    subscriptions = (
        db.query(models.Subscription)
        .order_by(models.Subscription.id.desc())
        .all()
    )

    result = []
    for sub in subscriptions:
        customer = db.query(models.Customer).filter(
            models.Customer.id == sub.customer_id
        ).first()

        plan = db.query(models.Plan).filter(
            models.Plan.id == sub.plan_id
        ).first()

        result.append({
            "id": sub.id,
            "customer_id": sub.customer_id,
            "plan_id": sub.plan_id,
            "customer_name": customer.name if customer else f"Customer #{sub.customer_id}",
            "plan_name": plan.plan_name if plan else f"Plan #{sub.plan_id}",
            "start_date": sub.start_date,
            "end_date": sub.end_date,
            "status": sub.status,
            "status_updated_at": sub.status_updated_at,
            "created_at": sub.created_at
        })

    return result


def get_subscription_by_id(db: Session, subscription_id: int):
    return db.query(models.Subscription).filter(models.Subscription.id == subscription_id).first()


def create_subscription(db: Session, subscription):
    # Validate customer exists
    customer = db.query(models.Customer).filter(models.Customer.id == subscription.customer_id).first()
    if not customer:
        raise HTTPException(status_code=400, detail="Customer not found")

    # Validate plan exists
    plan = db.query(models.Plan).filter(models.Plan.id == subscription.plan_id).first()
    if not plan:
        raise HTTPException(status_code=400, detail="Plan not found")

    # Calculate dates if not provided
    start_dt = subscription.start_date or date.today()
    status = subscription.status or "trial"
    
    if subscription.end_date:
        end_dt = subscription.end_date
    else:
        if status == "trial":
            trial_days = plan.trial_days if plan.trial_days is not None else 14
            end_dt = start_dt + timedelta(days=trial_days)
        elif plan.billing_cycle.lower() == "yearly" or plan.billing_cycle.lower() == "annual":
            end_dt = start_dt + timedelta(days=365)
        else:
            end_dt = start_dt + timedelta(days=30)

    new_sub = models.Subscription(
        customer_id=subscription.customer_id,
        plan_id=subscription.plan_id,
        start_date=start_dt,
        end_date=end_dt,
        status=status,
        status_updated_at=datetime.utcnow()
    )

    db.add(new_sub)
    db.commit()
    db.refresh(new_sub)

    # Automatically create BillingCycle
    new_cycle = models.BillingCycle(
        subscription_id=new_sub.id,
        cycle_start_date=start_dt,
        cycle_end_date=end_dt,
        renewal_date=end_dt,
        status="pending"
    )
    db.add(new_cycle)

    # Automatically create an Invoice
    price = plan.price if plan else 0.0
    subtotal = float(price)
    tax = round(subtotal * 0.18, 2)  # 18% GST
    total = subtotal + tax

    new_invoice = models.Invoice(
        invoice_number=f"INV-{new_sub.id}-{int(datetime.utcnow().timestamp())}",
        subscription_id=new_sub.id,
        customer_id=subscription.customer_id,
        invoice_date=start_dt,
        due_date=end_dt,
        subtotal=subtotal,
        tax_amount=tax,
        total_amount=total,
        status="unpaid" if new_sub.status != "trial" else "draft"
    )
    db.add(new_invoice)

    # Audit Log
    log = models.AuditLog(
        entity_type="subscription",
        entity_id=new_sub.id,
        action="create",
        new_value=f"status: {new_sub.status}, plan_id: {new_sub.plan_id}",
        performed_by="System"
    )
    db.add(log)

    db.commit()
    db.refresh(new_sub)
    return new_sub


# ===========================
# Subscription State Machine
# ===========================

def validate_subscription_transition(current_status: str, new_status: str) -> bool:
    allowed = {
        "trial": {"active", "cancelled"},
        "active": {"past_due", "cancelled", "paused"},
        "paused": {"active", "cancelled"},
        "past_due": {"active", "cancelled"},
        "cancelled": set()  # Terminal state
    }
    return new_status in allowed.get(current_status, set())


def update_subscription_status(db: Session, subscription_id: int, new_status: str):
    sub = get_subscription_by_id(db, subscription_id)
    if not sub:
        return None

    current = sub.status
    if not validate_subscription_transition(current, new_status):
        raise ValueError(f"Invalid status transition from '{current}' to '{new_status}'")

    sub.status = new_status
    sub.status_updated_at = datetime.utcnow()

    # Log Audit
    log = models.AuditLog(
        entity_type="subscription",
        entity_id=sub.id,
        action="status_transition",
        old_value=f"status: {current}",
        new_value=f"status: {new_status}",
        performed_by="Admin"
    )
    db.add(log)
    db.commit()
    db.refresh(sub)
    return sub


def change_subscription_plan(db: Session, subscription_id: int, new_plan_id: int):
    sub = get_subscription_by_id(db, subscription_id)
    if not sub:
        raise HTTPException(status_code=404, detail="Subscription not found")

    plan = db.query(models.Plan).filter(models.Plan.id == new_plan_id).first()
    if not plan:
        raise HTTPException(status_code=404, detail="New plan not found")

    old_plan_id = sub.plan_id
    sub.plan_id = new_plan_id
    sub.status_updated_at = datetime.utcnow()

    # Audit Log
    log = models.AuditLog(
        entity_type="subscription",
        entity_id=sub.id,
        action="change_plan",
        old_value=f"plan_id: {old_plan_id}",
        new_value=f"plan_id: {new_plan_id}",
        performed_by="Admin"
    )
    db.add(log)
    db.commit()
    db.refresh(sub)
    return sub


def renew_subscription_cycle(db: Session, subscription_id: int):
    sub = get_subscription_by_id(db, subscription_id)
    if not sub:
        raise HTTPException(status_code=404, detail="Subscription not found")

    plan = db.query(models.Plan).filter(models.Plan.id == sub.plan_id).first()
    if not plan:
        raise HTTPException(status_code=404, detail="Plan not found")

    # Mark all current pending cycles as completed
    db.query(models.BillingCycle).filter(
        models.BillingCycle.subscription_id == subscription_id,
        models.BillingCycle.status == "pending"
    ).update({"status": "completed"})

    # Calculate next renewal dates
    start_dt = sub.end_date
    if plan.billing_cycle.lower() == "yearly" or plan.billing_cycle.lower() == "annual":
        end_dt = start_dt + timedelta(days=365)
    else:
        end_dt = start_dt + timedelta(days=30)

    # Update subscription dates
    sub.start_date = start_dt
    sub.end_date = end_dt
    sub.status = "active"
    sub.status_updated_at = datetime.utcnow()

    # Create new billing cycle
    new_cycle = models.BillingCycle(
        subscription_id=sub.id,
        cycle_start_date=start_dt,
        cycle_end_date=end_dt,
        renewal_date=end_dt,
        status="pending"
    )
    db.add(new_cycle)

    # Generate Invoice for the new cycle
    price = plan.price
    subtotal = float(price)
    tax = round(subtotal * 0.18, 2)
    total = subtotal + tax

    new_invoice = models.Invoice(
        invoice_number=f"INV-{sub.id}-{int(datetime.utcnow().timestamp())}",
        subscription_id=sub.id,
        customer_id=sub.customer_id,
        invoice_date=start_dt,
        due_date=end_dt,
        subtotal=subtotal,
        tax_amount=tax,
        total_amount=total,
        status="unpaid"
    )
    db.add(new_invoice)

    # Audit Log
    log = models.AuditLog(
        entity_type="subscription",
        entity_id=sub.id,
        action="renew_cycle",
        new_value=f"cycle_start_date: {start_dt}, cycle_end_date: {end_dt}",
        performed_by="System"
    )
    db.add(log)
    db.commit()
    db.refresh(sub)
    return sub


# ===========================
# USER SETTINGS
# ===========================

def get_user_settings(db: Session, user_id: int):
    settings = (
        db.query(models.UserSettings)
        .filter(models.UserSettings.user_id == user_id)
        .first()
    )

    if not settings:
        settings = models.UserSettings(
            user_id=user_id
        )

        db.add(settings)
        db.commit()
        db.refresh(settings)

    return settings


def update_user_settings(db: Session, user_id: int, data):

    settings = get_user_settings(db, user_id)

    settings.theme = data.theme
    settings.language = data.language
    settings.currency = data.currency

    settings.notifications = data.notifications
    settings.email_alerts = data.email_alerts
    settings.sms_alerts = data.sms_alerts
    settings.weekly_reports = data.weekly_reports

    settings.two_factor = data.two_factor
    settings.login_alerts = data.login_alerts

    settings.session_timeout = data.session_timeout

    db.commit()
    db.refresh(settings)

    return settings


def generate_api_key(db: Session, user_id: int):

    import secrets

    settings = get_user_settings(db, user_id)

    settings.api_key = secrets.token_hex(32)

    db.commit()
    db.refresh(settings)

    return settings


def change_password(
    db: Session,
    user_id: int,
    current_password: str,
    new_password: str
):

    user = (
        db.query(models.AuthUser)
        .filter(models.AuthUser.id == user_id)
        .first()
    )

    if not user:
        return None

    if not security.verify_password(
        current_password,
        user.password_hash
    ):
        return False

    user.password_hash = security.hash_password(
        new_password
    )

    db.commit()

    return True


# ===========================
# Tasks
# ===========================

def get_tasks(db: Session):
    return db.query(models.Task).order_by(models.Task.id.desc()).all()


def get_task_by_id(db: Session, task_id: int):
    return db.query(models.Task).filter(models.Task.id == task_id).first()


def create_task(db: Session, task):
    new_task = models.Task(
        title=task.title,
        description=task.description,
        status=task.status or "Pending",
        priority=task.priority or "Medium",
        due_date=task.due_date
    )
    db.add(new_task)
    db.commit()
    db.refresh(new_task)
    return new_task


def update_task(db: Session, task_id: int, task):
    existing = get_task_by_id(db, task_id)
    if not existing:
        return None
    existing.title = task.title
    existing.description = task.description
    existing.status = task.status
    existing.priority = task.priority
    existing.due_date = task.due_date
    db.commit()
    db.refresh(existing)
    return existing


def delete_task(db: Session, task_id: int):
    existing = get_task_by_id(db, task_id)
    if not existing:
        return None
    db.delete(existing)
    db.commit()
    return existing