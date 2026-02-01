from sqlalchemy import Column, String, ForeignKey, DateTime, Integer, Float, Numeric, Enum as SqlEnum
from sqlalchemy.dialects.postgresql import UUID
import uuid
from datetime import datetime
from app.core.database import Base
from decimal import Decimal

from sqlalchemy.orm import relationship

class AffiliateLink(Base):
    __tablename__ = "affiliate_links"
    
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    affiliate_id = Column(UUID(as_uuid=True), ForeignKey("users.id"), nullable=False, index=True)
    slug = Column(String, unique=True, index=True, nullable=False)
    target_url = Column(String, nullable=False)
    campaign_name = Column(String, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow, index=True)
    is_active = Column(Integer, default=1)  # Soft delete

    # Relationships
    user = relationship("User", back_populates="affiliate_links")
    clicks = relationship("ClickEvent", back_populates="link", cascade="all, delete-orphan")
    conversions = relationship("Conversion", back_populates="link", cascade="all, delete-orphan")

class ClickEvent(Base):
    __tablename__ = "click_events"
    
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    link_id = Column(UUID(as_uuid=True), ForeignKey("affiliate_links.id"), nullable=False, index=True)
    ip_address = Column(String, index=True)
    user_agent = Column(String, nullable=True)
    geo_lat = Column(Float, nullable=True)
    geo_lng = Column(Float, nullable=True)
    geo_country = Column(String, nullable=True)
    timestamp = Column(DateTime, default=datetime.utcnow, index=True)

    # Relationships
    link = relationship("AffiliateLink", back_populates="clicks")

class Conversion(Base):
    """Tracks user registrations and deposits from affiliate links"""
    __tablename__ = "conversions"
    
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    link_id = Column(UUID(as_uuid=True), ForeignKey("affiliate_links.id"), nullable=False, index=True)
    user_id = Column(UUID(as_uuid=True), ForeignKey("users.id"), nullable=True, index=True)
    conversion_type = Column(String, nullable=False)  # 'REGISTRATION' or 'FIRST_DEPOSIT'
    amount = Column(Numeric(18, 2), nullable=True)  # Deposit amount if FTD
    commission_earned = Column(Numeric(18, 2), default=Decimal("0"))  # CPA or RevShare
    created_at = Column(DateTime, default=datetime.utcnow, index=True)

    # Relationships
    link = relationship("AffiliateLink", back_populates="conversions")
    user = relationship("User", foreign_keys=[user_id])

class AffiliatePayout(Base):
    """Tracks affiliate withdrawal requests"""
    __tablename__ = "affiliate_payouts"
    
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    affiliate_id = Column(UUID(as_uuid=True), ForeignKey("users.id"), nullable=False, index=True)
    amount = Column(Numeric(18, 2), nullable=False)
    method = Column(String, nullable=False)  # BANK, CRYPTO, USDT
    destination = Column(String, nullable=True)  # Wallet address or bank details
    status = Column(String, default="PENDING", index=True)  # PENDING, APPROVED, REJECTED
    requested_at = Column(DateTime, default=datetime.utcnow, index=True)
    processed_at = Column(DateTime, nullable=True)
    rejection_reason = Column(String, nullable=True)

    # Relationships
    affiliate = relationship("User", foreign_keys=[affiliate_id])
