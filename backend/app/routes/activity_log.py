from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.db.database import get_db
from app.core.security import verify_role
from app.schemas.activity_log import ActivityLogListResponse
from app.services.activity_log_service import get_activity_logs

router = APIRouter(tags=["Activity Logs"])

@router.get("/activity-logs", response_model=ActivityLogListResponse)
def list_activity_logs(
    db:Session=Depends(get_db),
    current_user = Depends(verify_role("admin"))
):
    return get_activity_logs(
        db=db,
    )

