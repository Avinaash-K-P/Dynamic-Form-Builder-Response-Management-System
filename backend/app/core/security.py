from jose import jwt,JWTError
from passlib.context import CryptContext
from fastapi import HTTPException, Depends
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from datetime import datetime, timedelta
from app.core.config import settings
from app.db.database import get_db
from sqlalchemy.orm import Session
from app.models.user import User

# PASSWORD

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

def hash_password(pwd):
    return pwd_context.hash(pwd)

def verify_password(plain_pwd, hashed_pwd):
    return pwd_context.verify(plain_pwd, hashed_pwd)

# JWT 

def create_access_token(payload:dict):

    to_encode = payload.copy()

    expiry = datetime.utcnow() + timedelta(minutes=settings.ACCESS_TOKEN_EXPIRY_MINUTES)

    to_encode.update(
        {
            "exp": expiry,
            "type": "access"
        }
    )

    token = jwt.encode(
        to_encode, 
        settings.SECRET_KEY, 
        algorithm=settings.ALGORITHM
    )

    return token

def verify_access_token(token:str):

    try:
        payload = jwt.decode(
            token, 
            settings.SECRET_KEY,
            algorithms=[settings.ALGORITHM]    
        )

        if payload.get("type") == "access":
            return payload
    except JWTError:
        return None 

def create_refresh_token(payload:dict):

    to_encode = payload.copy()

    expiry = datetime.utcnow() + timedelta(minutes=settings.REFRESH_TOKEN_EXPIRY_DAYS)

    to_encode.update(
        {
            "exp": expiry,
            "type": "refresh"
        }
    )

    token = jwt.encode(
        to_encode, 
        settings.SECRET_KEY, 
        algorithm=settings.ALGORITHM
    )

    return token

def verify_refresh_token(token:str):

    try:
        payload = jwt.decode(
            token, 
            settings.SECRET_KEY,
            algorithms=[settings.ALGORITHM]    
        )

        if payload.get("type") == "refresh":
            return payload
    except JWTError:
        return None 

# AUTHORIZATION

security = HTTPBearer()

def get_current_user(
    db:Session = Depends(get_db),
    credential: HTTPAuthorizationCredentials = Depends(security)
):

    token = credential.credentials

    payload = verify_access_token(token)

    if payload is None:
        raise HTTPException(status_code=401, detail="Invalid and expired token")

    email = payload.get("sub") 

    user = db.query(User).filter(
        User.email == email
    ).first() 

    if not user:
        raise HTTPException(status_code=401, detail="Not authenticated")

    return user 


def verify_role(required_role:str):

    PERMISSIONS = {
        "admin": ["admin"],
        "user": ["admin","user"]
    }

    allowed_roles = PERMISSIONS.get(required_role)

    def role_checker(current_user:User = Depends(get_current_user)):

        if not allowed_roles:
            raise HTTPException(status_code=403, detail="Invalid permission")

        if current_user.role.name.lower() not in allowed_roles:
            raise HTTPException(status_code=403, detail="Access denied")

        return current_user 

    return role_checker