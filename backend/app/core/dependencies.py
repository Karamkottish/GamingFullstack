from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from sqlalchemy.orm import selectinload
from typing import Optional
from app.core.database import get_db
from app.core.security import decode_token
from app.modules.auth.models import User
from app.core.exceptions import InvalidTokenError
import logging

logger = logging.getLogger(__name__)

security = HTTPBearer(
    scheme_name="JWT Bearer Token",
    description="Enter your JWT access token"
)

async def get_current_user(
    credentials: HTTPAuthorizationCredentials = Depends(security),
    db: AsyncSession = Depends(get_db)
) -> User:
    """
    Validate JWT token and return current authenticated user
    
    Raises:
        HTTPException: If token is invalid, expired, or user not found
    """
    token = credentials.credentials
    
    # Decode and verify token
    user_id = decode_token(token)
    if not user_id:
        logger.warning("Invalid or expired token attempt")
        raise InvalidTokenError("Invalid or expired access token")
    
    # Fetch user with eager loading for performance
    result = await db.execute(
        select(User)
        .options(selectinload(User.wallet))  # Eager load wallet
        .where(User.id == user_id)
    )
    user = result.scalars().first()
    
    if not user:
        logger.warning(f"Token valid but user not found: {user_id}")
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found"
        )
    
    if not user.is_active:
        logger.warning(f"Inactive user attempted access: {user.email}")
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="User account is inactive"
        )
    
    return user

async def get_current_active_user(
    current_user: User = Depends(get_current_user)
) -> User:
    """Get current user and ensure account is active"""
    return current_user

# Optional: Role-based dependencies for specific endpoints
async def get_current_agent(
    current_user: User = Depends(get_current_user)
) -> User:
    """Ensure current user has AGENT role"""
    from app.modules.auth.models import UserRole
    if current_user.role not in [UserRole.AGENT, UserRole.ADMIN]:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Agent access required"
        )
    return current_user

async def get_current_affiliate(
    current_user: User = Depends(get_current_user)
) -> User:
    """Ensure current user has AFFILIATE role"""
    from app.modules.auth.models import UserRole
    if current_user.role not in [UserRole.AFFILIATE, UserRole.ADMIN]:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Affiliate access required"
        )
    return current_user
