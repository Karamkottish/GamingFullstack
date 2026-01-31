from sqlalchemy import Column, String, ForeignKey, DateTime, Integer, Float
from sqlalchemy.dialects.postgresql import UUID
import uuid
from datetime import datetime
from app.core.database import Base

class AffiliateLink(Base):
    __tablename__ = "affiliate_links"
    
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    affiliate_id = Column(UUID(as_uuid=True), ForeignKey("users.id"), nullable=False)
    slug = Column(String, unique=True, index=True)
    target_url = Column(String)
    campaign_name = Column(String)
    created_at = Column(DateTime, default=datetime.utcnow)

class ClickEvent(Base):
    __tablename__ = "click_events"
    
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    link_id = Column(UUID(as_uuid=True), ForeignKey("affiliate_links.id"), nullable=False)
    ip_address = Column(String)
    geo_lat = Column(Float, nullable=True)
    geo_lng = Column(Float, nullable=True)
    timestamp = Column(DateTime, default=datetime.utcnow)
