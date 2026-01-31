from pydantic import BaseModel, EmailStr, Field, field_validator
from uuid import UUID
from typing import Optional
from app.modules.auth.models import UserRole
import re

class UserBase(BaseModel):
    email: EmailStr
    first_name: str = Field(..., min_length=1, max_length=50)
    last_name: str = Field(..., min_length=1, max_length=50)
    telegram_id: Optional[str] = Field(None, max_length=100)

class UserCreate(UserBase):
    password: str = Field(..., min_length=8, max_length=128)
    role: UserRole = UserRole.USER
    invite_code: Optional[str] = Field(None, max_length=50)
    
    @field_validator('password')
    @classmethod
    def validate_password_strength(cls, v: str) -> str:
        """Validate password meets minimum security requirements"""
        if len(v) < 8:
            raise ValueError('Password must be at least 8 characters long')
        
        # Optional: enforce stronger requirements
        # if not re.search(r'[A-Z]', v):
        #     raise ValueError('Password must contain at least one uppercase letter')
        # if not re.search(r'[a-z]', v):
        #     raise ValueError('Password must contain at least one lowercase letter')
        # if not re.search(r'[0-9]', v):
        #     raise ValueError('Password must contain at least one number')
        
        return v
    
    @field_validator('email')
    @classmethod
    def validate_email_format(cls, v: str) -> str:
        """Additional email validation"""
        return v.lower().strip()

class UserLogin(BaseModel):
    email: EmailStr
    password: str = Field(..., max_length=128)
    
    @field_validator('email')
    @classmethod
    def validate_email_format(cls, v: str) -> str:
        """Normalize email"""
        return v.lower().strip()

class Token(BaseModel):
    access_token: str
    refresh_token: str
    token_type: str = "bearer"
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

class ErrorResponse(BaseModel):
    """Standardized error response"""
    success: bool = False
    error: str
    message: str
    details: Optional[dict] = None

class RefreshTokenRequest(BaseModel):
    """Request to refresh access token"""
    refresh_token: str

class TokenResponse(BaseModel):
    """Response with new tokens"""
    access_token: str
    refresh_token: str
    token_type: str = "bearer"
