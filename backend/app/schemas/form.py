from datetime import datetime
from typing import Optional

from pydantic import BaseModel, Field


class FormCreate(BaseModel):
    title: str = Field(..., min_length=1, max_length=255)
    description: Optional[str] = None


class FormUpdate(BaseModel):
    title: Optional[str] = Field(None, min_length=1, max_length=255)
    description: Optional[str] = None

class FormStatusUpdate(BaseModel):
    is_active:bool

class FormResponse(BaseModel):
    id: int
    title: str
    description: Optional[str] = None
    created_by: int
    is_active:bool
    created_at: datetime
    updated_at: datetime| None

    class Config:
        from_attributes = True