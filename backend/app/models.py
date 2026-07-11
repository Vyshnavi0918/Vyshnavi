from datetime import datetime
from sqlalchemy import Column, Integer, String, DateTime, ForeignKey, Date, Float # type: ignore
from app.database import Base


# ==========================
# Authentication Table
# ==========================
class AuthUser(Base):
    __tablename__ = "auth_users"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(100), nullable=False)
    email = Column(String(150), unique=True, index=True, nullable=False)
    password_hash = Column(String(255), nullable=False)
    language = Column(String(20), default="English")
    theme = Column(String(20), default="Light")
    role = Column(String(20), default="User")
    created_at = Column(DateTime, default=datetime.utcnow)


# ==========================
# Customer Table
# ==========================
class Customer(Base):
    __tablename__ = "customers"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(100), nullable=False)
    email = Column(String(150), unique=True, nullable=False)
    phone = Column(String(20), nullable=True)
    company = Column(String(100), nullable=True)
    status = Column(String(20), default="Active")
    created_at = Column(DateTime, default=datetime.utcnow)

    @property
    def company_name(self):
        return self.company


# ==========================
# Plans Table
# ==========================
class Plan(Base):
    __tablename__ = "plans"

    id = Column(Integer, primary_key=True, index=True)
    plan_name = Column(String(100), nullable=False)
    price = Column(Integer, nullable=False)
    billing_cycle = Column(String(20), nullable=False)
    description = Column(String(255), nullable=True)
    status = Column(String(20), default="Active")
    created_at = Column(DateTime, default=datetime.utcnow)
    
    # PDF mandated fields
    trial_days = Column(Integer, default=14)
    features = Column(String(512), default="")

    @property
    def name(self):
        return self.plan_name

    @property
    def billing_interval(self):
        return self.billing_cycle


# ==========================
# Subscriptions Table
# ==========================
class Subscription(Base):
    __tablename__ = "subscriptions"

    id = Column(Integer, primary_key=True, index=True)
    customer_id = Column(Integer, ForeignKey("customers.id"))
    plan_id = Column(Integer, ForeignKey("plans.id"))
    start_date = Column(Date)
    end_date = Column(Date)
    status = Column(String(20), default="trial")  # trial, active, past_due, cancelled
    status_updated_at = Column(DateTime, default=datetime.utcnow)
    created_at = Column(DateTime, default=datetime.utcnow)


# ==========================
# Billing Cycles Table
# ==========================
class BillingCycle(Base):
    __tablename__ = "billing_cycles"

    id = Column(Integer, primary_key=True, index=True)
    subscription_id = Column(Integer, ForeignKey("subscriptions.id"))
    cycle_start_date = Column(Date)
    cycle_end_date = Column(Date)
    renewal_date = Column(Date)
    status = Column(String(20), default="pending")  # pending/completed
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)


# ==========================
# Invoices Table
# ==========================
class Invoice(Base):
    __tablename__ = "invoices"

    id = Column(Integer, primary_key=True, index=True)
    invoice_number = Column(String(50), unique=True, index=True)
    subscription_id = Column(Integer, ForeignKey("subscriptions.id"))
    customer_id = Column(Integer, ForeignKey("customers.id"))
    invoice_date = Column(Date)
    due_date = Column(Date)
    subtotal = Column(Float)
    tax_amount = Column(Float)
    total_amount = Column(Float)
    status = Column(String(20), default="draft")  # draft/paid/unpaid/void
    created_at = Column(DateTime, default=datetime.utcnow)


# ==========================
# Payments Table
# ==========================
class Payment(Base):
    __tablename__ = "payments"

    id = Column(Integer, primary_key=True, index=True)
    invoice_id = Column(Integer, ForeignKey("invoices.id"))
    payment_reference = Column(String(100), unique=True)
    amount = Column(Float)
    payment_method = Column(String(50))
    status = Column(String(20), default="pending")  # pending/success/failed/refunded
    payment_date = Column(DateTime, default=datetime.utcnow)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)


# ==========================
# Audit Logs Table
# ==========================
class AuditLog(Base):
    __tablename__ = "audit_logs"

    id = Column(Integer, primary_key=True, index=True)
    entity_type = Column(String(50))  # plan/subscription/invoice/payment
    entity_id = Column(Integer)
    action = Column(String(100))  # create, update, delete, status_transition
    old_value = Column(String(1000), nullable=True)
    new_value = Column(String(1000), nullable=True)
    performed_by = Column(String(100), default="System")
    created_at = Column(DateTime, default=datetime.utcnow)


# ==========================
# Billing Table (Deprecated, kept for backwards compatibility)
# ==========================
class Billing(Base):
    __tablename__ = "billing"

    id = Column(Integer, primary_key=True, index=True)
    customer_id = Column(Integer, ForeignKey("customers.id"))
    plan_id = Column(Integer, ForeignKey("plans.id"))
    amount = Column(Float)
    payment_status = Column(String(20), default="Pending")
    payment_method = Column(String(50))
    invoice_number = Column(String(50))
    billing_date = Column(Date)
    due_date = Column(Date)
    created_at = Column(DateTime, default=datetime.utcnow)# ==========================
# User Settings
# ==========================

class UserSettings(Base):
    __tablename__ = "user_settings"

    id = Column(Integer, primary_key=True, index=True)

    user_id = Column(
        Integer,
        ForeignKey("auth_users.id"),
        unique=True
    )

    theme = Column(String(20), default="Light")

    language = Column(String(20), default="English")

    currency = Column(String(10), default="INR")

    notifications = Column(String(10), default="Enabled")

    email_alerts = Column(String(10), default="Enabled")

    sms_alerts = Column(String(10), default="Disabled")

    weekly_reports = Column(String(10), default="Enabled")

    two_factor = Column(String(10), default="Disabled")

    login_alerts = Column(String(10), default="Enabled")

    session_timeout = Column(String(20), default="30 Minutes")

    api_key = Column(String(255), nullable=True)

    created_at = Column(DateTime, default=datetime.utcnow)

    updated_at = Column(
        DateTime,
        default=datetime.utcnow,
        onupdate=datetime.utcnow,
    )


# ==========================
# Tasks Table
# ==========================
class Task(Base):
    __tablename__ = "tasks"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String(255), nullable=False)
    description = Column(String(500), nullable=True)
    status = Column(String(50), default="Pending")
    priority = Column(String(50), default="Medium")
    due_date = Column(DateTime, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)