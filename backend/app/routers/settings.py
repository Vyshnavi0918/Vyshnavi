from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.database import get_db
from app import crud, schemas

router = APIRouter(
    prefix="/settings",
    tags=["Settings"]
)

# Demo user
USER_ID = 1


@router.get("/", response_model=schemas.SettingsResponse)
def get_settings(db: Session = Depends(get_db)):
    return crud.get_user_settings(db, USER_ID)


@router.put("/", response_model=schemas.SettingsResponse)
def update_settings(
    data: schemas.SettingsUpdate,
    db: Session = Depends(get_db)
):
    return crud.update_user_settings(
        db,
        USER_ID,
        data
    )


@router.post("/generate-api-key")
def generate_api_key(
    db: Session = Depends(get_db)
):

    settings = crud.generate_api_key(
        db,
        USER_ID
    )

    return {
        "message": "API Key Generated",
        "api_key": settings.api_key
    }


@router.put("/change-password")
def change_password(
    data: schemas.ChangePassword,
    db: Session = Depends(get_db)
):

    result = crud.change_password(
        db,
        USER_ID,
        data.current_password,
        data.new_password
    )

    if result is False:
        return {
            "message": "Current Password Incorrect"
        }

    return {
        "message": "Password Changed Successfully"
    }