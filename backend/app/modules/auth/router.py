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
    ErrorResponse,
    UpdateProfileRequest,
    UserProfileResponse,
    ChangePasswordRequest
)
from app.modules.auth import schemas
from app.modules.auth.models import User
from app.modules.auth.service import AuthService
from app.core.security import (
    create_access_token,
    create_refresh_token,
    decode_refresh_token
)
from app.core import dependencies
from app.core.exceptions import InvalidTokenError
import logging

router = APIRouter()
logger = logging.getLogger(__name__)

@router.post(
    "/change-password",
    status_code=status.HTTP_200_OK,
    responses={
        200: {"description": "Password changed successfully"},
        400: {"model": ErrorResponse, "description": "Invalid current password or new password strength parameters"},
        401: {"model": ErrorResponse, "description": "Invalid or expired token"},
    }
)
async def change_password(
    password_data: ChangePasswordRequest,
    current_user: User = Depends(dependencies.get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """
    Change account password
    
    Requires current password for verification.
    New password must meet minimum security requirements.
    """
    try:
        await AuthService.change_password(
            db, 
            current_user.id, 
            password_data.current_password, 
            password_data.new_password
        )
        return {"message": "Password changed successfully"}
        
    except InvalidCredentialsError:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Incorrect current password"
        )
    except Exception as e:
        logger.error(f"Password change error: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to change password"
        )

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

@router.get(
    "/profile",
    response_model=schemas.UserProfileResponse,
    responses={
        200: {
            "description": "User profile retrieved successfully",
            "content": {
                "application/json": {
                    "example": {
                        "id": "123e4567-e89b-12d3-a456-426614174000",
                        "email": "user@example.com",
                        "first_name": "John",
                        "last_name": "Doe",
                        "full_name": "John Doe",
                        "telegram_id": "@johndoe",
                        "role": "USER",
                        "is_active": True,
                        "created_at": "2024-01-31T12:00:00",
                        "wallet": {
                            "id": "123e4567-e89b-12d3-a456-426614174001",
                            "balance": "1000.00",
                            "currency": "USD",
                            "is_frozen": False
                        }
                    }
                }
            }
        },
        401: {"model": schemas.ErrorResponse, "description": "Invalid or expired token"},
        403: {"model": schemas.ErrorResponse, "description": "Account is inactive"},
    },
    summary="Get Current User Profile",
    description="""
    Retrieve the authenticated user's profile information including wallet details.
    
    **Works for all roles**: USER, AGENT, AFFILIATE, ADMIN
    
    **Performance**: Uses optimized eager loading for wallet data to minimize database queries.
    
    **Authentication Required**: Yes - Pass JWT access token in Authorization header.
    """
)
async def get_profile(
    current_user: User = Depends(dependencies.get_current_user)
):
    """
    Get current user profile with wallet information
    
    Returns complete user profile including:
    - Personal information (name, email, telegram)
    - Account status and role
    - Wallet balance and status
    - Account creation date
    """
    try:
        logger.info(f"Profile accessed by user: {current_user.email}")
        return current_user
    except Exception as e:
        logger.error(f"Error fetching profile: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to fetch profile"
        )

@router.put(
    "/profile",
    response_model=schemas.UserProfileResponse,
    responses={
        200: {"description": "Profile updated successfully"},
        400: {"model": schemas.ErrorResponse, "description": "Invalid input data"},
        401: {"model": schemas.ErrorResponse, "description": "Invalid or expired token"},
    },
    summary="Update User Profile",
    description="""
    Update the authenticated user's profile information.
    
    **Updatable fields**:
    - first_name
    - last_name  
    - telegram_id
    
    **Note**: Email and role cannot be changed through this endpoint.
    """
)
async def update_profile(
    profile_update: schemas.UpdateProfileRequest,
    current_user: User = Depends(dependencies.get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """
    Update current user's profile
    
    Only the fields provided in the request will be updated.
    Omitted fields will remain unchanged.
    """
    try:
        # Update only provided fields
        update_data = profile_update.model_dump(exclude_unset=True)
        
        for field, value in update_data.items():
            setattr(current_user, field, value)
        
        await db.commit()
        await db.refresh(current_user)
        
        logger.info(f"Profile updated for user: {current_user.email}")
        return current_user
        
    except Exception as e:
        await db.rollback()
        logger.error(f"Error updating profile: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to update profile"
        )

