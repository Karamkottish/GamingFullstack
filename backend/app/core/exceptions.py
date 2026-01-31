from typing import Optional, Any
from fastapi import HTTPException, status

class AuthenticationError(HTTPException):
    """Base authentication error"""
    def __init__(self, detail: str = "Authentication failed"):
        super().__init__(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail=detail,
            headers={"WWW-Authenticate": "Bearer"},
        )

class InvalidCredentialsError(AuthenticationError):
    """Invalid email or password"""
    def __init__(self):
        super().__init__(detail="Invalid email or password")

class AccountLockedError(AuthenticationError):
    """Account is locked due to too many failed attempts"""
    def __init__(self, locked_until: Optional[str] = None):
        message = "Account is temporarily locked due to too many failed login attempts"
        if locked_until:
            message += f". Try again after {locked_until}"
        super().__init__(detail=message)

class EmailAlreadyExistsError(HTTPException):
    """Email is already registered"""
    def __init__(self):
        super().__init__(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="An account with this email already exists"
        )

class InvalidTokenError(AuthenticationError):
    """Token is invalid or expired"""
    def __init__(self, detail: str = "Invalid or expired token"):
        super().__init__(detail=detail)

class RateLimitError(HTTPException):
    """Rate limit exceeded"""
    def __init__(self, retry_after: int = 60):
        super().__init__(
            status_code=status.HTTP_429_TOO_MANY_REQUESTS,
            detail=f"Too many requests. Please try again in {retry_after} seconds",
            headers={"Retry-After": str(retry_after)}
        )

class WeakPasswordError(HTTPException):
    """Password doesn't meet security requirements"""
    def __init__(self, detail: str = "Password doesn't meet security requirements"):
        super().__init__(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=detail
        )
