from pydantic import BaseModel, EmailStr
from uuid import UUID
from typing import Optional
from app.modules.auth.models import UserRole

class UserBase(BaseModel):
    email: EmailStr
    full_name: Optional[str] = None

class UserCreate(UserBase):
    password: str
    role: UserRole = UserRole.USER
    invite_code: Optional[str] = None

class UserLogin(BaseModel):
    email: EmailStr
    password: str

class Token(BaseModel):
    access_token: str
    token_type: str
    user: dict  # Simplified user object

class UserResponse(UserBase):
    id: UUID
    role: UserRole
    is_active: bool

    class Config:
        from_attributes = True
