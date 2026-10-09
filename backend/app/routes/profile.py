from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.core.security import get_current_user
from app.db.database import get_db
from app.schemas.profile import UpdateProfile
from app.services.profile_service import (
    get_profile,
    update_profile
)

router = APIRouter(tags=["Profile"])

@router.get("/profile")
def view_profile(
    db:Session = Depends(get_db),
    current_user = Depends(get_current_user)
):
    return get_profile(db=db, user_id=current_user.id)

@router.put("/profile/edit")
def edit_profile(
    payload: UpdateProfile,
    db:Session = Depends(get_db),
    current_user = Depends(get_current_user)
):
    return update_profile(db=db, payload=payload, user_id=current_user.id)