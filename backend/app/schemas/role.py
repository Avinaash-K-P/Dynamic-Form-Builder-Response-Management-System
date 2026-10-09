from pydantic import BaseModel
from typing import Optional

class CreateRole(BaseModel):
    name:str
    description:str

class UpdateRole(BaseModel):
    name:Optional[str] = None
    description:Optional[str] = None