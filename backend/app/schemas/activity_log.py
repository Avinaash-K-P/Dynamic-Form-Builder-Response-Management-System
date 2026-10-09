from datetime import datetime
from typing import Optional, List

from pydantic import BaseModel


class ActivityLogCreate(BaseModel):

    action: str

    entity_type: str

    entity_id: Optional[int] = None

    description: Optional[str] = None

class ActivityLogResponse(BaseModel):

    id: int

    user_id: Optional[int] = None

    action: str

    entity_type: str

    entity_id: Optional[int] = None

    description: Optional[str] = None

    created_at: datetime

    class Config:
        from_attributes = True    

class ActivityLogListResponse(BaseModel):
    items: List[ActivityLogResponse]
    total: int
    page: int
    limit: int
    total_pages: int        