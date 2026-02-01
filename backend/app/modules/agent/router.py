from fastapi import APIRouter, Depends, Query, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from typing import List, Optional
from uuid import UUID
from app.core.database import get_db
from app.core.dependencies import get_current_agent
from app.modules.auth.models import User
from app.modules.agent import schemas
from app.modules.agent.service import AgentService
import logging

router = APIRouter()
logger = logging.getLogger(__name__)

@router.get(
    "/stats",
    response_model=schemas.AgentStats,
    summary="Get Agent Dashboard Statistics",
    description="Retrieve comprehensive statistics for agent dashboard including users, revenue, and commissions."
)
async def get_agent_stats(
    current_user: User = Depends(get_current_agent),
    db: AsyncSession = Depends(get_db)
):
    """Get agent dashboard stats"""
    try:
        return await AgentService.get_stats(db, current_user.id)
    except Exception as e:
        logger.error(f"Error fetching agent stats: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to fetch statistics"
        )

@router.get(
    "/analytics/revenue",
    response_model=List[schemas.RevenueChartPoint],
    summary="Get Revenue Analytics",
    description="Get revenue chart data for specified time range"
)
async def get_revenue_chart(
    range: str = Query("7d", description="Time range: 7d, 30d, 90d"),
    current_user: User = Depends(get_current_agent),
    db: AsyncSession = Depends(get_db)
):
    """Get revenue analytics chart data"""
    try:
        return await AgentService.get_revenue_chart(db, current_user.id, range)
    except Exception as e:
        logger.error(f"Error fetching revenue chart: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to fetch revenue data"
        )

@router.get(
    "/users",
    response_model=schemas.AgentUserList,
    summary="Get Agent's Users",
    description="Get paginated list of users referred by this agent"
)
async def get_users_list(
    page: int = Query(1, ge=1),
    page_size: int = Query(20, ge=1, le=100),
    search: Optional[str] = Query(None, description="Search by email or name"),
    current_user: User = Depends(get_current_agent),
    db: AsyncSession = Depends(get_db)
):
    """List all users referred by this agent"""
    try:
        return await AgentService.get_users_list(db, current_user.id, page, page_size, search)
    except Exception as e:
        logger.error(f"Error fetching users: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to fetch users"
        )

@router.post(
    "/users",
    response_model=schemas.AgentUserResponse,
    status_code=status.HTTP_201_CREATED,
    summary="Add New User",
    description="Manually register a new user under this agent"
)
async def add_new_user(
    user_in: schemas.AddUserRequest,
    current_user: User = Depends(get_current_agent),
    db: AsyncSession = Depends(get_db)
):
    """Manually create a new user under this agent"""
    try:
        return await AgentService.create_user_under_agent(db, current_user.id, user_in)
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error creating user: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to create user"
        )

@router.patch(
    "/users/{user_id}/status",
    response_model=schemas.AgentUserResponse,
    summary="Block/Unblock User",
    description="Toggle user active status (block or unblock). Single efficient API for both actions."
)
async def toggle_user_status(
    user_id: UUID,
    current_user: User = Depends(get_current_agent),
    db: AsyncSession = Depends(get_db)
):
    """
    Block or unblock a user with a single API call.
    
    - Automatically toggles the user's `is_active` status
    - If user is active → blocks them
    - If user is blocked → unblocks them
    - Fast: Single database query
    """
    try:
        return await AgentService.toggle_user_status(db, current_user.id, user_id)
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error toggling user status: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to update user status"
        )

@router.get(
    "/wallet",
    response_model=schemas.WalletBalance,
    summary="Get Wallet Balance",
    description="Get detailed wallet balance including commission, pending, and withdrawable amounts"
)
async def get_wallet_balance(
    current_user: User = Depends(get_current_agent),
    db: AsyncSession = Depends(get_db)
):
    """Get agent wallet balance details"""
    try:
        return await AgentService.get_wallet_balance(db, current_user.id)
    except Exception as e:
        logger.error(f"Error fetching wallet: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to fetch wallet balance"
        )

