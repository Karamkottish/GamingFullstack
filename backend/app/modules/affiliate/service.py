from sqlalchemy.ext.asyncio import AsyncSession
from app.modules.affiliate.schemas import CreateLinkRequest, LinkResponse, AffiliateStats
from app.modules.affiliate.models import AffiliateLink
from sqlalchemy.future import select
import uuid

class AffiliateService:
    @staticmethod
    async def get_stats(db: AsyncSession, affiliate_id: str):
        # Query ClickEvents, Users (registrations), Commissions
        return AffiliateStats(
            total_clicks=12543,
            registrations=892,
            ftd_count=345,
            total_revenue=15234.00
        )

    @staticmethod
    async def get_performance(db: AsyncSession, affiliate_id: str):
        return [
            { "name": "Mon", "clicks": 120, "conversions": 10 },
            { "name": "Tue", "clicks": 145, "conversions": 15 },
        ]

    @staticmethod
    async def create_link(db: AsyncSession, affiliate_id: str, link_in: CreateLinkRequest):
        # Generate unique slug
        slug = str(uuid.uuid4())[:8]
        new_link = AffiliateLink(
            affiliate_id=affiliate_id,
            slug=slug,
            target_url=link_in.target_url,
            campaign_name=link_in.campaign_name
        )
        db.add(new_link)
        await db.commit()
        await db.refresh(new_link)
        return LinkResponse(short_link=f"https://nxs.gg/a/{slug}")
