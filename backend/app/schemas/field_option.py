from pydantic import BaseModel, Field
from typing import Optional
from datetime import datetime


class FieldOptionCreate(BaseModel):
    label: str = Field(..., min_length=1, max_length=255)
    value: str = Field(..., min_length=1, max_length=255)
    display_order: int = Field(..., ge=1)


class FieldOptionUpdate(BaseModel):
    label: Optional[str] = Field(None, min_length=1, max_length=255)
    value: Optional[str] = Field(None, min_length=1, max_length=255)
    display_order: Optional[int] = Field(None, ge=1)


class FieldOptionStatusUpdate(BaseModel):
    is_active: bool


class FieldOptionResponse(BaseModel):
    id: int
    field_id: int
    label: str
    value: str
    display_order: int
    is_active: bool
    created_at: datetime
    updated_at: datetime | None

    class Config:
        from_attributes = True