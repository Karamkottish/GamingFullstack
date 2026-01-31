from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from typing import List
from app.core.database import get_db
from app.modules.auth.dependencies import get_current_active_role
from app.modules.auth.models import UserRole, User
from app.modules.affiliate import schemas
from app.modules.affiliate.service import AffiliateService

router = APIRouter()

@router.get("/stats", response_model=schemas.AffiliateStats)
async def get_affiliate_stats(
    current_user: User = Depends(get_current_active_role(UserRole.AFFILIATE)),
    db: AsyncSession = Depends(get_db)
):
    return await AffiliateService.get_stats(db, str(current_user.id))

@router.get("/analytics/performance", response_model=List[schemas.PerformancePoint])
async def get_affiliate_performance(
    current_user: User = Depends(get_current_active_role(UserRole.AFFILIATE)),
    db: AsyncSession = Depends(get_db)
):
    return await AffiliateService.get_performance(db, str(current_user.id))

@router.post("/links", response_model=schemas.LinkResponse)
async def generate_link(
    link_in: schemas.CreateLinkRequest,
    current_user: User = Depends(get_current_active_role(UserRole.AFFILIATE)),
    db: AsyncSession = Depends(get_db)
):
    return await AffiliateService.create_link(db, str(current_user.id), link_in)

@router.get("/payouts", response_model=List[schemas.PayoutLog])
async def get_payout_history(
    current_user: User = Depends(get_current_active_role(UserRole.AFFILIATE)),
    db: AsyncSession = Depends(get_db)
):
    return []
