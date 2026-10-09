from datetime import datetime

from app.db.database import Base
from sqlalchemy import Column, Integer, String, Text, ForeignKey, DateTime
from sqlalchemy.orm import relationship


class ActivityLog(Base):

    __tablename__ = "activity_logs"

    id = Column(
        Integer,
        primary_key=True,
        index=True,
        autoincrement=True
    )

    user_id = Column(
        Integer,
        ForeignKey("users.id"),
        nullable=True
    )

    action = Column(
        String(100),
        nullable=False
    )

    entity_type = Column(
        String(100),
        nullable=False
    )

    entity_id = Column(
        Integer,
        nullable=True
    )

    description = Column(
        Text,
        nullable=True
    )

    created_at = Column(
        DateTime,
        default=datetime.utcnow,
        nullable=False
    )

    user = relationship("User")