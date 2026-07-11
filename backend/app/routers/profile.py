from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.database import get_db
from app import models, schemas

router = APIRouter(
    prefix="/profile",
    tags=["Profile"]
)

@router.get("/", response_model=schemas.UserResponse)
def get_profile(db: Session = Depends(get_db)):
    # Returns the first auth user as current logged in profile
    user = db.query(models.AuthUser).first()
    if not user:
        # Create a default admin user if none exists
        from app import security
        user = models.AuthUser(
            name="Vyshnavi K",
            email="vyshnavi@example.com",
            password_hash=security.hash_password("admin123"),
            role="Admin"
        )
        db.add(user)
        db.commit()
        db.refresh(user)
    return user
