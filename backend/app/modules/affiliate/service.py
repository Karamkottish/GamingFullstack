from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from sqlalchemy import func, and_, or_, desc
from app.modules.affiliate import schemas
from app.modules.affiliate.models import AffiliateLink, ClickEvent, Conversion, AffiliatePayout
from app.modules.auth.models import User
from fastapi import HTTPException, status
from typing import Optional, List
from decimal import Decimal
from datetime import datetime, timedelta
from uuid import UUID
import uuid
import logging

logger = logging.getLogger(__name__)

class AffiliateService:
    
    # ============================================================================
    # STATS & ANALYTICS
    # ============================================================================
    
    @staticmethod
    async def get_stats(db: AsyncSession, affiliate_id: UUID) -> schemas.AffiliateStats:
        """Get comprehensive affiliate statistics with optimized queries"""
        
        # Get total clicks
        clicks_result = await db.execute(
            select(func.count(ClickEvent.id))
            .join(AffiliateLink, ClickEvent.link_id == AffiliateLink.id)
            .where(AffiliateLink.affiliate_id == affiliate_id)
        )
        total_clicks = clicks_result.scalar() or 0
        
        # Get registrations count
        reg_result = await db.execute(
            select(func.count(Conversion.id))
            .join(AffiliateLink, Conversion.link_id == AffiliateLink.id)
            .where(
                and_(
                    AffiliateLink.affiliate_id == affiliate_id,
                    Conversion.conversion_type == 'REGISTRATION'
                )
            )
        )
        registrations = reg_result.scalar() or 0
        
        # Get FTD count
        ftd_result = await db.execute(
            select(func.count(Conversion.id))
            .join(AffiliateLink, Conversion.link_id == AffiliateLink.id)
            .where(
                and_(
                    AffiliateLink.affiliate_id == affiliate_id,
                    Conversion.conversion_type == 'FIRST_DEPOSIT'
                )
            )
        )
        ftd_count = ftd_result.scalar() or 0
        
        # Get total revenue (sum of commission earned)
        revenue_result = await db.execute(
            select(func.sum(Conversion.commission_earned))
            .join(AffiliateLink, Conversion.link_id == AffiliateLink.id)
            .where(AffiliateLink.affiliate_id == affiliate_id)
        )
        total_revenue = revenue_result.scalar() or Decimal("0")
        
        # Get pending payouts
        pending_result = await db.execute(
            select(func.sum(AffiliatePayout.amount))
            .where(
                and_(
                    AffiliatePayout.affiliate_id == affiliate_id,
                    AffiliatePayout.status == 'PENDING'
                )
            )
        )
        pending_payouts = pending_result.scalar() or Decimal("0")
        
        # Get total withdrawn
        withdrawn_result = await db.execute(
            select(func.sum(AffiliatePayout.amount))
            .where(
                and_(
                    AffiliatePayout.affiliate_id == affiliate_id,
                    AffiliatePayout.status == 'APPROVED'
                )
            )
        )
        total_withdrawn = withdrawn_result.scalar() or Decimal("0")
        
        # Calculate conversion rate
        conversion_rate = (registrations / total_clicks * 100) if total_clicks > 0 else 0.0
        
        return schemas.AffiliateStats(
            total_clicks=total_clicks,
            registrations=registrations,
            ftd_count=ftd_count,
            total_revenue=total_revenue.quantize(Decimal("0.01")),
            pending_payouts=pending_payouts.quantize(Decimal("0.01")),
            total_withdrawn=total_withdrawn.quantize(Decimal("0.01")),
            conversion_rate=round(conversion_rate, 2)
        )
    
    @staticmethod
    async def get_performance(
        db: AsyncSession, 
        affiliate_id: UUID, 
        days: int = 7
    ) -> List[schemas.PerformancePoint]:
        """Get daily performance data for charts"""
        
        start_date = datetime.utcnow() - timedelta(days=days)
        
        # Get daily clicks
        clicks_query = await db.execute(
            select(
                func.date(ClickEvent.timestamp).label('date'),
                func.count(ClickEvent.id).label('clicks')
            )
            .join(AffiliateLink, ClickEvent.link_id == AffiliateLink.id)
            .where(
                and_(
                    AffiliateLink.affiliate_id == affiliate_id,
                    ClickEvent.timestamp >= start_date
                )
            )
            .group_by(func.date(ClickEvent.timestamp))
            .order_by(func.date(ClickEvent.timestamp))
        )
        clicks_data = {str(row.date): row.clicks for row in clicks_query}
        
        # Get daily conversions
        conv_query = await db.execute(
            select(
                func.date(Conversion.created_at).label('date'),
                func.count(Conversion.id).label('conversions'),
                func.sum(Conversion.commission_earned).label('revenue')
            )
            .join(AffiliateLink, Conversion.link_id == AffiliateLink.id)
            .where(
                and_(
                    AffiliateLink.affiliate_id == affiliate_id,
                    Conversion.created_at >= start_date
                )
            )
            .group_by(func.date(Conversion.created_at))
            .order_by(func.date(Conversion.created_at))
        )
        conv_data = {str(row.date): {'conversions': row.conversions, 'revenue': row.revenue or Decimal("0")} for row in conv_query}
        
        # Build performance points
        performance = []
        for i in range(days):
            date = (datetime.utcnow() - timedelta(days=days-i-1)).date()
            date_str = str(date)
            
            performance.append(schemas.PerformancePoint(
                date=date_str,
                clicks=clicks_data.get(date_str, 0),
                conversions=conv_data.get(date_str, {}).get('conversions', 0),
                revenue=conv_data.get(date_str, {}).get('revenue', Decimal("0")).quantize(Decimal("0.01"))
            ))
        
        return performance
    
    @staticmethod
    async def get_funnel_stats(db: AsyncSession, affiliate_id: UUID) -> schemas.FunnelStats:
        """Get conversion funnel statistics"""
        
        stats = await AffiliateService.get_stats(db, affiliate_id)
        
        click_to_reg = (stats.registrations / stats.total_clicks * 100) if stats.total_clicks > 0 else 0.0
        reg_to_ftd = (stats.ftd_count / stats.registrations * 100) if stats.registrations > 0 else 0.0
        overall = (stats.ftd_count / stats.total_clicks * 100) if stats.total_clicks > 0 else 0.0
        
        return schemas.FunnelStats(
            total_clicks=stats.total_clicks,
            total_registrations=stats.registrations,
            total_ftd=stats.ftd_count,
            click_to_reg_rate=round(click_to_reg, 2),
            reg_to_ftd_rate=round(reg_to_ftd, 2),
            overall_conversion_rate=round(overall, 2)
        )
    
    # ============================================================================
    # LINK MANAGEMENT
    # ============================================================================
    
    @staticmethod
    async def create_link(
        db: AsyncSession, 
        affiliate_id: UUID, 
        link_in: schemas.CreateLinkRequest
    ) -> schemas.LinkResponse:
        """Create a new affiliate tracking link"""
        
        # Generate unique slug
        slug = str(uuid.uuid4())[:8]
        
        # Ensure uniqueness
        existing = await db.execute(select(AffiliateLink).where(AffiliateLink.slug == slug))
        while existing.scalars().first():
            slug = str(uuid.uuid4())[:8]
            existing = await db.execute(select(AffiliateLink).where(AffiliateLink.slug == slug))
        
        new_link = AffiliateLink(
            affiliate_id=affiliate_id,
            slug=slug,
            target_url=link_in.target_url,
            campaign_name=link_in.campaign_name
        )
        
        db.add(new_link)
        await db.commit()
        await db.refresh(new_link)
        
        logger.info(f"Created affiliate link {slug} for affiliate {affiliate_id}")
        
        return schemas.LinkResponse(
            id=new_link.id,
            short_link=f"https://nxs.gg/a/{slug}",
            slug=slug,
            campaign_name=link_in.campaign_name,
            created_at=new_link.created_at
        )
    
    @staticmethod
    async def get_links(
        db: AsyncSession,
        affiliate_id: UUID,
        page: int = 1,
        page_size: int = 20
    ) -> schemas.LinksList:
        """Get paginated list of affiliate links with performance metrics"""
        
        offset = (page - 1) * page_size
        
        # Get links with aggregated stats
        query = await db.execute(
            select(
                AffiliateLink,
                func.count(ClickEvent.id).label('total_clicks'),
                func.count(Conversion.id).label('total_conversions'),
                func.sum(Conversion.commission_earned).label('total_revenue')
            )
            .outerjoin(ClickEvent, AffiliateLink.id == ClickEvent.link_id)
            .outerjoin(Conversion, AffiliateLink.id == Conversion.link_id)
            .where(
                and_(
                    AffiliateLink.affiliate_id == affiliate_id,
                    AffiliateLink.is_active == 1
                )
            )
            .group_by(AffiliateLink.id)
            .order_by(desc(AffiliateLink.created_at))
            .offset(offset)
            .limit(page_size)
        )
        
        results = query.all()
        
        # Count total
        count_result = await db.execute(
            select(func.count(AffiliateLink.id))
            .where(
                and_(
                    AffiliateLink.affiliate_id == affiliate_id,
                    AffiliateLink.is_active == 1
                )
            )
        )
        total = count_result.scalar() or 0
        
        links = []
        for row in results:
            link, clicks, conversions, revenue = row
            links.append(schemas.LinkListItem(
                id=link.id,
                slug=link.slug,
                target_url=link.target_url,
                campaign_name=link.campaign_name,
                created_at=link.created_at,
                total_clicks=clicks or 0,
                total_conversions=conversions or 0,
                total_revenue=(revenue or Decimal("0")).quantize(Decimal("0.01")),
                is_active=bool(link.is_active)
            ))
        
        return schemas.LinksList(
            links=links,
            total=total,
            page=page,
            page_size=page_size
        )
    
    @staticmethod
    async def delete_link(db: AsyncSession, affiliate_id: UUID, link_id: UUID) -> bool:
        """Soft delete an affiliate link"""
        
        result = await db.execute(
            select(AffiliateLink).where(
                and_(
                    AffiliateLink.id == link_id,
                    AffiliateLink.affiliate_id == affiliate_id
                )
            )
        )
        link = result.scalars().first()
        
        if not link:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Link not found"
            )
        
        link.is_active = 0
        await db.commit()
        
        logger.info(f"Deleted affiliate link {link_id}")
        return True
    
    # ============================================================================
    # CLICK & CONVERSION TRACKING
    # ============================================================================
    
    @staticmethod
    async def track_click(
        db: AsyncSession,
        slug: str,
        ip_address: Optional[str] = None,
        user_agent: Optional[str] = None
    ) -> dict:
        """Track a click event on an affiliate link"""
        
        # Find link
        result = await db.execute(
            select(AffiliateLink).where(
                and_(
                    AffiliateLink.slug == slug,
                    AffiliateLink.is_active == 1
                )
            )
        )
        link = result.scalars().first()
        
        if not link:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Link not found or inactive"
            )
        
        # Create click event
        click = ClickEvent(
            link_id=link.id,
            ip_address=ip_address or "unknown",
            user_agent=user_agent,
            # TODO: Add geo-location lookup based on IP
            geo_country=None
        )
        
        db.add(click)
        await db.commit()
        
        logger.info(f"Tracked click on link {slug} from IP {ip_address}")
        
        return {
            "status": "success",
            "redirect_url": link.target_url,
            "link_id": str(link.id)
        }
    
    @staticmethod
    async def track_conversion(
        db: AsyncSession,
        link_id: UUID,
        user_id: UUID,
        conversion_type: str,
        amount: Optional[Decimal] = None
    ) -> schemas.ConversionRecord:
        """Track a conversion event (registration or deposit)"""
        
        # Check if conversion already exists
        existing = await db.execute(
            select(Conversion).where(
                and_(
                    Conversion.link_id == link_id,
                    Conversion.user_id == user_id,
                    Conversion.conversion_type == conversion_type
                )
            )
        )
        if existing.scalars().first():
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Conversion already tracked"
            )
        
        # Calculate commission (dummy logic)
        commission = Decimal("0")
        if conversion_type == "REGISTRATION":
            commission = Decimal("30.00")  # CPA for registration
        elif conversion_type == "FIRST_DEPOSIT" and amount:
            commission = amount * Decimal("0.10")  # 10% RevShare
        
        conversion = Conversion(
            link_id=link_id,
            user_id=user_id,
            conversion_type=conversion_type,
            amount=amount,
            commission_earned=commission.quantize(Decimal("0.01"))
        )
        
        db.add(conversion)
        await db.commit()
        await db.refresh(conversion)
        
        # Get link and user info for response
        link_result = await db.execute(select(AffiliateLink).where(AffiliateLink.id == link_id))
        link = link_result.scalars().first()
        
        user_result = await db.execute(select(User).where(User.id == user_id))
        user = user_result.scalars().first()
        
        logger.info(f"Tracked {conversion_type} conversion for user {user_id} on link {link_id}")
        
        return schemas.ConversionRecord(
            id=conversion.id,
            link_slug=link.slug if link else "unknown",
            user_email=user.email if user else "unknown",
            conversion_type=conversion_type,
            amount=amount,
            commission_earned=commission,
            created_at=conversion.created_at
        )
    
    # ============================================================================
    # PAYOUTS
    # ============================================================================
    
    @staticmethod
    async def get_wallet(db: AsyncSession, affiliate_id: UUID) -> schemas.AffiliateWallet:
        """Get affiliate wallet balance"""
        
        # Get total earned
        earned_result = await db.execute(
            select(func.sum(Conversion.commission_earned))
            .join(AffiliateLink, Conversion.link_id == AffiliateLink.id)
            .where(AffiliateLink.affiliate_id == affiliate_id)
        )
        total_earned = earned_result.scalar() or Decimal("0")
        
        # Get pending payouts
        pending_result = await db.execute(
            select(func.sum(AffiliatePayout.amount))
            .where(
                and_(
                    AffiliatePayout.affiliate_id == affiliate_id,
                    AffiliatePayout.status == 'PENDING'
                )
            )
        )
        pending_payouts = pending_result.scalar() or Decimal("0")
        
        # Get total withdrawn
        withdrawn_result = await db.execute(
            select(func.sum(AffiliatePayout.amount))
            .where(
                and_(
                    AffiliatePayout.affiliate_id == affiliate_id,
                    AffiliatePayout.status == 'APPROVED'
                )
            )
        )
        total_withdrawn = withdrawn_result.scalar() or Decimal("0")
        
        available_balance = total_earned - pending_payouts - total_withdrawn
        
        return schemas.AffiliateWallet(
            available_balance=available_balance.quantize(Decimal("0.01")),
            pending_payouts=pending_payouts.quantize(Decimal("0.01")),
            total_earned=total_earned.quantize(Decimal("0.01")),
            total_withdrawn=total_withdrawn.quantize(Decimal("0.01"))
        )
    
    @staticmethod
    async def request_payout(
        db: AsyncSession,
        affiliate_id: UUID,
        payout_in: schemas.PayoutRequest
    ) -> schemas.PayoutLog:
        """Request a payout/withdrawal"""
        
        # Check available balance
        wallet = await AffiliateService.get_wallet(db, affiliate_id)
        
        if wallet.available_balance < payout_in.amount:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"Insufficient balance. Available: ${wallet.available_balance}"
            )
        
        # Create payout request
        payout = AffiliatePayout(
            affiliate_id=affiliate_id,
            amount=payout_in.amount.quantize(Decimal("0.01")),
            method=payout_in.method,
            destination=payout_in.destination,
            status='PENDING'
        )
        
        db.add(payout)
        await db.commit()
        await db.refresh(payout)
        
        logger.info(f"Payout requested by affiliate {affiliate_id}: ${payout_in.amount}")
        
        return schemas.PayoutLog(
            id=payout.id,
            amount=payout.amount,
            method=payout.method,
            destination=payout.destination,
            status=payout.status,
            requested_at=payout.requested_at,
            processed_at=None,
            rejection_reason=None
        )
    
    @staticmethod
    async def get_payouts(
        db: AsyncSession,
        affiliate_id: UUID,
        page: int = 1,
        page_size: int = 20,
        status_filter: Optional[str] = None
    ) -> schemas.PayoutsList:
        """Get payout history"""
        
        offset = (page - 1) * page_size
        
        # Build query
        query = select(AffiliatePayout).where(AffiliatePayout.affiliate_id == affiliate_id)
        
        if status_filter:
            query = query.where(AffiliatePayout.status == status_filter)
        
        query = query.order_by(desc(AffiliatePayout.requested_at)).offset(offset).limit(page_size)
        
        result = await db.execute(query)
        payouts_data = result.scalars().all()
        
        # Count total
        count_query = select(func.count(AffiliatePayout.id)).where(AffiliatePayout.affiliate_id == affiliate_id)
        if status_filter:
            count_query = count_query.where(AffiliatePayout.status == status_filter)
        
        count_result = await db.execute(count_query)
        total = count_result.scalar() or 0
        
        payouts = [
            schemas.PayoutLog(
                id=p.id,
                amount=p.amount,
                method=p.method,
                destination=p.destination,
                status=p.status,
                requested_at=p.requested_at,
                processed_at=p.processed_at,
                rejection_reason=p.rejection_reason
            )
            for p in payouts_data
        ]
        
        return schemas.PayoutsList(
            payouts=payouts,
            total=total,
            page=page,
            page_size=page_size
        )
