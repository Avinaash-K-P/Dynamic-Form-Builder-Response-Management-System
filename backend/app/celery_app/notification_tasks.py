from app.celery_app.celery import celery_app
from app.db.database import SessionLocal
from app.services.notification_service import create_notification


@celery_app.task(name="create_notification_task")
def create_notification_task(
    user_id: int,
    title: str,
    message: str,
    notification_type: str
):
    db = SessionLocal()

    try:
        notification = create_notification(
            db=db,
            user_id=user_id,
            title=title,
            message=message,
            notification_type=notification_type
        )

        return {
            "notification_id": notification.id,
            "status": "created"
        }

    finally:
        db.close()