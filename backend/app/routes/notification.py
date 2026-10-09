from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.db.database import get_db
from app.core.security import verify_role
from app.schemas.notification import NotificationResponse, NotificationListResponse
from app.services.notification_service import (
    get_notification,
    get_notifications,
    mark_notification_as_read
)

router = APIRouter(tags=["Notification"])

@router.get("/notification/", response_model=NotificationListResponse)
def list_notification(
    page: int = 1,
    limit: int = 10,
    db:Session = Depends(get_db),
    current_user = Depends(verify_role("user"))
):
    return get_notifications(
        db=db, 
        user_id=current_user.id, 
        page=page, 
        limit=limit
    ) 

@router.get("/notification/{id}", response_model=NotificationResponse)
def view_notification(
    id:int,
    db:Session = Depends(get_db),
    current_user = Depends(verify_role("user"))
):
    return get_notification(db=db, notification_id=id ,user_id=current_user.id) 

@router.get("/notification-mark/{id}", response_model=NotificationResponse)
def view_notification_mark(
    id:int,
    db:Session = Depends(get_db),
    current_user = Depends(verify_role("user"))
):
    return mark_notification_as_read(db=db, notification_id=id ,user_id=current_user.id) 
