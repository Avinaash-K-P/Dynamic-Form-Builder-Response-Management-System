from sqlalchemy.orm import Session

from app.models.activity_log import ActivityLog
from app.schemas.activity_log import ActivityLogCreate
from app.utils.pagination import paginate

def create_activity_log(
    db: Session,
    payload: ActivityLogCreate,
    user_id: int
):
    activity_log = ActivityLog(
        user_id=user_id,
        action=payload.action,
        entity_type=payload.entity_type,
        entity_id=payload.entity_id,
        description=payload.description
    )

    db.add(activity_log)
    db.commit()
    db.refresh(activity_log)

    return activity_log


def get_activity_logs(
    db: Session,
    page: int = 1,
    limit: int = 10
):
    query = db.query(ActivityLog).order_by(
        ActivityLog.created_at.desc()
    )

    return paginate(
        query=query,
        page=page,
        limit=limit
    )