from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from app.core.database import get_db
from app.modules.auth.schemas import UserCreate, UserLogin, Token, UserAuthResponse
from app.modules.auth.service import AuthService
from app.core.security import create_access_token, create_refresh_token

router = APIRouter()

@router.post("/register", response_model=UserAuthResponse)
async def register(user_in: UserCreate, db: AsyncSession = Depends(get_db)):
    user = await AuthService.create_user(db, user_in)
    
    # Generate tokens immediately for fast login
    access_token = create_access_token(subject=user.id)
    refresh_token = create_refresh_token(subject=user.id)
    
    return {
        "user": user,
        "access_token": access_token,
        "refresh_token": refresh_token,
        "token_type": "bearer"
    }

@router.post("/login", response_model=Token)
async def login(user_in: UserLogin, db: AsyncSession = Depends(get_db)):
    user = await AuthService.authenticate_user(db, user_in.email, user_in.password)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    access_token = create_access_token(subject=user.id)
    refresh_token = create_refresh_token(subject=user.id)
    
    return {
        "access_token": access_token,
        "refresh_token": refresh_token,
        "token_type": "bearer",
        "user": {
            "id": str(user.id),
            "email": user.email,
            "role": user.role,
            "name": user.full_name
        }
    }
