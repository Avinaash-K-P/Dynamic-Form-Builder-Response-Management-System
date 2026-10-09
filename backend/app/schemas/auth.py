from pydantic import BaseModel, EmailStr 

class UserRegister(BaseModel):
    username:str
    email:EmailStr
    password:str
    role_id:int 

class UserLogin(BaseModel):
    email:EmailStr
    password:str 

class RefreshToken(BaseModel):
    refresh_token:str

class ForgotPassword(BaseModel):
    email:EmailStr 

class ResetPassword(BaseModel):
    reset_token:str 
    new_password:str
    retype_password:str  