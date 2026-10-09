from fastapi import HTTPException
from sqlalchemy.orm import Session
from datetime import datetime
from app.models.notification import Notification
from app.utils.pagination import paginate

def create_notification(
    db: Session,
    user_id: int,
    title: str,
    message: str,
    notification_type: str
):
    notification = Notification(
        user_id=user_id,
        title=title,
        message=message,
        
        notification_type=notification_type,
        is_read=False
    )

    db.add(notification)
    db.commit()
    db.refresh(notification)

    return notification


def get_notifications(
    db: Session,
    user_id: int,
    page: int = 1,
    limit: int = 10
):
    query = db.query(Notification).filter(
        Notification.user_id == user_id
    ).order_by(
        Notification.created_at.desc()
    )

    return paginate(
        query=query,
        page=page,
        limit=limit
    )


def get_notification(
    db: Session,
    notification_id: int,
    user_id: int
):
    notification = db.query(Notification).filter(
        Notification.id == notification_id,
        Notification.user_id == user_id
    ).first()

    if not notification:
        raise HTTPException(
            status_code=404,
            detail="Notification not found"
        )

    return notification

def mark_notification_as_read(
    db: Session,
    notification_id: int,
    user_id: int
):
    notification = db.query(Notification).filter(
        Notification.id == notification_id,
        Notification.user_id == user_id
    ).first()

    if not notification:
        raise HTTPException(
            status_code=404,
            detail="Notification not found"
        )

    if not notification.is_read: # type: ignore
        notification.is_read = True # type: ignore
        notification.read_at = datetime.utcnow() # type: ignore

        db.commit()
        db.refresh(notification)

    return notification