from fastapi import APIRouter, Depends, HTTPException # type: ignore
from sqlalchemy.orm import Session # type: ignore

from app.database import get_db
from app import crud
from app import schemas
from app import security

router = APIRouter(
    prefix="/auth",
    tags=["Authentication"]
)


@router.post("/signup")
def signup(
    request: schemas.SignupRequest,
    db: Session = Depends(get_db)
):

    existing = crud.get_user_by_email(
        db,
        request.email
    )

    if existing:
        raise HTTPException(
            status_code=400,
            detail="Email already registered"
        )

    user = crud.create_user(
        db,
        request.name,
        request.email,
        request.password
    )

    return {
        "message": "Signup Successful",
        "user": user.email
    }


@router.post("/login")
def login(
    request: schemas.LoginRequest,
    db: Session = Depends(get_db)
):

    user = crud.get_user_by_email(
        db,
        request.email
    )

    if not user:
        raise HTTPException(
            status_code=401,
            detail="Invalid credentials"
        )

    if not security.verify_password(
        request.password,
        user.password_hash
    ):
        raise HTTPException(
            status_code=401,
            detail="Invalid credentials"
        )

    token = security.create_access_token(
        {"sub": user.email}
    )

    return {
        "access_token": token,
        "token_type": "bearer"
    }