from pydantic import BaseModel
from typing import Optional, List


# -----------------------------
# Dashboard Analytics
# -----------------------------

class FormResponseSummary(BaseModel):
    form_id: int
    form_title: str
    response_count: int


class DashboardAnalyticsResponse(BaseModel):
    total_forms: int
    active_forms: int
    inactive_forms: int
    total_responses: int
    today_responses: int
    total_users: int
    active_users: int

    responses_by_form: List[FormResponseSummary]


# -----------------------------
# Field Analytics
# -----------------------------

class OptionAnalytics(BaseModel):
    option_label: str
    option_value: str
    response_count: int


class FieldAnalyticsResponse(BaseModel):
    field_id: int
    label: str
    field_type: str
    total_answers: int

    options: Optional[List[OptionAnalytics]] = None


# -----------------------------
# Form-wise Analytics
# -----------------------------

class FormAnalyticsResponse(BaseModel):
    form_id: int
    title: str
    is_active: bool

    total_responses: int
    today_responses: int

    fields: List[FieldAnalyticsResponse]


# -----------------------------
# Response Trend Analytics
# -----------------------------

class ResponseTrendItem(BaseModel):
    date: str
    response_count: int


class ResponseTrendResponse(BaseModel):
    form_id: int
    form_title: str
    trends: List[ResponseTrendItem]