from fastapi import APIRouter, Depends, Query, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from typing import List
from app.core.database import get_db
from app.modules.auth.dependencies import get_current_active_role, get_current_user
from app.modules.auth.models import UserRole, User
from app.modules.agent import schemas, service
from app.modules.agent.service import AgentService

router = APIRouter()

@router.get("/stats", response_model=schemas.AgentStats)
async def get_agent_stats(
    current_user: User = Depends(get_current_active_role(UserRole.AGENT)),
    db: AsyncSession = Depends(get_db)
):
    return await AgentService.get_stats(db, str(current_user.id))

@router.get("/analytics/revenue", response_model=List[schemas.RevenueChartPoint])
async def get_revenue_chart(
    range: str = "7d",
    current_user: User = Depends(get_current_active_role(UserRole.AGENT)),
    db: AsyncSession = Depends(get_db)
):
    return await AgentService.get_revenue_chart(db, str(current_user.id))

@router.get("/users", response_model=schemas.AgentUserList)
async def get_users_list(
    page: int = 1,
    limit: int = 10,
    search: str = None,
    current_user: User = Depends(get_current_active_role(UserRole.AGENT)),
    db: AsyncSession = Depends(get_db)
):
    users, total = await AgentService.get_users(db, str(current_user.id), page, limit)
    
    # Map to schema
    data = []
    for u in users:
        data.append(schemas.AgentUserResponse(
            id=u.id,
            username=u.full_name,
            email=u.email,
            status="ACTIVE" if u.is_active else "BLOCKED",
            joined_at=u.created_at,
            total_deposited=0.0, # Query wallet
            last_active=None
        ))
        
    return {
        "data": data,
        "meta": {"total": total, "page": page, "lastPage": (total // limit) + 1}
    }

@router.post("/users", response_model=schemas.AgentUserResponse)
async def add_new_user(
    user_in: schemas.AddUserRequest,
    current_user: User = Depends(get_current_active_role(UserRole.AGENT)),
    db: AsyncSession = Depends(get_db)
):
    user = await AgentService.create_user_under_agent(db, str(current_user.id), user_in)
    return schemas.AgentUserResponse(
            id=user.id,
            username=user.full_name,
            email=user.email,
            status="ACTIVE",
            joined_at=user.created_at,
            total_deposited=0.0,
            last_active=None
    )

@router.post("/payouts/request")
async def request_payout(
    payout_in: schemas.PayoutRequest,
    current_user: User = Depends(get_current_active_role(UserRole.AGENT)),
    db: AsyncSession = Depends(get_db)
):
    return {"status": "REQUESTED", "amount": payout_in.amount}
