from pydantic import BaseModel, EmailStr
from uuid import UUID
from typing import Optional
from app.modules.auth.models import UserRole

class UserBase(BaseModel):
    email: EmailStr
    first_name: str
    last_name: str
    telegram_id: Optional[str] = None

class UserCreate(UserBase):
    password: str
    role: UserRole = UserRole.USER
    invite_code: Optional[str] = None

class UserLogin(BaseModel):
    email: EmailStr
    password: str

class Token(BaseModel):
    access_token: str
    refresh_token: str
    token_type: str
    user: dict

class UserResponse(UserBase):
    id: UUID
    role: UserRole
    is_active: bool
    full_name: Optional[str] = None

    class Config:
        from_attributes = True

class UserAuthResponse(BaseModel):
    user: UserResponse
    access_token: str
    refresh_token: str
    token_type: str = "bearer"
