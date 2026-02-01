from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from app.modules.auth.models import User, UserRole
from app.modules.auth.schemas import UserCreate
from app.core.security import get_password_hash, verify_password
from app.core.exceptions import (
    EmailAlreadyExistsError,
    InvalidCredentialsError,
    AccountLockedError
)
from app.modules.wallet.models import Wallet
from datetime import datetime, timedelta
import logging

logger = logging.getLogger(__name__)

MAX_FAILED_ATTEMPTS = 5
LOCKOUT_DURATION_MINUTES = 30

class AuthService:
    @staticmethod
    async def get_user_by_email(db: AsyncSession, email: str) -> User | None:
        """Get user by email address"""
        result = await db.execute(select(User).where(User.email == email.lower()))
        return result.scalars().first()

    @staticmethod
    async def create_user(db: AsyncSession, user_in: UserCreate) -> User:
        """Create a new user account"""
        # Check if email already exists
        existing_user = await AuthService.get_user_by_email(db, user_in.email)
        if existing_user:
            logger.warning(f"Registration attempt with existing email: {user_in.email}")
            raise EmailAlreadyExistsError()
        
        try:
            # Create user
            db_user = User(
                email=user_in.email.lower(),
                hashed_password=get_password_hash(user_in.password),
                role=user_in.role,
                first_name=user_in.first_name,
                last_name=user_in.last_name,
                telegram_id=user_in.telegram_id
            )
            db.add(db_user)
            await db.flush()  # Get user ID
            
            # Create wallet for user
            wallet = Wallet(user_id=db_user.id)
            db.add(wallet)
            
            await db.commit()
            await db.refresh(db_user)
            
            logger.info(f"New user created: {db_user.email} (ID: {db_user.id})")
            return db_user
            
        except Exception as e:
            await db.rollback()
            logger.error(f"Error creating user: {str(e)}")
            raise

    @staticmethod
    async def authenticate_user(db: AsyncSession, email: str, password: str) -> User:
        """Authenticate user and return user object"""
        user = await AuthService.get_user_by_email(db, email)
        
        if not user:
            logger.warning(f"Login attempt with non-existent email: {email}")
            raise InvalidCredentialsError()
        
        # Check if account is locked
        # Note: failed_login_attempts and locked_until fields would need to be added to User model
        # For now, this is a placeholder for future implementation
        # if user.locked_until and user.locked_until > datetime.utcnow():
        #     raise AccountLockedError(locked_until=user.locked_until.isoformat())
        
        # Verify password
        if not verify_password(password, user.hashed_password):
            logger.warning(f"Failed login attempt for user: {email}")
            # In production, increment failed_login_attempts here
            raise InvalidCredentialsError()
        
        # Successful login - reset failed attempts if applicable
        logger.info(f"Successful login for user: {email}")
        return user
    
    @staticmethod
    async def change_password(db: AsyncSession, user_id: str, current_password: str, new_password: str) -> User:
        """Change user password"""
        # Get user
        result = await db.execute(select(User).where(User.id == user_id))
        user = result.scalars().first()
        
        if not user:
             raise InvalidCredentialsError() # Reuse this or 404
        
        # Verify current password
        if not verify_password(current_password, user.hashed_password):
            logger.warning(f"Failed password change attempt for user: {user.email}")
            raise InvalidCredentialsError()
        
        # Update password
        user.hashed_password = get_password_hash(new_password)
        
        await db.commit()
        await db.refresh(user)
        
        logger.info(f"Password changed successfully for user: {user.email}")
        return user
