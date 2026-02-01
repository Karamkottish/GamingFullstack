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
