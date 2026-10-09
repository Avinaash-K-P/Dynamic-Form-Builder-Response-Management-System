from pydantic import BaseModel
from typing import Optional, List, Any
from datetime import datetime


class ResponseDetailCreate(BaseModel):
    response_id: int
    field_id: int
    response_value: Optional[Any] = None


class ResponseDetailUpdate(BaseModel):
    response_value: Optional[Any] = None


class ResponseDetailResponse(BaseModel):
    id: int
    response_id: int
    field_id: int
    response_value: Optional[Any] = None
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True
        
        from typing import List


class ResponseDetailListResponse(BaseModel):
    items: List[ResponseDetailResponse]
    total: int
    page: int
    limit: int
    total_pages: int