from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from sqlalchemy import func, and_
from app.modules.auth.models import User, UserRole
from app.modules.wallet.models import Wallet, Transaction
from app.modules.agent.models import Commission
from app.modules.agent import schemas
from app.core.security import get_password_hash
from fastapi import HTTPException, status
from typing import Optional, List
from decimal import Decimal
from datetime import datetime, timedelta
from uuid import UUID
import uuid
import logging

logger = logging.getLogger(__name__)

class AgentService:
    
    @staticmethod
    async def get_stats(db: AsyncSession, agent_id: UUID) -> schemas.AgentStats:
        """Get comprehensive agent statistics"""
        
        # Count total users referred by this agent
        total_users_result = await db.execute(
            select(func.count(User.id)).where(User.agent_id == agent_id)
        )
        total_users = total_users_result.scalar() or 0
        
        # Count active users (those with recent activity)
        active_users_result = await db.execute(
            select(func.count(User.id)).where(
                and_(
                    User.agent_id == agent_id,
                    User.is_active == True
                )
            )
        )
        active_users = active_users_result.scalar() or 0
        
        # Get total commission (sum of all commission amounts)
        commission_result = await db.execute(
            select(func.sum(Commission.amount)).where(
                Commission.agent_id == agent_id
            )
        )
        total_commission = commission_result.scalar() or Decimal("0")
        
        # Estimate revenue (assume commission is 10% of revenue)
        total_revenue = total_commission * Decimal("10")
        
        # Get pending commissions (status PENDING if exists, otherwise 0)
        try:
            pending_result = await db.execute(
                select(func.sum(Commission.amount)).where(
                    and_(
                        Commission.agent_id == agent_id,
                        Commission.status == 'PENDING'
                    )
                )
            )
            pending_commission = pending_result.scalar() or Decimal("0")
        except:
            pending_commission = Decimal("0")
        
        # Get wallet balance and payouts
        wallet_result = await db.execute(
            select(Wallet).where(Wallet.user_id == agent_id)
        )
        wallet = wallet_result.scalars().first()
        withdrawable_balance = wallet.balance if wallet else Decimal("0")
        
        total_payouts = Decimal("0")
        pending_payouts = Decimal("0")
        
        if wallet:
            # Get total payouts (PAID)
            payouts_result = await db.execute(
                select(func.sum(Transaction.amount)).where(
                    and_(
                        Transaction.wallet_id == wallet.id,
                        Transaction.type == 'WITHDRAWAL',
                        Transaction.status == 'PAID'
                    )
                )
            )
            total_payouts = abs(payouts_result.scalar() or Decimal("0"))
            
            # Get pending payouts
            pending_payouts_result = await db.execute(
                select(func.sum(Transaction.amount)).where(
                    and_(
                        Transaction.wallet_id == wallet.id,
                        Transaction.type == 'WITHDRAWAL',
                        Transaction.status == 'PENDING'
                    )
                )
            )
            pending_payouts = abs(pending_payouts_result.scalar() or Decimal("0"))
        
        # This month's commission (simple calculation)
        month_start = datetime.utcnow().replace(day=1, hour=0, minute=0, second=0, microsecond=0)
        month_commission_result = await db.execute(
            select(func.sum(Commission.amount)).where(
                and_(
                    Commission.agent_id == agent_id,
                    Commission.created_at >= month_start
                )
            )
        )
        this_month_commission = month_commission_result.scalar() or Decimal("0")
        this_month_revenue = this_month_commission * Decimal("10")
        
        return schemas.AgentStats(
            total_users=total_users,
            active_users=active_users,
            total_revenue=total_revenue.quantize(Decimal("0.01")),
            total_commission=total_commission.quantize(Decimal("0.01")),
            pending_commission=pending_commission.quantize(Decimal("0.01")),
            total_payouts=total_payouts.quantize(Decimal("0.01")),
            pending_payouts=pending_payouts.quantize(Decimal("0.01")),
            withdrawable_balance=withdrawable_balance.quantize(Decimal("0.01")),
            this_month_revenue=this_month_revenue.quantize(Decimal("0.01")),
            this_month_commission=this_month_commission.quantize(Decimal("0.01"))
        )
    
    @staticmethod
    async def get_revenue_chart(db: AsyncSession, agent_id: UUID, time_range: str) -> List[schemas.RevenueChartPoint]:
        """Get revenue chart data"""
        # For MVP, return sample data
        # In production, query Commission table grouped by date
        days = 7 if time_range == "7d" else (30 if time_range == "30d" else 90)
        
        chart_data = []
        for i in range(days):
            date = (datetime.utcnow() - timedelta(days=days-i-1)).strftime("%Y-%m-%d")
            chart_data.append(schemas.RevenueChartPoint(
                date=date,
                revenue=Decimal("1000") * (i + 1) % 10,  # Sample data
                commission=Decimal("250") * (i + 1) % 10
            ))
        
        return chart_data
    
    @staticmethod
    async def get_users_list(
        db: AsyncSession,
        agent_id: UUID,
        page: int,
        page_size: int,
        search: Optional[str] = None
    ) -> schemas.AgentUserList:
        """Get paginated list of users referred by agent"""
        
        offset = (page - 1) * page_size
        
        # Base query
        query = select(User).where(User.agent_id == agent_id)
        
        # Apply search filter
        if search:
            query = query.where(
                (User.email.ilike(f"%{search}%")) |
                (User.first_name.ilike(f"%{search}%")) |
                (User.last_name.ilike(f"%{search}%"))
            )
        
        # Get users
        result = await db.execute(query.offset(offset).limit(page_size))
        users = result.scalars().all()
        
        # Get total count
        count_query = select(func.count(User.id)).where(User.agent_id == agent_id)
        if search:
            count_query = count_query.where(
                (User.email.ilike(f"%{search}%")) |
                (User.first_name.ilike(f"%{search}%")) |
                (User.last_name.ilike(f"%{search}%"))
            )
        count_result = await db.execute(count_query)
        total = count_result.scalar() or 0
        
        # Map to response
        user_list = []
        for user in users:
            user_list.append(schemas.AgentUserResponse(
                id=user.id,
                email=user.email,
                full_name=user.full_name,
                status="ACTIVE" if user.is_active else "INACTIVE",
                joined_at=user.created_at,
                total_deposited=Decimal("0"),  # TODO: Query from transactions
                total_wagered=Decimal("0"),
                last_active=None  # TODO: Track last activity
            ))
        
        return schemas.AgentUserList(
            data=user_list,
            total=total,
            page=page,
            page_size=page_size
        )
    
    @staticmethod
    async def create_user_under_agent(
        db: AsyncSession,
        agent_id: UUID,
        user_in: schemas.AddUserRequest
    ) -> schemas.AgentUserResponse:
        """Create a new user under this agent"""
        
        # Check if email already exists
        existing = await db.execute(select(User).where(User.email == user_in.email.lower()))
        if existing.scalars().first():
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Email already registered"
            )
        
        # Create user
        new_user = User(
            email=user_in.email.lower(),
            hashed_password=get_password_hash(user_in.password),
            first_name=user_in.first_name,
            last_name=user_in.last_name,
            telegram_id=user_in.telegram_id,
            role=UserRole.USER,
            agent_id=agent_id,
            is_active=True
        )
        
        db.add(new_user)
        await db.flush()
        
        # Create wallet for user
        wallet = Wallet(user_id=new_user.id)
        db.add(wallet)
        
        await db.commit()
        await db.refresh(new_user)
        
        logger.info(f"Agent {agent_id} created user {new_user.id}")
        
        return schemas.AgentUserResponse(
            id=new_user.id,
            email=new_user.email,
            full_name=new_user.full_name,
            status="ACTIVE",
            joined_at=new_user.created_at,
            total_deposited=Decimal("0"),
            total_wagered=Decimal("0"),
            last_active=None
        )
    
    @staticmethod
    async def toggle_user_status(
        db: AsyncSession,
        agent_id: UUID,
        user_id: UUID
    ) -> schemas.AgentUserResponse:
        """
        Block or unblock a user (toggle is_active status).
        Fast: Single query with validation.
        """
        
        # Get user and verify ownership in one query
        result = await db.execute(
            select(User).where(
                and_(
                    User.id == user_id,
                    User.agent_id == agent_id  # Security: ensure agent owns this user
                )
            )
        )
        user = result.scalars().first()
        
        if not user:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="User not found or not owned by this agent"
            )
        
        # Toggle status
        user.is_active = not user.is_active
        
        await db.commit()
        await db.refresh(user)
        
        action = "blocked" if not user.is_active else "unblocked"
        logger.info(f"Agent {agent_id} {action} user {user_id}")
        
        return schemas.AgentUserResponse(
            id=user.id,
            email=user.email,
            full_name=user.full_name,
            status="ACTIVE" if user.is_active else "BLOCKED",
            joined_at=user.created_at,
            total_deposited=Decimal("0"),
            total_wagered=Decimal("0"),
            last_active=None
        )
    
    @staticmethod
    async def get_wallet_balance(db: AsyncSession, agent_id: UUID) -> schemas.WalletBalance:
        """Get agent wallet balance"""
        
        wallet_result = await db.execute(select(Wallet).where(Wallet.user_id == agent_id))
        wallet = wallet_result.scalars().first()
        
        if not wallet:
            # Create wallet if it doesn't exist
            wallet = Wallet(user_id=agent_id, balance=Decimal("0"))
            db.add(wallet)
            await db.commit()
            await db.refresh(wallet)
        
        # Get pending commission
        try:
            pending_result = await db.execute(
                select(func.sum(Commission.amount)).where(
                    and_(
                        Commission.agent_id == agent_id,
                        Commission.status == 'PENDING'
                    )
                )
            )
            pending_commission = pending_result.scalar() or Decimal("0")
        except:
            pending_commission = Decimal("0")
        
        # Get total withdrawn (PAID status)
        try:
            withdrawn_result = await db.execute(
                select(func.sum(Transaction.amount)).where(
                    and_(
                        Transaction.wallet_id == wallet.id,
                        Transaction.type == 'WITHDRAWAL',
                        Transaction.status == 'PAID'
                    )
                )
            )
            total_withdrawn = abs(withdrawn_result.scalar() or Decimal("0"))
        except:
            total_withdrawn = Decimal("0")

        # Get pending payouts (PENDING status)
        try:
            pending_payouts_result = await db.execute(
                select(func.sum(Transaction.amount)).where(
                    and_(
                        Transaction.wallet_id == wallet.id,
                        Transaction.type == 'WITHDRAWAL',
                        Transaction.status == 'PENDING'
                    )
                )
            )
            pending_payouts = abs(pending_payouts_result.scalar() or Decimal("0"))
        except:
            pending_payouts = Decimal("0")
        
        # Get total earned (Robust Lifetime Earnings: Balance + Pending + Withdrawn)
        total_earned = wallet.balance + total_withdrawn + pending_payouts
        
        return schemas.WalletBalance(
            commission_balance=wallet.balance,
            pending_commission=pending_commission,
            pending_payouts=pending_payouts,
            total_withdrawn=total_withdrawn,
            total_earned=total_earned
        )
    
    @staticmethod
    async def get_transactions(
        db: AsyncSession,
        agent_id: UUID,
        page: int,
        page_size: int,
        type_filter: Optional[str] = None
    ) -> schemas.TransactionsList:
        """Get transaction history"""
        
        # Get wallet
        wallet_result = await db.execute(select(Wallet).where(Wallet.user_id == agent_id))
        wallet = wallet_result.scalars().first()
        
        if not wallet:
            return schemas.TransactionsList(transactions=[], total=0, page=page, page_size=page_size)
        
        offset = (page - 1) * page_size
        
        # Build query
        query = select(Transaction).where(Transaction.wallet_id == wallet.id)
        if type_filter:
            query = query.where(Transaction.type == type_filter)
        
        query = query.order_by(Transaction.created_at.desc()).offset(offset).limit(page_size)
        
        result = await db.execute(query)
        transactions = result.scalars().all()
        
        # Count total
        count_query = select(func.count(Transaction.id)).where(Transaction.wallet_id == wallet.id)
        if type_filter:
            count_query = count_query.where(Transaction.type == type_filter)
        
        count_result = await db.execute(count_query)
        total = count_result.scalar() or 0
        
        return schemas.TransactionsList(
            transactions=[schemas.TransactionRecord.model_validate(t) for t in transactions],
            total=total,
            page=page,
            page_size=page_size
        )
    
    @staticmethod
    async def get_commissions(
        db: AsyncSession,
        agent_id: UUID,
        page: int,
        page_size: int
    ) -> schemas.CommissionsList:
        """Get commission history"""
        
        offset = (page - 1) * page_size
        
        # Get commissions with user info - Use outerjoin in case the source user was deleted/missing
        result = await db.execute(
            select(Commission, User).outerjoin(User, Commission.user_id == User.id)
            .where(Commission.agent_id == agent_id)
            .order_by(Commission.created_at.desc())
            .offset(offset)
            .limit(page_size)
        )
        
        data = result.all()
        
        # Count total
        count_result = await db.execute(
            select(func.count(Commission.id)).where(Commission.agent_id == agent_id)
        )
        total = count_result.scalar() or 0
        
        # Get total amount
        sum_result = await db.execute(
            select(func.sum(Commission.amount)).where(Commission.agent_id == agent_id)
        )
        total_amount = sum_result.scalar() or Decimal("0")
        
        commission_list = []
        for commission, user in data:
            amt = (commission.amount or Decimal("0")).quantize(Decimal("0.01"))
            
            # Estimate revenue (10x commission)
            rev = (amt * Decimal("10")).quantize(Decimal("0.01"))
            
            commission_list.append(schemas.CommissionRecord(
                id=commission.id,
                user_id=commission.user_id or uuid.uuid4(),
                user_name=user.full_name if user else "Simulation Actor",
                amount=amt,
                revenue_generated=rev,
                commission_rate=Decimal("10.00"),
                date=commission.created_at,
                status=commission.status or "PAID"
            ))
        
        return schemas.CommissionsList(
            commissions=commission_list,
            total=total,
            total_amount=total_amount.quantize(Decimal("0.01"))
        )
    
    @staticmethod
    async def request_payout(
        db: AsyncSession,
        agent_id: UUID,
        payout_in: schemas.PayoutRequest
    ) -> schemas.PayoutRecord:
        """Request a payout/withdrawal"""
        
        # Get wallet
        wallet_result = await db.execute(select(Wallet).where(Wallet.user_id == agent_id))
        wallet = wallet_result.scalars().first()
        
        if not wallet:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Wallet not found"
            )
        
        # Check balance
        if wallet.balance < payout_in.amount:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"Insufficient balance. Available: ${wallet.balance}"
            )
        
        # Deduct from balance immediately to reflect "Liquid Balance" change
        wallet.balance -= payout_in.amount
        
        # Create withdrawal transaction
        transaction = Transaction(
            wallet_id=wallet.id,
            type='WITHDRAWAL',
            amount=-payout_in.amount,  # Negative for withdrawal
            status='PENDING',
            tx_metadata={
                "method": payout_in.method,
                "wallet_address": payout_in.wallet_address,
                "balance_before": str(wallet.balance + payout_in.amount),
                "balance_after": str(wallet.balance),
                "description": f"Withdrawal request via {payout_in.method}"
            }
        )
        
        db.add(transaction)
        await db.commit()
        await db.refresh(transaction)
        
        logger.info(f"Payout requested by agent {agent_id}: ${payout_in.amount}")
        
        return schemas.PayoutRecord(
            id=transaction.id,
            amount=payout_in.amount,
            method=payout_in.method,
            status='PENDING',
            requested_at=transaction.created_at,
            processed_at=None,
            rejection_reason=None
        )
    
    @staticmethod
    async def get_payouts(
        db: AsyncSession,
        agent_id: UUID,
        page: int,
        page_size: int,
        status_filter: Optional[str] = None
    ) -> schemas.PayoutsList:
        """Get payout history"""
        
        # Get wallet
        wallet_result = await db.execute(select(Wallet).where(Wallet.user_id == agent_id))
        wallet = wallet_result.scalars().first()
        
        if not wallet:
            return schemas.PayoutsList(payouts=[], total=0)
        
        offset = (page - 1) * page_size
        
        # Build query
        query = select(Transaction).where(
            and_(
                Transaction.wallet_id == wallet.id,
                Transaction.type == 'WITHDRAWAL'
            )
        )
        
        if status_filter:
            query = query.where(Transaction.status == status_filter)
        
        query = query.order_by(Transaction.created_at.desc()).offset(offset).limit(page_size)
        
        result = await db.execute(query)
        transactions = result.scalars().all()
        
        # Count
        count_query = select(func.count(Transaction.id)).where(
            and_(
                Transaction.wallet_id == wallet.id,
                Transaction.type == 'WITHDRAWAL'
            )
        )
        if status_filter:
            count_query = count_query.where(Transaction.status == status_filter)
        
        count_result = await db.execute(count_query)
        total = count_result.scalar() or 0
        
        payout_list = []
        for t in transactions:
            metadata = t.tx_metadata or {}
            payout_list.append(schemas.PayoutRecord(
                id=t.id,
                amount=abs(t.amount),
                method=metadata.get('method', 'UNKNOWN'),
                destination=metadata.get('wallet_address') or metadata.get('destination'),
                status=t.status,
                requested_at=t.created_at,
                processed_at=t.updated_at if t.status != 'PENDING' else None,
                rejection_reason=metadata.get('rejection_reason')
            ))
        
        return schemas.PayoutsList(
            payouts=payout_list,
            total=total
        )
    @staticmethod
    async def approve_payout(db: AsyncSession, payout_id: UUID) -> schemas.PayoutRecord:
        """Approve a payout request (Admin simulation)"""
        result = await db.execute(select(Transaction).where(Transaction.id == payout_id))
        transaction = result.scalars().first()
        
        if not transaction or transaction.type != 'WITHDRAWAL':
            raise HTTPException(status_code=404, detail="Payout request not found")
        
        if transaction.status != 'PENDING':
            raise HTTPException(status_code=400, detail=f"Payout already {transaction.status}")
        
        transaction.status = 'PAID'
        transaction.updated_at = datetime.utcnow()
        await db.commit()
        await db.refresh(transaction)
        
        metadata = transaction.tx_metadata or {}
        return schemas.PayoutRecord(
            id=transaction.id,
            amount=abs(transaction.amount),
            method=metadata.get('method', 'UNKNOWN'),
            destination=metadata.get('wallet_address') or metadata.get('destination'),
            status=transaction.status,
            requested_at=transaction.created_at,
            processed_at=transaction.updated_at,
            rejection_reason=None
        )

    @staticmethod
    async def reject_payout(db: AsyncSession, payout_id: UUID, reason: str) -> schemas.PayoutRecord:
        """Reject a payout request and refund balance (Admin simulation)"""
        result = await db.execute(select(Transaction).where(Transaction.id == payout_id))
        transaction = result.scalars().first()
        
        if not transaction or transaction.type != 'WITHDRAWAL':
            raise HTTPException(status_code=404, detail="Payout request not found")
        
        if transaction.status != 'PENDING':
            raise HTTPException(status_code=400, detail=f"Payout already {transaction.status}")
        
        # Get wallet to refund
        wallet_result = await db.execute(select(Wallet).where(Wallet.id == transaction.wallet_id))
        wallet = wallet_result.scalars().first()
        
        if wallet:
            # Payouts were already deducted in request_payout
            wallet.balance += abs(transaction.amount)
            
        transaction.status = 'REJECTED'
        transaction.updated_at = datetime.utcnow()
        metadata = (transaction.tx_metadata or {}).copy()
        metadata['rejection_reason'] = reason
        transaction.tx_metadata = metadata
        
        await db.commit()
        await db.refresh(transaction)
        
        return schemas.PayoutRecord(
            id=transaction.id,
            amount=abs(transaction.amount),
            method=metadata.get('method', 'UNKNOWN'),
            destination=metadata.get('wallet_address') or metadata.get('destination'),
            status=transaction.status,
            requested_at=transaction.created_at,
            processed_at=transaction.updated_at,
            rejection_reason=reason
        )

    @staticmethod
    async def seed_wallet(db: AsyncSession, agent_id: UUID, amount: float) -> dict:
        """
        Add real money to agent wallet and create sample commission history for testing.
        Ensures Financial Hub looks populated for demonstration.
        """
        # 1. Get/Create wallet with lock
        result = await db.execute(
            select(Wallet)
            .where(Wallet.user_id == agent_id)
            .with_for_update()
        )
        wallet = result.scalars().first()
        
        if not wallet:
            wallet = Wallet(user_id=agent_id, balance=Decimal("0"))
            db.add(wallet)
            await db.flush()
            
        balance_before = wallet.balance
        amt_decimal = Decimal(str(amount))
        wallet.balance += amt_decimal
        
        # 2. Add a primary mock transaction for history
        transaction = Transaction(
            wallet_id=wallet.id,
            type='DEPOSIT',
            amount=amt_decimal,
            status='COMPLETED',
            tx_metadata={
                "balance_before": str(balance_before),
                "balance_after": str(wallet.balance),
                "description": "Test Seed Balance",
                "test_seed": True
            }
        )
        db.add(transaction)

        # 3. Create Sample Commission history (to populate Financial Hub)
        # We'll split the amount into 3 mock commissions from fake "players"
        mock_players = ["JaneDoe", "Winner99", "AlexK"]
        chunk_amt = amt_decimal / 3

        # Find or create a dummy user to act as source for these commissions
        dummy_user_result = await db.execute(
            select(User).where(User.email == "system_mock_user@nexusplay.test")
        )
        dummy_user = dummy_user_result.scalars().first()
        
        if not dummy_user:
            dummy_user = User(
                email="system_mock_user@nexusplay.test",
                hashed_password="---", # Not usable for login
                first_name="Simulation",
                last_name="Actor",
                role=UserRole.USER,
                is_active=True
            )
            db.add(dummy_user)
            await db.flush()

        for i, player_name in enumerate(mock_players):
            # Quantize for clean database storage
            chunk_val = Decimal(str(chunk_amt)).quantize(Decimal("0.01"))
            commission = Commission(
                agent_id=agent_id,
                user_id=dummy_user.id,
                amount=chunk_val,
                type="REVENUE_SHARE",
                status="PAID",
                created_at=datetime.utcnow() - timedelta(hours=(i+1)*2),
            )
            db.add(commission)
        
        await db.commit()
        await db.refresh(wallet)
        
        return {
            "status": "success", 
            "new_balance": float(wallet.balance),
            "message": f"Seeded ${amount} and generated sample commission history."
        }
