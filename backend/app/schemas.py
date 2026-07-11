from datetime import datetime, date
from typing import Optional, List
from pydantic import BaseModel, EmailStr # type: ignore

class SignupRequest(BaseModel):
    name: str
    email: EmailStr
    password: str


class LoginRequest(BaseModel):
    email: EmailStr
    password: str


class UserResponse(BaseModel):
    id: int
    name: str
    email: EmailStr
    language: str
    theme: str
    role: str
    created_at: datetime

    model_config = {
        "from_attributes": True
    }


class CustomerCreate(BaseModel):
    name: str
    email: EmailStr
    phone: Optional[str] = None
    company: Optional[str] = None


class CustomerResponse(BaseModel):
    id: int
    name: str
    email: EmailStr
    phone: Optional[str] = None
    company: Optional[str] = None
    company_name: Optional[str] = None
    status: Optional[str] = "Active"
    created_at: datetime

    model_config = {
        "from_attributes": True
    }


class PlanCreate(BaseModel):
    plan_name: str
    price: int
    billing_cycle: str
    description: Optional[str] = None
    trial_days: Optional[int] = 14
    features: Optional[str] = ""


class PlanResponse(BaseModel):
    id: int
    plan_name: str
    name: Optional[str] = None
    price: int
    billing_cycle: str
    billing_interval: Optional[str] = None
    description: Optional[str] = None
    status: str
    trial_days: int
    features: str
    created_at: datetime

    model_config = {
        "from_attributes": True
    }


class SubscriptionCreate(BaseModel):
    customer_id: int
    plan_id: int
    start_date: Optional[date] = None
    end_date: Optional[date] = None
    status: Optional[str] = "trial"


class SubscriptionChangePlan(BaseModel):
    plan_id: int


class SubscriptionResponse(BaseModel):
    id: int
    customer_id: int
    plan_id: int
    customer_name: str
    plan_name: str
    start_date: date
    end_date: date
    status: str
    status_updated_at: datetime
    created_at: datetime

    model_config = {
        "from_attributes": True
    }


class SubscriptionStatusUpdate(BaseModel):
    status: str


class BillingCreate(BaseModel):
    customer_id: int
    plan_id: int
    amount: float
    payment_method: str
    billing_date: date
    due_date: date


class BillingResponse(BaseModel):
    id: int
    customer_id: int
    plan_id: int
    amount: float
    payment_status: str
    payment_method: str
    invoice_number: str
    billing_date: date
    due_date: date

    model_config = {
        "from_attributes": True
    }


# New schemas for extended tables
class BillingCycleResponse(BaseModel):
    id: int
    subscription_id: int
    cycle_start_date: date
    cycle_end_date: date
    renewal_date: date
    status: str
    created_at: datetime
    updated_at: datetime

    model_config = {
        "from_attributes": True
    }


class InvoiceCreate(BaseModel):
    subscription_id: int
    customer_id: int
    invoice_number: str
    invoice_date: date
    due_date: date
    subtotal: float
    tax_amount: float
    total_amount: float
    status: str


class InvoiceResponse(BaseModel):
    id: int
    invoice_number: str
    subscription_id: int
    customer_id: int
    invoice_date: date
    due_date: date
    subtotal: float
    tax_amount: float
    total_amount: float
    status: str
    created_at: datetime

    model_config = {
        "from_attributes": True
    }


class PaymentCreate(BaseModel):
    invoice_id: int
    payment_reference: str
    amount: float
    payment_method: str
    status: str


class PaymentResponse(BaseModel):
    id: int
    invoice_id: int
    payment_reference: str
    amount: float
    payment_method: str
    status: str
    payment_date: datetime
    created_at: datetime

    model_config = {
        "from_attributes": True
    }


class AuditLogResponse(BaseModel):
    id: int
    entity_type: str
    entity_id: int
    action: str
    old_value: Optional[str] = None
    new_value: Optional[str] = None
    performed_by: str
    created_at: datetime

    model_config = {
        "from_attributes": True
    }

    # ===========================
# USER SETTINGS
# ===========================

class SettingsBase(BaseModel):
    theme: str
    language: str
    currency: str
    notifications: str
    email_alerts: str
    sms_alerts: str
    weekly_reports: str
    two_factor: str
    login_alerts: str
    session_timeout: str


class SettingsUpdate(SettingsBase):
    pass


class SettingsResponse(SettingsBase):
    id: int
    user_id: int
    api_key: str | None = None

    model_config = {
        "from_attributes": True
    }


# ===========================
# CHANGE PASSWORD
# ===========================

class ChangePassword(BaseModel):
    current_password: str
    new_password: str


# ===========================
# TASKS
# ===========================
class TaskCreate(BaseModel):
    title: str
    description: Optional[str] = None
    status: Optional[str] = "Pending"
    priority: Optional[str] = "Medium"
    due_date: Optional[datetime] = None


class TaskResponse(BaseModel):
    id: int
    title: str
    description: Optional[str] = None
    status: str
    priority: str
    due_date: Optional[datetime] = None
    created_at: datetime

    model_config = {
        "from_attributes": True
    }