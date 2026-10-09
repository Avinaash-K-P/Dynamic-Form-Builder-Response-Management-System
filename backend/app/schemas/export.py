from datetime import datetime
from typing import Optional

from pydantic import BaseModel, Field


class ExportCreate(BaseModel):
    form_id: int = Field(..., gt=0)
    export_type: str = Field(..., min_length=1, max_length=20)


class ExportResponse(BaseModel):
    id: int
    form_id: int
    requested_by: int
    export_type: str
    status: str
    file_path: Optional[str] = None
    created_at: datetime
    completed_at: Optional[datetime] = None

    class Config:
        from_attributes = True


class ExportStatusResponse(BaseModel):
    id: int
    status: str
    file_path: Optional[str] = None
    completed_at: Optional[datetime] = None

    class Config:
        from_attributes = True