from app.db.database import Base
from sqlalchemy import Column, Integer, String, Boolean, DateTime, ForeignKey
from sqlalchemy.orm import relationship

class User(Base):

    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)

    role_id = Column(Integer, ForeignKey("roles.id"), nullable=False)

    username = Column(String(100), nullable=False)

    email = Column(String(100), nullable=False)

    password = Column(String(100), nullable=False)

    is_active = Column(Boolean, default=True, nullable=False) 

    reset_token = Column(String(100), nullable=True)

    reset_token_expiry = Column(DateTime, nullable=True)

    role = relationship("Role", back_populates="user")

    form  = relationship("Form", back_populates="user")

    form_response = relationship("FormResponse", back_populates="user")

    notifications = relationship("Notification", back_populates="user")
