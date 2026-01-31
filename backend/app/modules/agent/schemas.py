from pydantic import BaseModel, EmailStr
from typing import List, Optional
from datetime import datetime
from uuid import UUID

class AgentStats(BaseModel):
    total_users: int
    total_revenue: float
    pending_commission: float
    withdrawable_balance: float

class RevenueChartPoint(BaseModel):
    date: str
    revenue: float

class AgentUserResponse(BaseModel):
    id: UUID
    username: Optional[str] = None # We used full_name in User model, let's map it
    email: str
    status: str
    joined_at: datetime
    total_deposited: float
    last_active: Optional[datetime] = None

class AgentUserList(BaseModel):
    data: List[AgentUserResponse]
    meta: dict

class AddUserRequest(BaseModel):
    username: str
    email: EmailStr
    initial_credit: float = 0.0

class CommissionResponse(BaseModel):
    id: UUID
    date: datetime
    amount: float
    type: str
    status: str

class PayoutRequest(BaseModel):
    amount: float
    method: str
    wallet_address: Optional[str] = None
