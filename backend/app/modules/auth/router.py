from fastapi import APIRouter, Depends, HTTPException, status, Request
from sqlalchemy.ext.asyncio import AsyncSession
from app.core.database import get_db
from app.modules.auth.schemas import (
    UserCreate,
    UserLogin,
    Token,
    UserAuthResponse,
    RefreshTokenRequest,
    TokenResponse,
    ErrorResponse
)
from app.modules.auth.service import AuthService
from app.core.security import (
    create_access_token,
    create_refresh_token,
    decode_refresh_token
)
from app.core.exceptions import InvalidTokenError
import logging

router = APIRouter()
logger = logging.getLogger(__name__)

@router.post(
    "/register",
    response_model=UserAuthResponse,
    status_code=status.HTTP_201_CREATED,
    responses={
        201: {"description": "User successfully created"},
        400: {"model": ErrorResponse, "description": "Invalid input or email already exists"},
        500: {"model": ErrorResponse, "description": "Internal server error"}
    }
)
async def register(
    user_in: UserCreate,
    request: Request,
    db: AsyncSession = Depends(get_db)
):
    """
    Register a new user account
    
    - **email**: Valid email address (will be normalized to lowercase)
    - **password**: Minimum 8 characters
    - **first_name**: User's first name
    - **last_name**: User's last name
    - **telegram_id**: Optional Telegram ID
    - **role**: User role (defaults to USER)
    
    Returns user info with access and refresh tokens for immediate login.
    """
    try:
        # Create user
        user = await AuthService.create_user(db, user_in)
        
        # Generate tokens
        access_token = create_access_token(subject=user.id)
        refresh_token = create_refresh_token(subject=user.id)
        
        logger.info(f"Successful registration from IP: {request.client.host}")
        
        return {
            "user": user,
            "access_token": access_token,
            "refresh_token": refresh_token,
            "token_type": "bearer"
        }
    except Exception as e:
        logger.error(f"Registration error: {str(e)}")
        raise

@router.post(
    "/login",
    response_model=Token,
    responses={
        200: {"description": "Successfully authenticated"},
        401: {"model": ErrorResponse, "description": "Invalid credentials or account locked"},
        500: {"model": ErrorResponse, "description": "Internal server error"}
    }
)
async def login(
    user_in: UserLogin,
    request: Request,
    db: AsyncSession = Depends(get_db)
):
    """
    Login with email and password
    
    - **email**: Registered email address
    - **password**: User password
    
    Returns access token, refresh token, and user information.
    """
    try:
        # Authenticate user
        user = await AuthService.authenticate_user(db, user_in.email, user_in.password)
        
        # Generate tokens
        access_token = create_access_token(subject=user.id)
        refresh_token = create_refresh_token(subject=user.id)
        
        logger.info(f"Successful login for {user.email} from IP: {request.client.host}")
        
        return {
            "access_token": access_token,
            "refresh_token": refresh_token,
            "token_type": "bearer",
            "user": {
                "id": str(user.id),
                "email": user.email,
                "role": user.role,
                "name": user.full_name,
                "is_active": user.is_active
            }
        }
    except Exception as e:
        logger.error(f"Login error: {str(e)}")
        raise

@router.post(
    "/refresh",
    response_model=TokenResponse,
    responses={
        200: {"description": "Tokens successfully refreshed"},
        401: {"model": ErrorResponse, "description": "Invalid or expired refresh token"},
    }
)
async def refresh_token(
    token_request: RefreshTokenRequest,
    db: AsyncSession = Depends(get_db)
):
    """
    Refresh access token using refresh token
    
    - **refresh_token**: Valid refresh token from login/register
    
    Returns new access token and refresh token (rotation for security).
    """
    try:
        # Verify and decode refresh token
        user_id = decode_refresh_token(token_request.refresh_token)
        if not user_id:
            raise InvalidTokenError("Invalid or expired refresh token")
        
        # Generate new tokens (refresh token rotation)
        new_access_token = create_access_token(subject=user_id)
        new_refresh_token = create_refresh_token(subject=user_id)
        
        logger.info(f"Token refreshed for user: {user_id}")
        
        return {
            "access_token": new_access_token,
            "refresh_token": new_refresh_token,
            "token_type": "bearer"
        }
    except InvalidTokenError:
        raise
    except Exception as e:
        logger.error(f"Token refresh error: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to refresh token"
        )

@router.post(
    "/logout",
    status_code=status.HTTP_204_NO_CONTENT,
    responses={
        204: {"description": "Successfully logged out"},
    }
)
async def logout():
    """
    Logout user
    
    Note: Since we're using stateless JWT, logout is handled client-side
    by deleting the tokens. In a production system with token blacklisting,
    this endpoint would add the token to a blacklist.
    """
    # In production, you would:
    # 1. Add the token to a blacklist (Redis)
    # 2. Invalidate all refresh tokens for the user
    # 3. Log the logout event
    return None
