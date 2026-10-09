from pydantic import BaseModel, Field
from typing import Optional, Dict, Any
from datetime import datetime


class FormFieldCreate(BaseModel):
    label: str = Field(..., min_length=1, max_length=255)
    field_type: str = Field(..., min_length=1, max_length=50)
    placeholder: Optional[str] = Field(None, max_length=255)
    description: Optional[str] = None
    is_required: bool = False
    display_order: int = Field(..., ge=1)
    validation_rules: Optional[Dict[str, Any]] = None
    conditional_logic: Optional[Dict[str, Any]] = None


class FormFieldUpdate(BaseModel):
    label: Optional[str] = Field(None, min_length=1, max_length=255)
    field_type: Optional[str] = Field(None, min_length=1, max_length=50)
    placeholder: Optional[str] = Field(None, max_length=255)
    description: Optional[str] = None
    is_required: Optional[bool] = None
    display_order: Optional[int] = Field(None, ge=1)
    validation_rules: Optional[Dict[str, Any]] = None
    conditional_logic: Optional[Dict[str, Any]] = None


class FormFieldResponse(BaseModel):
    id: int
    form_id: int
    label: str
    field_type: str
    placeholder: Optional[str] = None
    description: Optional[str] = None
    is_required: bool
    display_order: int
    validation_rules: Optional[Dict[str, Any]] = None
    conditional_logic: Optional[Dict[str, Any]] = None
    created_at: datetime
    updated_at: datetime | None

    class Config:
        from_attributes = True