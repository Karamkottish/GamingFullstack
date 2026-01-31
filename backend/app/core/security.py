from datetime import datetime, timedelta
from typing import Any, Union, Optional
from jose import jwt, JWTError
from passlib.context import CryptContext
from app.core.config import get_settings
import hashlib
import uuid

settings = get_settings()

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

def verify_password(plain_password: str, hashed_password: str) -> bool:
    """Verify a password against its hash"""
    # Pre-hash with SHA256 to handle any length password
    prehashed = hashlib.sha256(plain_password.encode()).hexdigest()
    return pwd_context.verify(prehashed, hashed_password)

def get_password_hash(password: str) -> str:
    """Hash a password using SHA256 + Bcrypt"""
    # Pre-hash with SHA256 to get fixed-length output, then bcrypt that
    # This avoids bcrypt's 72-byte limit while maintaining security
    prehashed = hashlib.sha256(password.encode()).hexdigest()
    return pwd_context.hash(prehashed)

def create_access_token(subject: Union[str, Any], expires_delta: Optional[timedelta] = None) -> str:
    """Create a new access token"""
    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    
    to_encode = {
        "exp": expire,
        "iat": datetime.utcnow(),
        "sub": str(subject),
        "type": "access",
        "jti": str(uuid.uuid4())  # Unique token ID
    }
    encoded_jwt = jwt.encode(to_encode, settings.SECRET_KEY, algorithm=settings.ALGORITHM)
    return encoded_jwt

def create_refresh_token(subject: Union[str, Any], expires_delta: Optional[timedelta] = None) -> str:
    """Create a new refresh token"""
    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(days=settings.REFRESH_TOKEN_EXPIRE_DAYS)
    
    to_encode = {
        "exp": expire,
        "iat": datetime.utcnow(),
        "sub": str(subject),
        "type": "refresh",
        "jti": str(uuid.uuid4())  # Unique token ID
    }
    encoded_jwt = jwt.encode(to_encode, settings.SECRET_KEY, algorithm=settings.ALGORITHM)
    return encoded_jwt

def verify_token(token: str, token_type: str = "access") -> Optional[dict]:
    """
    Verify and decode a JWT token
    Returns the payload if valid, None otherwise
    """
    try:
        payload = jwt.decode(token, settings.SECRET_KEY, algorithms=[settings.ALGORITHM])
        
        # Verify token type
        if payload.get("type") != token_type:
            return None
        
        # Verify expiration
        exp = payload.get("exp")
        if exp and datetime.fromtimestamp(exp) < datetime.utcnow():
            return None
        
        return payload
    except JWTError:
        return None

def decode_token(token: str) -> Optional[str]:
    """Decode token and return the subject (user_id)"""
    payload = verify_token(token, "access")
    if payload:
        return payload.get("sub")
    return None

def decode_refresh_token(token: str) -> Optional[str]:
    """Decode refresh token and return the subject (user_id)"""
    payload = verify_token(token, "refresh")
    if payload:
        return payload.get("sub")
    return None
