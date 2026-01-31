from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from sqlalchemy import func
from app.modules.auth.models import User, UserRole
from app.modules.wallet.models import Wallet, Transaction
from app.modules.agent.schemas import AgentStats, AddUserRequest
from app.modules.auth.service import AuthService
from app.modules.auth.schemas import UserCreate
from typing import List

class AgentService:
    @staticmethod
    async def get_stats(db: AsyncSession, agent_id: str) -> AgentStats:
        # Dummy Implementation or Real DB Logic
        # In real world, we query Users where agent_id == agent_id (We need to add agent_id to User model!)
        # For now, we return dummy stats or calculate from partial data
        
        # We need to update User model to support hierarchy (agent_id)
        return AgentStats(
            total_users=1234,
            total_revenue=45231.89,
            pending_commission=2400.00,
            withdrawable_balance=12234.00
        )

    @staticmethod
    async def get_users(db: AsyncSession, agent_id: str, page: int, limit: int):
        # We need to filter by agent_id. Since we didn't add it yet to User, let's just return all Users for demo
        # TODO: Add agent_id to User model
        offset = (page - 1) * limit
        result = await db.execute(select(User).where(User.role == UserRole.USER).offset(offset).limit(limit))
        users = result.scalars().all()
        
        # Count total
        count_res = await db.execute(select(func.count(User.id)).where(User.role == UserRole.USER))
        total = count_res.scalar()
        
        return users, total

    @staticmethod
    async def create_user_under_agent(db: AsyncSession, agent_id: str, user_in: AddUserRequest):
        # Create User via AuthService
        auth_user_in = UserCreate(
            email=user_in.email, 
            password="password123", # Default password
            full_name=user_in.username,
            role=UserRole.USER
        )
        new_user = await AuthService.create_user(db, auth_user_in)
        # Link to agent (TODO in model)
        return new_user

    @staticmethod
    async def get_revenue_chart(db: AsyncSession, agent_id: str):
        return [
            { "date": "Mon", "revenue": 4000 },
            { "date": "Tue", "revenue": 3000 },
        ]

    @staticmethod
    async def get_commissions(db: AsyncSession, agent_id: str):
        return []
