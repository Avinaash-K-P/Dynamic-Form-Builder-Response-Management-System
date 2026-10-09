from fastapi import HTTPException
from sqlalchemy.orm import Session
from app.schemas.profile import UpdateProfile
from app.models.user import User
from app.utils.cache import get_cache, set_cache, delete_cache
from app.schemas.activity_log import ActivityLogCreate
from app.services.activity_log_service import create_activity_log

def get_profile(db:Session, user_id:int):

    cache_key = f"profile:{user_id}"

    # Check Redis first
    cached_profile = get_cache(cache_key)

    if cached_profile is not None:
        return {
            "message":"User profile fetched",
            "data": cached_profile
        }

    profile = db.query(User).filter(
        User.id == user_id        
    ).first()

    if not profile:
        raise HTTPException(status_code=404, detail="User not found")

    data = {
        "id": profile.id,
        "username": profile.username,
        "email": profile.email,
        "role_id": profile.role_id, 
        "role_name": profile.role.name
    }
    
    set_cache(
        cache_key,
        data,
        expire=300
    )

    return {
        "message":"User profile fetched",
        "data": data
    }

def update_profile(db:Session, payload: UpdateProfile, user_id:int):

    user = db.query(User).filter(
        User.id == user_id
    ).first()

    if not user: 
        raise HTTPException(status_code=404, detail="User not found")

    user.username = payload.username # type: ignore
    user.email = payload.email # type: ignore

    db.commit()
    db.refresh(user)

    delete_cache(f"profile:{user_id}")

    create_activity_log(
        db=db,
        user_id=user_id,
        payload=ActivityLogCreate(
            action="PROFILE_UPDATE",
            entity_type="Profile",
            entity_id=user_id,
            description="User profile updated successfully"
        )
    )

    return {
        "message": "User details updated"
    }