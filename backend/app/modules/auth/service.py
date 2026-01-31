from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from app.modules.auth.models import User, UserRole
from app.modules.auth.schemas import UserCreate
from app.core.security import get_password_hash, verify_password
from fastapi import HTTPException, status
from app.modules.wallet.models import Wallet

class AuthService:
    @staticmethod
    async def get_user_by_email(db: AsyncSession, email: str):
        result = await db.execute(select(User).where(User.email == email))
        return result.scalars().first()

    @staticmethod
    async def create_user(db: AsyncSession, user_in: UserCreate):
        existing_user = await AuthService.get_user_by_email(db, user_in.email)
        if existing_user:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Email already registered",
            )
        
        db_user = User(
            email=user_in.email,
            hashed_password=get_password_hash(user_in.password),
            role=user_in.role,
            first_name=user_in.first_name,
            last_name=user_in.last_name,
            telegram_id=user_in.telegram_id
        )
        db.add(db_user)
        await db.flush() # To get ID
        
        # Create Wallet
        # In a real Hexagonal architecture, we might emit an event here, or call WalletService
        # For simplicity, we create it directly in the transaction
        wallet = Wallet(user_id=db_user.id)
        db.add(wallet)
        
        await db.commit()
        await db.refresh(db_user)
        return db_user

    @staticmethod
    async def authenticate_user(db: AsyncSession, email: str, password: str):
        user = await AuthService.get_user_by_email(db, email)
        if not user or not verify_password(password, user.hashed_password):
            return None
        return user
