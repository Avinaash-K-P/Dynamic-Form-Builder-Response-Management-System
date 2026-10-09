from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.db.database import get_db
from app.schemas.auth import (
    UserLogin,
    UserRegister,
    RefreshToken,
    ForgotPassword,
    ResetPassword
)
from app.services.auth_service import (
    create_account,
    verify_user,
    get_refresh_token,
    get_forgot_password,
    get_reset_password
)

router = APIRouter(prefix="/auth", tags=["Authentication"])

@router.post("/register")
def user_register(
    payload:UserRegister,
    db:Session=Depends(get_db)
):
    return create_account(db=db, payload=payload)

@router.post("/login")
def user_login(
    payload:UserLogin,
    db:Session=Depends(get_db)
):
    return verify_user(db=db, payload=payload)

@router.post("/refresh-token")
def refresh_token(
    payload:RefreshToken,
    db:Session=Depends(get_db)
):
    return get_refresh_token(db=db, payload=payload)

@router.post("/forgot-password")
def forgot_password(
    payload:ForgotPassword,
    db:Session=Depends(get_db)
):
    return get_forgot_password(db=db, payload=payload)

@router.post("/reset-password")
def reset_password(
    payload:ResetPassword,
    db:Session=Depends(get_db)
):
    return get_reset_password(db=db, payload=payload)