@router.get(
    "/transactions",
    response_model=schemas.TransactionsList,
    summary="Get Transaction History",
    description="Get paginated list of all wallet transactions"
)
async def get_transactions(
    page: int = Query(1, ge=1),
    page_size: int = Query(20, ge=1, le=100),
    type: Optional[str] = Query(None, description="Filter by type: COMMISSION, WITHDRAWAL"),
    current_user: User = Depends(get_current_agent),
    db: AsyncSession = Depends(get_db)
):
    """Get transaction history"""
    try:
        return await AgentService.get_transactions(db, current_user.id, page, page_size, type)
    except Exception as e:
        logger.error(f"Error fetching transactions: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to fetch transactions"
        )

@router.get(
    "/commissions",
    response_model=schemas.CommissionsList,
    summary="Get Commission History",
    description="Get detailed commission breakdown by user and period"
)
async def get_commissions(
    page: int = Query(1, ge=1),
    page_size: int = Query(20, ge=1, le=100),
    current_user: User = Depends(get_current_agent),
    db: AsyncSession = Depends(get_db)
):
    """Get commission history"""
    try:
        return await AgentService.get_commissions(db, current_user.id, page, page_size)
    except Exception as e:
        logger.error(f"Error fetching commissions: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to fetch commissions"
        )

@router.post(
    "/payouts/request",
    response_model=schemas.PayoutRecord,
    status_code=status.HTTP_201_CREATED,
    summary="Request Payout/Withdrawal",
    description="Submit a withdrawal request for commission earnings"
)
async def request_payout(
    payout_in: schemas.PayoutRequest,
    current_user: User = Depends(get_current_agent),
    db: AsyncSession = Depends(get_db)
):
    """Request withdrawal of commission earnings"""
    try:
        return await AgentService.request_payout(db, current_user.id, payout_in)
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error requesting payout: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to process payout request"
        )

@router.get(
    "/payouts",
    response_model=schemas.PayoutsList,
    summary="Get Payout History",
    description="Get list of all payout/withdrawal requests"
)
async def get_payouts(
    page: int = Query(1, ge=1),
    page_size: int = Query(20, ge=1, le=100),
    status_filter: Optional[str] = Query(None, description="Filter by status: PENDING, APPROVED, REJECTED, PAID",  alias="status"),
    current_user: User = Depends(get_current_agent),
    db: AsyncSession = Depends(get_db)
):
    """Get payout history"""
    try:
        return await AgentService.get_payouts(db, current_user.id, page, page_size, status_filter)
    except Exception as e:
        logger.error(f"Error fetching payouts: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to fetch payouts"
        )
@router.post(
    "/payouts/{payout_id}/approve",
    response_model=schemas.PayoutRecord,
    summary="Approve Payout (Admin Only Sim)",
    description="Admin simulated endpoint to approve a payout request"
)
async def approve_payout(
    payout_id: UUID,
    db: AsyncSession = Depends(get_db)
):
    """Approve a payout request"""
    try:
        return await AgentService.approve_payout(db, payout_id)
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error approving payout: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to approve payout"
        )

@router.post(
    "/payouts/{payout_id}/reject",
    response_model=schemas.PayoutRecord,
    summary="Reject Payout (Admin Only Sim)",
    description="Admin simulated endpoint to reject a payout request with reason"
)
async def reject_payout(
    payout_id: UUID,
    reject_in: schemas.PayoutApprovalRequest,
    db: AsyncSession = Depends(get_db)
):
    """Reject a payout request"""
    try:
        return await AgentService.reject_payout(db, payout_id, reject_in.reason or "No reason provided")
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error rejecting payout: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to reject payout"
        )

@router.post("/payouts/{payout_id}/approve", response_model=schemas.PayoutRecord)
async def approve_payout(
    payout_id: UUID,
    db: AsyncSession = Depends(get_db)
):
    """Approve a payout request (Admin simulation)"""
    return await AgentService.approve_payout(db, payout_id)

@router.post("/payouts/{payout_id}/reject", response_model=schemas.PayoutRecord)
async def reject_payout(
    payout_id: UUID,
    payout_in: schemas.PayoutApprovalRequest,
    db: AsyncSession = Depends(get_db)
):
    """Reject a payout request (Admin simulation)"""
    return await AgentService.reject_payout(db, payout_id, payout_in.reason or "Rejected by administrator")
@router.post("/testing/seed-wallet")
async def seed_wallet(
    amount: float = Query(5000.0, ge=0),
    current_user: User = Depends(get_current_active_role(UserRole.AGENT)),
    db: AsyncSession = Depends(get_db)
):
    """Seed real wallet balance for testing withdrawals."""
    return await AgentService.seed_wallet(db, current_user.id, amount)
