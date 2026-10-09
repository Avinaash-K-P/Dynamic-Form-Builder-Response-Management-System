from pydantic import BaseModel, EmailStr
from typing import Optional

class UpdateProfile(BaseModel):
    username:Optional[str] = None
    email:Optional[EmailStr] = None