from app.db.database import Base
from sqlalchemy import Boolean, Column, DateTime, String, Integer, Text
from sqlalchemy.orm import relationship
from datetime import datetime

class Role(Base):

    __tablename__ = "roles"

    id = Column(Integer, primary_key=True, index=True)

    name = Column(String(50), nullable=False)

    description = Column(Text, nullable=False)

    is_active = Column(Boolean, default=True, nullable=False) 

    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)

    updated_at = Column(DateTime, nullable=True)

    user = relationship("User", back_populates="role")