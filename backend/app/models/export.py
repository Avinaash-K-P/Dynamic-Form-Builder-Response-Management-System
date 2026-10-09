from app.db.database import Base
from sqlalchemy import Column, Integer, String, ForeignKey, DateTime
from sqlalchemy.orm import relationship
from datetime import datetime

class Export(Base):

    __tablename__ = "exports"

    id = Column(Integer, primary_key=True, index=True)

    form_id = Column(Integer, ForeignKey("forms.id"), nullable=False)

    requested_by = Column(Integer, ForeignKey("users.id"), nullable=False)

    export_type = Column(String(10), nullable=False)

    status = Column(String(20), default="pending", nullable=False)

    file_path = Column(String(255), nullable=True)

    created_at = Column(DateTime, default=datetime.utcnow, nullable=False) 

    completed_at = Column(DateTime, nullable=True)

    form = relationship("Form", back_populates="export")
    
    user = relationship("User")