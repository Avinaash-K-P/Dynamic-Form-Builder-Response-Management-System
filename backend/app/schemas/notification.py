from datetime import datetime
from typing import Optional, List

from pydantic import BaseModel

class NotificationResponse(BaseModel):
    id: int
    user_id: int
    title: str
    message: str
    notification_type: str
    is_read: bool
    created_at: datetime
    read_at: Optional[datetime] = None

    class Config:
        from_attributes = True    

class NotificationListResponse(BaseModel):
    items: List[NotificationResponse]
    total: int
    page: int
    limit: int
    total_pages: int