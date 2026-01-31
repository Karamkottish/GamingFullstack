from pydantic import BaseModel, EmailStr, Field
from typing import List, Optional
from datetime import datetime
from uuid import UUID
from decimal import Decimal

# Dashboard & Statistics
class AgentStats(BaseModel):
    total_users: int
    active_users: int = 0
    total_revenue: Decimal
    total_commission: Decimal
    pending_commission: Decimal
    withdrawable_balance: Decimal
    this_month_revenue: Decimal = Decimal("0")
    this_month_commission: Decimal = Decimal("0")

class RevenueChartPoint(BaseModel):
    date: str
    revenue: Decimal
    commission: Decimal = Decimal("0")

# Users/Players
class AgentUserResponse(BaseModel):
    id: UUID
    email: str
    full_name: str
    status: str
    joined_at: datetime
    total_deposited: Decimal = Decimal("0")
    total_wagered: Decimal = Decimal("0")
    last_active: Optional[datetime] = None
    
    class Config:
        from_attributes = True

class AgentUserList(BaseModel):
    data: List[AgentUserResponse]
    total: int
    page: int = 1
    page_size: int = 20

class AddUserRequest(BaseModel):
    email: EmailStr
    password: str = Field(..., min_length=8)
    first_name: str = Field(..., min_length=1, max_length=50)
    last_name: str = Field(..., min_length=1, max_length=50)
    telegram_id: Optional[str] = None

# Wallet
class WalletBalance(BaseModel):
    commission_balance: Decimal
    pending_commission: Decimal
    total_withdrawn: Decimal = Decimal("0")
    total_earned: Decimal
    currency: str = "USD"

# Transactions
class TransactionRecord(BaseModel):
    id: UUID
    type: str
    amount: Decimal
    balance_after: Decimal
    description: Optional[str] = None
    created_at: datetime
    status: str = "COMPLETED"
    
    class Config:
        from_attributes = True

class TransactionsList(BaseModel):
    transactions: List[TransactionRecord]
    total: int
    page: int = 1
    page_size: int = 20

# Commissions
class CommissionRecord(BaseModel):
    id: UUID
    user_id: UUID
    user_name: str
    amount: Decimal
    revenue_generated: Decimal
    commission_rate: Decimal
    date: datetime
    status: str
    
    class Config:
        from_attributes = True

class CommissionsList(BaseModel):
    commissions: List[CommissionRecord]
    total: int
    total_amount: Decimal

# Payouts
class PayoutRequest(BaseModel):
    amount: Decimal = Field(..., gt=0)
    method: str = Field(..., description="BANK, CRYPTO, USDT")
    wallet_address: Optional[str] = None

class PayoutRecord(BaseModel):
    id: UUID
    amount: Decimal
    method: str
    status: str
    requested_at: datetime
    processed_at: Optional[datetime] = None
    rejection_reason: Optional[str] = None
    
    class Config:
        from_attributes = True

class PayoutsList(BaseModel):
    payouts: List[PayoutRecord]
    total: int
