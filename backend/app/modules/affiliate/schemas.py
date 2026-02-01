from pydantic import BaseModel, Field, field_validator
from typing import List, Optional
from datetime import datetime
from uuid import UUID
from decimal import Decimal

# ============================================================================
# STATS & ANALYTICS
# ============================================================================

class AffiliateStats(BaseModel):
    """Comprehensive affiliate dashboard statistics"""
    total_clicks: int = Field(..., description="Total clicks across all links")
    registrations: int = Field(..., description="Total user registrations from affiliate links")
    ftd_count: int = Field(..., description="Total first-time deposits")
    total_revenue: Decimal = Field(..., description="Total revenue earned")
    pending_payouts: Decimal = Field(default=Decimal("0"), description="Pending withdrawal amount")
    total_withdrawn: Decimal = Field(default=Decimal("0"), description="Total amount withdrawn")
    conversion_rate: float = Field(default=0.0, description="Click to registration rate (%)")
    
    class Config:
        json_schema_extra = {
            "example": {
                "total_clicks": 12543,
                "registrations": 892,
                "ftd_count": 345,
                "total_revenue": "15234.50",
                "pending_payouts": "500.00",
                "total_withdrawn": "10000.00",
                "conversion_rate": 7.1
            }
        }

class PerformancePoint(BaseModel):
    """Single data point for performance chart"""
    date: str = Field(..., description="Date in YYYY-MM-DD format")
    clicks: int
    conversions: int
    revenue: Decimal = Field(default=Decimal("0"))

class FunnelStats(BaseModel):
    """Conversion funnel statistics"""
    total_clicks: int
    total_registrations: int
    total_ftd: int
    click_to_reg_rate: float
    reg_to_ftd_rate: float
    overall_conversion_rate: float

# ============================================================================
# LINK MANAGEMENT
# ============================================================================

class CreateLinkRequest(BaseModel):
    """Request to create a new affiliate link"""
    target_url: str = Field(..., min_length=1, max_length=500, description="Destination URL")
    campaign_name: str = Field(..., min_length=1, max_length=100, description="Campaign identifier")
    
    @field_validator('target_url')
    @classmethod
    def validate_url(cls, v: str) -> str:
        if not v.startswith(('http://', 'https://')):
            raise ValueError('URL must start with http:// or https://')
        return v

class LinkResponse(BaseModel):
    """Response after creating a link"""
    id: UUID
    short_link: str = Field(..., description="Shortened tracking link")
    slug: str
    campaign_name: str
    created_at: datetime
    
    class Config:
        json_schema_extra = {
            "example": {
                "id": "123e4567-e89b-12d3-a456-426614174000",
                "short_link": "https://nxs.gg/a/abc123",
                "slug": "abc123",
                "campaign_name": "summer_promo",
                "created_at": "2026-02-01T12:00:00"
            }
        }

class LinkListItem(BaseModel):
    """Single link with performance metrics"""
    id: UUID
    slug: str
    target_url: str
    campaign_name: str
    created_at: datetime
    total_clicks: int = 0
    total_conversions: int = 0
    total_revenue: Decimal = Decimal("0")
    is_active: bool = True

class LinksList(BaseModel):
    """Paginated list of affiliate links"""
    links: List[LinkListItem]
    total: int
    page: int = 1
    page_size: int = 20

# ============================================================================
# CLICK & CONVERSION TRACKING
# ============================================================================

class TrackClickRequest(BaseModel):
    """Request to track a click event"""
    slug: str = Field(..., description="Link slug from URL")
    ip_address: Optional[str] = None
    user_agent: Optional[str] = None

class ClickRecord(BaseModel):
    """Single click event record"""
    id: UUID
    link_slug: str
    ip_address: str
    geo_country: Optional[str] = None
    timestamp: datetime

class ConversionRecord(BaseModel):
    """Single conversion event"""
    id: UUID
    link_slug: str
    user_email: str
    conversion_type: str  # REGISTRATION or FIRST_DEPOSIT
    amount: Optional[Decimal] = None
    commission_earned: Decimal
    created_at: datetime

class ConversionsList(BaseModel):
    """Paginated conversion history"""
    conversions: List[ConversionRecord]
    total: int
    total_commission: Decimal

# ============================================================================
# PAYOUTS
# ============================================================================

class PayoutRequest(BaseModel):
    """Request to withdraw earnings"""
    amount: Decimal = Field(..., gt=0, description="Amount to withdraw")
    method: str = Field(..., description="BANK, CRYPTO, or USDT")
    destination: Optional[str] = Field(None, max_length=500, description="Wallet address or bank details")
    
    @field_validator('method')
    @classmethod
    def validate_method(cls, v: str) -> str:
        allowed = ['BANK', 'CRYPTO', 'USDT']
        if v.upper() not in allowed:
            raise ValueError(f'Method must be one of: {", ".join(allowed)}')
        return v.upper()
    
    class Config:
        json_schema_extra = {
            "example": {
                "amount": "500.00",
                "method": "CRYPTO",
                "destination": "0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb"
            }
        }

class PayoutLog(BaseModel):
    """Single payout record"""
    id: UUID
    amount: Decimal
    method: str
    destination: Optional[str] = None
    status: str  # PENDING, APPROVED, REJECTED
    requested_at: datetime
    processed_at: Optional[datetime] = None
    rejection_reason: Optional[str] = None
    
    class Config:
        from_attributes = True

class PayoutsList(BaseModel):
    """Paginated payout history"""
    payouts: List[PayoutLog]
    total: int
    page: int = 1
    page_size: int = 20

# ============================================================================
# WALLET
# ============================================================================

class AffiliateWallet(BaseModel):
    """Affiliate wallet balance"""
    available_balance: Decimal = Field(..., description="Available for withdrawal")
    pending_payouts: Decimal = Field(..., description="Pending withdrawal requests")
    total_earned: Decimal = Field(..., description="Lifetime earnings")
    total_withdrawn: Decimal = Field(..., description="Total amount withdrawn")
    currency: str = "USD"
