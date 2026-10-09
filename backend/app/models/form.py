from app.db.database import Base 
from sqlalchemy import Column, Integer, String, Text, DateTime, ForeignKey, Boolean, JSON 
from sqlalchemy.orm import relationship
from datetime import datetime

class Form(Base): 

    __tablename__ = "forms"

    id = Column(Integer, primary_key=True, index=True)

    title = Column(String(50), nullable=False)

    description = Column(Text, nullable=False)

    created_by = Column(Integer, ForeignKey("users.id"), nullable=False)

    is_active = Column(Boolean, default=True, nullable=False)

    created_at = Column(DateTime, default=datetime.utcnow, nullable=False) 

    updated_at = Column(DateTime, nullable=True)

    user = relationship("User", back_populates="form")

    form_field = relationship("FormField", back_populates="form")

    form_response = relationship("FormResponse", back_populates="form")

    export = relationship("Export", back_populates="form")

class FormField(Base):

    __tablename__ = "form_fields"

    id = Column(Integer, primary_key=True, index=True)

    form_id = Column(Integer, ForeignKey("forms.id"), nullable=False)

    label = Column(String(255), nullable=False)

    field_type = Column(String(50), nullable=False)

    placeholder = Column(String(255), nullable=False)

    description = Column(Text, nullable=False)

    is_required = Column(Boolean, default=False, nullable=False)

    display_order = Column(Integer, nullable=False)

    validation_rules = Column(JSON, nullable=True)

    conditional_logic = Column(JSON, nullable= True)

    created_at = Column(DateTime, default=datetime.utcnow, nullable=False) 

    updated_at = Column(DateTime, nullable=True)

    form = relationship("Form", back_populates="form_field")

    options = relationship(
    "FieldOption",
    back_populates="field",
    cascade="all, delete-orphan"
    )

    response_detail = relationship("ResponseDetail", back_populates="form_field")

class FieldOption(Base):

    __tablename__ = "field_options"

    id = Column(Integer, primary_key=True, index=True)

    field_id = Column(Integer, ForeignKey("form_fields.id"), nullable=False)

    label = Column(String(255), nullable=False)

    value = Column(String(255), nullable=False)

    display_order = Column(Integer, nullable=False)

    is_active = Column(Boolean, default=True, nullable=False)

    created_at = Column(DateTime, default=datetime.utcnow, nullable=False) 

    updated_at = Column(DateTime, nullable=True)

    field = relationship(
        "FormField",
        back_populates="options"
    )
    
    