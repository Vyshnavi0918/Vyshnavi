from fastapi import FastAPI # type: ignore
from fastapi.middleware.cors import CORSMiddleware # type: ignore
from app.routers import customers
from app.database import Base, engine
from app.routers import auth
from app.routers import plans
from app.routers import billing
from app.routers import subscriptions # type: ignore
from app.routers import seed
from app.routers import settings
from app.routers import dashboard
from app.routers import invoices
from app.routers import profile
from app.routers import tasks
from app.routers import billing_cycles

app = FastAPI(
    title="Recurring Revenue & Subscription Platform"
)

# Create all database tables
from app import models
Base.metadata.create_all(bind=engine)

# Enable CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173",
        "http://localhost:5174",
        "http://127.0.0.1:5174",
        "http://localhost:5175",
        "http://127.0.0.1:5175",
        "http://localhost:5176",
        "http://127.0.0.1:5176",
        "http://localhost:5177",
        "http://127.0.0.1:5177",
        "http://localhost:3000",
        "http://127.0.0.1:3000",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Register Routers
app.include_router(auth.router)
app.include_router(customers.router)
app.include_router(plans.router)
app.include_router(billing.router)
app.include_router(subscriptions.router)
app.include_router(seed.router)
app.include_router(settings.router)
app.include_router(dashboard.router)
app.include_router(invoices.router)
app.include_router(profile.router)
app.include_router(tasks.router)
app.include_router(billing_cycles.router)

@app.get("/")
def root():
    return {
        "message": "Backend Running Successfully 🚀"
    }