from pydantic import BaseModel
from typing import Optional
from datetime import datetime


class FormResponseCreate(BaseModel):
    form_id: int


class FormResponseUpdate(BaseModel):
    status: Optional[str] = None


class FormResponseStatusUpdate(BaseModel):
    status: str


class FormResponseResponse(BaseModel):
    id: int
    form_id: int
    submitted_by: int
    status: str
    submitted_at: datetime

    class Config:
        from_attributes = True