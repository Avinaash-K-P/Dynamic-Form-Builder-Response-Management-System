from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.db.database import get_db
from app.core.security import verify_role
from app.schemas.analytic import DashboardAnalyticsResponse, FormAnalyticsResponse
from app.services.analytic_service import get_dashboard_analytics, get_form_analytics

router = APIRouter(prefix="/analytics", tags=["Dashboard Analytics"])

@router.get("/dashboard", response_model=DashboardAnalyticsResponse)
def dashboard_summary(
    db:Session = Depends(get_db),
    current_user = Depends(verify_role("user"))
):
    return get_dashboard_analytics(db=db)

@router.get("/form-wise/{form_id}", response_model=FormAnalyticsResponse)
def form_wise_summary(
    form_id:int,
    db:Session = Depends(get_db),
    current_user = Depends(verify_role("user"))
):
    return get_form_analytics(db=db, form_id=form_id)