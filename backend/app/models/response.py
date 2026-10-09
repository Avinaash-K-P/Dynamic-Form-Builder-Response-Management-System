from sqlalchemy import Column, Integer, String, DateTime, ForeignKey, JSON
from sqlalchemy.orm import relationship
from datetime import datetime

from app.db.database import Base


class FormResponse(Base):
    __tablename__ = "form_responses"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)

    form_id = Column(
        Integer,
        ForeignKey("forms.id"),
        nullable=False
    )

    submitted_by = Column(
        Integer,
        ForeignKey("users.id"),
        nullable=False
    )

    status = Column(
        String(50),
        nullable=False,
        default="submitted"
    )

    submitted_at = Column(
        DateTime,
        default=datetime.utcnow,
        nullable=False
    )

    user = relationship("User", back_populates="form_response")

    form = relationship("Form", back_populates="form_response")

    response_detail = relationship("ResponseDetail", back_populates="form_response")


class ResponseDetail(Base):
    __tablename__ = "response_details"

    id = Column(
        Integer,
        primary_key=True,
        index=True,
        autoincrement=True
    )

    response_id = Column(
        Integer,
        ForeignKey("form_responses.id"),
        nullable=False
    )

    field_id = Column(
        Integer,
        ForeignKey("form_fields.id"),
        nullable=False
    )

    response_value = Column(
        JSON,
        nullable=True
    )

    created_at = Column(
        DateTime,
        default=datetime.utcnow,
        nullable=False
    )

    updated_at = Column(
        DateTime,
        default=datetime.utcnow,
        onupdate=datetime.utcnow,
        nullable=False
    )

    form_response = relationship("FormResponse", back_populates="response_detail")

    form_field = relationship("FormField", back_populates="response_detail")