from fastapi import HTTPException
from sqlalchemy.orm import Session 
from app.models.user import User
from app.models.role import Role
from app.schemas.auth import (
    UserLogin,
    UserRegister,
    RefreshToken,
    ForgotPassword,
    ResetPassword
)
from app.core.security import (
    hash_password, 
    verify_password,
    create_access_token,
    create_refresh_token,
    verify_refresh_token
)
import secrets
from datetime import datetime, timedelta
from app.core.config import settings
from app.schemas.activity_log import ActivityLogCreate
from app.services.activity_log_service import create_activity_log


def create_account(db:Session, payload:UserRegister):

    account_exist = db.query(User).filter(
        User.username == payload.username,
        User.email == payload.email
    ).first()

    if account_exist:
        raise HTTPException(status_code=409, detail="Account already exist") 

    role_id_exist = db.query(Role).filter(
        Role.id == payload.role_id
    ).first()

    if not role_id_exist:
        raise HTTPException(status_code=404, detail="Role id not found")

    new_account = User(
        username = payload.username,
        email = payload.email,
        password = hash_password(payload.password),
        role_id = payload.role_id 
    )

    db.add(new_account)
    db.commit()
    db.refresh(new_account) 

    return {"message": "User registered successfully"}

def verify_user(db:Session, payload: UserLogin):

    valid_user = db.query(User).filter(
        User.email == payload.email
    ).first()

    if not valid_user: 
        raise HTTPException(status_code=401, detail="Invalid email")

    pwd = payload.password
    hashed_pwd = valid_user.password

    valid_password = verify_password(pwd, hashed_pwd)

    if not valid_password:
        raise HTTPException(status_code=401, detail="Invalid password")

    jwt_payload = {
        "id": valid_user.id,
        "username": valid_user.username,
        "sub": valid_user.email,
        "role_id": valid_user.role_id
    }     

    access_token = create_access_token(jwt_payload)

    refresh_token = create_refresh_token(jwt_payload)

    create_activity_log(
        db=db,
        user_id=valid_user.id, # type: ignore
        payload=ActivityLogCreate(
            action="AUTH_LOGIN",
            entity_type="Authentication",
            entity_id=valid_user.id,# type: ignore
            description=f"User '{valid_user.username}' logged in successfully"
        )
    )
    
    return {
        "message":"User login successful!",
        "access_token": access_token,
        "refresh_token": refresh_token,
        "token_type": "bearer"
    }

def get_refresh_token(db:Session, payload:RefreshToken):

    token_payload = verify_refresh_token(payload.refresh_token)

    if token_payload is None:
        raise HTTPException(status_code=401, detail="Invalid or expired token")

    jwt_payload = {
        "id": token_payload.get("id"),
        "username": token_payload.get("username"),
        "sub": token_payload.get("email"),
        "role_id": token_payload.get("role_id")
    }     

    access_token = create_access_token(jwt_payload)

    return {
        "message": "Access token generated",
        "access_token": access_token
    }

def get_forgot_password(db:Session, payload:ForgotPassword):

    user = db.query(User).filter(
        User.email == payload.email
    ).first()

    if not user:
        raise HTTPException(status_code=404, detail="Email not found")

    reset_token = secrets.token_urlsafe(32) 

    reset_token_minute = settings.RESET_TOKEN_EXPIRY_MINUTES

    user.reset_token = reset_token # type: ignore
    user.reset_token_expiry = datetime.utcnow() + timedelta(minutes=reset_token_minute) # type: ignore

    db.commit()
    db.refresh(user)

    return {
        "message": "Reset token generated"
    }

def get_reset_password(db:Session, payload:ResetPassword):

    user = db.query(User).filter(
        User.reset_token == payload.reset_token
    ).first() 

    if not user:
        raise HTTPException(status_code=401, detail="Invalid token")

    if datetime.utcnow() > user.reset_token_expiry: #type:ignore
        raise HTTPException(status_code=401, detail="Reset token expired")

    if payload.new_password != payload.retype_password:
        raise HTTPException(status_code=401, detail="Password not match")      

    user.password = hash_password(payload.new_password)
    user.reset_token = None # type: ignore
    user.reset_token_expiry = None # type: ignore

    db.commit()
    db.refresh(user)

    return {
        "message": "Password reset successful"
    }