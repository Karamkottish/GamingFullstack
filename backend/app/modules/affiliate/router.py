from fastapi import APIRouter, Depends, Query, Request, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from typing import List, Optional
from app.core.database import get_db
from app.modules.auth.dependencies import get_current_active_role
from app.modules.auth.models import UserRole, User
from app.modules.affiliate import schemas
from app.modules.affiliate.service import AffiliateService
from uuid import UUID

router = APIRouter()

# ============================================================================
# STATS & ANALYTICS
# ============================================================================

@router.get(
    "/stats",
    response_model=schemas.AffiliateStats,
    summary="Get Affiliate Statistics",
    description="Retrieve comprehensive affiliate dashboard statistics including clicks, conversions, revenue, and payouts",
    responses={
        200: {
            "description": "Statistics retrieved successfully",
            "content": {
                "application/json": {
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
            }
        }
    }
)
async def get_affiliate_stats(
    current_user: User = Depends(get_current_active_role(UserRole.AFFILIATE)),
    db: AsyncSession = Depends(get_db)
):
    """Get comprehensive affiliate statistics"""
    return await AffiliateService.get_stats(db, current_user.id)

@router.get(
    "/analytics/performance",
    response_model=List[schemas.PerformancePoint],
    summary="Get Performance Analytics",
    description="Retrieve daily performance data for charts (clicks, conversions, revenue)",
    responses={
        200: {
            "description": "Performance data retrieved successfully"
        }
    }
)
async def get_affiliate_performance(
    days: int = Query(7, ge=1, le=90, description="Number of days to retrieve"),
    current_user: User = Depends(get_current_active_role(UserRole.AFFILIATE)),
    db: AsyncSession = Depends(get_db)
):
    """Get daily performance analytics for charts"""
    return await AffiliateService.get_performance(db, current_user.id, days)

@router.get(
    "/analytics/funnel",
    response_model=schemas.FunnelStats,
    summary="Get Conversion Funnel Stats",
    description="Retrieve conversion funnel statistics (Click → Registration → Deposit)",
    responses={
        200: {
            "description": "Funnel statistics retrieved successfully"
        }
    }
)
async def get_funnel_stats(
    current_user: User = Depends(get_current_active_role(UserRole.AFFILIATE)),
    db: AsyncSession = Depends(get_db)
):
    """Get conversion funnel statistics"""
    return await AffiliateService.get_funnel_stats(db, current_user.id)

# ============================================================================
# LINK MANAGEMENT
# ============================================================================

@router.post(
    "/links",
    response_model=schemas.LinkResponse,
    status_code=status.HTTP_201_CREATED,
    summary="Create Affiliate Link",
    description="Generate a new unique affiliate tracking link",
    responses={
        201: {
            "description": "Link created successfully",
            "content": {
                "application/json": {
                    "example": {
                        "id": "123e4567-e89b-12d3-a456-426614174000",
                        "short_link": "https://nxs.gg/a/abc123",
                        "slug": "abc123",
                        "campaign_name": "summer_promo",
                        "created_at": "2026-02-01T12:00:00"
                    }
                }
            }
        },
        400: {"description": "Invalid request data"},
        401: {"description": "Unauthorized"}
    }
)
async def generate_link(
    link_in: schemas.CreateLinkRequest,
    current_user: User = Depends(get_current_active_role(UserRole.AFFILIATE)),
    db: AsyncSession = Depends(get_db)
):
    """Create a new affiliate tracking link"""
    return await AffiliateService.create_link(db, current_user.id, link_in)

@router.get(
    "/links",
    response_model=schemas.LinksList,
    summary="Get Affiliate Links",
    description="Retrieve paginated list of affiliate links with performance metrics",
    responses={
        200: {
            "description": "Links retrieved successfully"
        }
    }
)
async def get_links(
    page: int = Query(1, ge=1, description="Page number"),
    page_size: int = Query(20, ge=1, le=100, description="Items per page"),
    current_user: User = Depends(get_current_active_role(UserRole.AFFILIATE)),
    db: AsyncSession = Depends(get_db)
):
    """Get paginated list of affiliate links with performance metrics"""
    return await AffiliateService.get_links(db, current_user.id, page, page_size)

@router.delete(
    "/links/{link_id}",
    status_code=status.HTTP_204_NO_CONTENT,
    summary="Delete Affiliate Link",
    description="Soft delete an affiliate link (deactivate)",
    responses={
        204: {"description": "Link deleted successfully"},
        404: {"description": "Link not found"},
        401: {"description": "Unauthorized"}
    }
)
async def delete_link(
    link_id: UUID,
    current_user: User = Depends(get_current_active_role(UserRole.AFFILIATE)),
    db: AsyncSession = Depends(get_db)
):
    """Delete (deactivate) an affiliate link"""
    await AffiliateService.delete_link(db, current_user.id, link_id)
    return None

# ============================================================================
# CLICK TRACKING (PUBLIC ENDPOINT)
# ============================================================================

@router.post(
    "/track/click/{slug}",
    summary="Track Click Event",
    description="Public endpoint to track clicks on affiliate links. Returns redirect URL.",
    responses={
        200: {
            "description": "Click tracked successfully",
            "content": {
                "application/json": {
                    "example": {
                        "status": "success",
                        "redirect_url": "https://nexusplay.com/casino",
                        "link_id": "123e4567-e89b-12d3-a456-426614174000"
                    }
                }
            }
        },
        404: {"description": "Link not found or inactive"}
    }
)
async def track_click(
    slug: str,
    request: Request,
    db: AsyncSession = Depends(get_db)
):
    """
    Track a click event on an affiliate link (PUBLIC endpoint, no auth required).
    Returns the redirect URL for the frontend to navigate to.
    """
    ip_address = request.client.host if request.client else None
    user_agent = request.headers.get("user-agent")
    
    return await AffiliateService.track_click(db, slug, ip_address, user_agent)

# ============================================================================
# WALLET & PAYOUTS
# ============================================================================

@router.get(
    "/wallet",
    response_model=schemas.AffiliateWallet,
    summary="Get Wallet Balance",
    description="Retrieve affiliate wallet balance and earnings summary",
    responses={
        200: {
            "description": "Wallet balance retrieved successfully"
        }
    }
)
async def get_wallet(
    current_user: User = Depends(get_current_active_role(UserRole.AFFILIATE)),
    db: AsyncSession = Depends(get_db)
):
    """Get affiliate wallet balance"""
    return await AffiliateService.get_wallet(db, current_user.id)

@router.post(
    "/payouts/request",
    response_model=schemas.PayoutLog,
    status_code=status.HTTP_201_CREATED,
    summary="Request Payout",
    description="Submit a withdrawal request for affiliate earnings",
    responses={
        201: {
            "description": "Payout request submitted successfully",
            "content": {
                "application/json": {
                    "example": {
                        "id": "123e4567-e89b-12d3-a456-426614174000",
                        "amount": "500.00",
                        "method": "CRYPTO",
                        "destination": "0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb",
                        "status": "PENDING",
                        "requested_at": "2026-02-01T12:00:00",
                        "processed_at": None,
                        "rejection_reason": None
                    }
                }
            }
        },
        400: {
            "description": "Insufficient balance or invalid request",
            "content": {
                "application/json": {
                    "example": {
                        "detail": "Insufficient balance. Available: $250.00"
                    }
                }
            }
        },
        401: {"description": "Unauthorized"}
    }
)
async def request_payout(
    payout_in: schemas.PayoutRequest,
    current_user: User = Depends(get_current_active_role(UserRole.AFFILIATE)),
    db: AsyncSession = Depends(get_db)
):
    """Request a payout/withdrawal"""
    return await AffiliateService.request_payout(db, current_user.id, payout_in)

@router.get(
    "/payouts",
    response_model=schemas.PayoutsList,
    summary="Get Payout History",
    description="Retrieve paginated payout history with optional status filter",
    responses={
        200: {
            "description": "Payout history retrieved successfully"
        }
    }
)
async def get_payout_history(
    page: int = Query(1, ge=1, description="Page number"),
    page_size: int = Query(20, ge=1, le=100, description="Items per page"),
    status_filter: Optional[str] = Query(None, description="Filter by status: PENDING, APPROVED, REJECTED"),
    current_user: User = Depends(get_current_active_role(UserRole.AFFILIATE)),
    db: AsyncSession = Depends(get_db)
):
    """Get payout history with optional status filter"""
    return await AffiliateService.get_payouts(db, current_user.id, page, page_size, status_filter)

# ============================================================================
# ADMIN SIMULATION (For Demo/Testing)
# ============================================================================

@router.post(
    "/testing/approve-payout/{payout_id}",
    summary="[ADMIN SIMULATION] Approve Payout",
    description="Simulate admin approval of a payout request (for demo purposes)",
    responses={
        200: {"description": "Payout approved successfully"},
        404: {"description": "Payout not found"},
        400: {"description": "Payout already processed"}
    }
)
async def approve_payout_simulation(
    payout_id: UUID,
    current_user: User = Depends(get_current_active_role(UserRole.AFFILIATE)),
    db: AsyncSession = Depends(get_db)
):
    """
    [DEMO ONLY] Simulate admin approval of payout.
    In production, this would be a separate admin endpoint.
    """
    from app.modules.affiliate.models import AffiliatePayout
    from sqlalchemy import select
    from datetime import datetime
    
    result = await db.execute(select(AffiliatePayout).where(AffiliatePayout.id == payout_id))
    payout = result.scalars().first()
    
    if not payout:
        raise HTTPException(status_code=404, detail="Payout not found")
    
    if payout.status != 'PENDING':
        raise HTTPException(status_code=400, detail=f"Payout already {payout.status}")
    
    payout.status = 'APPROVED'
    payout.processed_at = datetime.utcnow()
    await db.commit()
    
    return {"status": "success", "message": "Payout approved (simulated)"}

@router.post(
    "/testing/reject-payout/{payout_id}",
    summary="[ADMIN SIMULATION] Reject Payout",
    description="Simulate admin rejection of a payout request (for demo purposes)",
    responses={
        200: {"description": "Payout rejected successfully"},
        404: {"description": "Payout not found"},
        400: {"description": "Payout already processed"}
    }
)
async def reject_payout_simulation(
    payout_id: UUID,
    reason: str = Query(..., description="Rejection reason"),
    current_user: User = Depends(get_current_active_role(UserRole.AFFILIATE)),
    db: AsyncSession = Depends(get_db)
):
    """
    [DEMO ONLY] Simulate admin rejection of payout.
    In production, this would be a separate admin endpoint.
    """
    from app.modules.affiliate.models import AffiliatePayout
    from sqlalchemy import select
    from datetime import datetime
    
    result = await db.execute(select(AffiliatePayout).where(AffiliatePayout.id == payout_id))
    payout = result.scalars().first()
    
    if not payout:
        raise HTTPException(status_code=404, detail="Payout not found")
    
    if payout.status != 'PENDING':
        raise HTTPException(status_code=400, detail=f"Payout already {payout.status}")
    
    payout.status = 'REJECTED'
    payout.processed_at = datetime.utcnow()
    payout.rejection_reason = reason
    await db.commit()
    
    return {"status": "success", "message": "Payout rejected (simulated)"}

@router.post(
    "/testing/seed-wallet",
    summary="[TESTING] Seed Affiliate Wallet",
    description="Add demo balance to affiliate wallet for testing purposes. This endpoint is for development/demo only.",
    responses={
        200: {
            "description": "Wallet seeded successfully",
            "content": {
                "application/json": {
                    "example": {
                        "status": "success",
                        "message": "Wallet seeded with $5000.00",
                        "new_balance": "5000.00"
                    }
                }
            }
        }
    }
)
async def seed_affiliate_wallet(
    amount: float = Query(5000.0, description="Amount to add to wallet", ge=0, le=100000),
    current_user: User = Depends(get_current_active_role(UserRole.AFFILIATE)),
    db: AsyncSession = Depends(get_db)
):
    """
    [DEMO/TESTING ONLY] Seed affiliate wallet with demo balance.
    
    This simulates earning commissions without actual conversions.
    In production, balance is only added through real conversions.
    """
    from app.modules.affiliate.models import Conversion, AffiliateLink
    from sqlalchemy import select
    from datetime import datetime
    from decimal import Decimal
    import uuid
    
    # Check if affiliate has at least one link
    result = await db.execute(
        select(AffiliateLink)
        .where(AffiliateLink.affiliate_id == current_user.id)
        .where(AffiliateLink.is_active == 1)
        .limit(1)
    )
    link = result.scalars().first()
    
    if not link:
        raise HTTPException(
            status_code=400,
            detail="Please create at least one affiliate link before seeding wallet"
        )
    
    # Create a dummy conversion to represent the earnings
    dummy_conversion = Conversion(
        id=uuid.uuid4(),
        link_id=link.id,
        user_id=uuid.uuid4(),  # Dummy user ID
        conversion_type='FIRST_DEPOSIT',
        amount=Decimal(str(amount)),
        commission_earned=Decimal(str(amount)),
        created_at=datetime.utcnow()
    )
    
    db.add(dummy_conversion)
    await db.commit()
    
    # Get new wallet balance
    wallet = await AffiliateService.get_wallet(db, current_user.id)
    
    return {
        "status": "success",
        "message": f"Wallet seeded with ${amount:.2f}",
        "new_balance": str(wallet.available_balance)
    }

@router.post(
    "/testing/seed-campaign-data",
    summary="[TESTING] Seed Campaign Data",
    description="Generate realistic campaign data with random clicks, conversions, and revenue for demo purposes",
    responses={
        200: {
            "description": "Campaign data seeded successfully",
            "content": {
                "application/json": {
                    "example": {
                        "status": "success",
                        "message": "Campaign data seeded successfully",
                        "stats": {
                            "clicks_generated": 1250,
                            "conversions_generated": 45,
                            "revenue_generated": "2250.00"
                        }
                    }
                }
            }
        }
    }
)
async def seed_campaign_data(
    link_id: Optional[UUID] = Query(None, description="Specific link ID to seed, or all links if not provided"),
    days: int = Query(7, description="Number of days of historical data to generate", ge=1, le=30),
    current_user: User = Depends(get_current_active_role(UserRole.AFFILIATE)),
    db: AsyncSession = Depends(get_db)
):
    """
    [DEMO/TESTING ONLY] Generate realistic campaign performance data.
    
    Creates:
    - Random click events with realistic timestamps
    - Conversion events (registrations and deposits)
    - Revenue from conversions
    - Distributed across specified days for chart visualization
    """
    from app.modules.affiliate.models import AffiliateLink, ClickEvent, Conversion
    from sqlalchemy import select
    from datetime import datetime, timedelta
    from decimal import Decimal
    import uuid
    import random
    
    # Get affiliate links
    query = select(AffiliateLink).where(AffiliateLink.affiliate_id == current_user.id).where(AffiliateLink.is_active == 1)
    if link_id:
        query = query.where(AffiliateLink.id == link_id)
    
    result = await db.execute(query)
    links = result.scalars().all()
    
    if not links:
        raise HTTPException(
            status_code=400,
            detail="No active affiliate links found. Please create at least one link first."
        )
    
    total_clicks = 0
    total_conversions = 0
    total_revenue = Decimal("0")
    
    # Generate data for each link
    for link in links:
        # Random clicks per day (50-200 per link)
        clicks_per_day = random.randint(50, 200)
        
        # Generate historical data
        for day_offset in range(days):
            target_date = datetime.utcnow() - timedelta(days=days - day_offset - 1)
            
            # Vary clicks per day (80-120% of average)
            daily_clicks = int(clicks_per_day * random.uniform(0.8, 1.2))
            
            # Generate click events
            for _ in range(daily_clicks):
                # Random time within the day
                random_hour = random.randint(0, 23)
                random_minute = random.randint(0, 59)
                random_second = random.randint(0, 59)
                
                click_time = target_date.replace(
                    hour=random_hour,
                    minute=random_minute,
                    second=random_second
                )
                
                # Random IP addresses
                ip = f"{random.randint(1, 255)}.{random.randint(1, 255)}.{random.randint(1, 255)}.{random.randint(1, 255)}"
                
                # Random geo data
                countries = ['US', 'UK', 'CA', 'AU', 'DE', 'FR', 'ES', 'IT', 'BR', 'MX']
                
                click = ClickEvent(
                    id=uuid.uuid4(),
                    link_id=link.id,
                    ip_address=ip,
                    user_agent="Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
                    geo_country=random.choice(countries),
                    geo_lat=random.uniform(-90, 90),
                    geo_lng=random.uniform(-180, 180),
                    timestamp=click_time
                )
                db.add(click)
                total_clicks += 1
            
            # Generate conversions (3-8% conversion rate)
            conversion_rate = random.uniform(0.03, 0.08)
            num_conversions = int(daily_clicks * conversion_rate)
            
            for _ in range(num_conversions):
                # Random time after clicks
                conversion_time = target_date.replace(
                    hour=random.randint(0, 23),
                    minute=random.randint(0, 59),
                    second=random.randint(0, 59)
                )
                
                # 60% chance of FTD, 40% just registration
                is_ftd = random.random() < 0.6
                
                if is_ftd:
                    # Random deposit amount ($20-$500)
                    deposit_amount = Decimal(str(random.uniform(20, 500))).quantize(Decimal("0.01"))
                    # Commission: 25% of deposit
                    commission = (deposit_amount * Decimal("0.25")).quantize(Decimal("0.01"))
                    
                    conversion = Conversion(
                        id=uuid.uuid4(),
                        link_id=link.id,
                        user_id=None,  # Demo data - no real user
                        conversion_type='FIRST_DEPOSIT',
                        amount=deposit_amount,
                        commission_earned=commission,
                        created_at=conversion_time
                    )
                    total_revenue += commission
                else:
                    # Registration only - flat $5 CPA
                    conversion = Conversion(
                        id=uuid.uuid4(),
                        link_id=link.id,
                        user_id=None,  # Demo data - no real user
                        conversion_type='REGISTRATION',
                        amount=None,
                        commission_earned=Decimal("5.00"),
                        created_at=conversion_time
                    )
                    total_revenue += Decimal("5.00")
                
                db.add(conversion)
                total_conversions += 1
    
    await db.commit()
    
    return {
        "status": "success",
        "message": f"Campaign data seeded successfully for {len(links)} link(s)",
        "stats": {
            "links_seeded": len(links),
            "days_generated": days,
            "clicks_generated": total_clicks,
            "conversions_generated": total_conversions,
            "revenue_generated": str(total_revenue)
        }
    }
