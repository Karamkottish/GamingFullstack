from sqlalchemy import Column, String, Boolean, DateTime, Enum as SqlEnum, ForeignKey
from sqlalchemy.orm import relationship
from sqlalchemy.dialects.postgresql import UUID
import uuid
from datetime import datetime
from app.core.database import Base
import enum

class UserRole(str, enum.Enum):
    ADMIN = "ADMIN"
    AGENT = "AGENT"
    AFFILIATE = "AFFILIATE"
    USER = "USER"

class User(Base):
    __tablename__ = "users"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    email = Column(String, unique=True, index=True, nullable=False)
    hashed_password = Column(String, nullable=False)
    role = Column(SqlEnum(UserRole), default=UserRole.USER, nullable=False)
    
    first_name = Column(String, nullable=True)
    last_name = Column(String, nullable=True)
    telegram_id = Column(String, nullable=True)
    phone_number = Column(String, nullable=True)
    
    # Hierarchy
    agent_id = Column(UUID(as_uuid=True), ForeignKey("users.id"), nullable=True)
    
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    
    # Relationships
    wallet = relationship("Wallet", back_populates="user", uselist=False)
    agent = relationship("User", remote_side=[id], backref="referred_users")
    commissions = relationship("Commission", back_populates="agent", foreign_keys="[Commission.agent_id]")
    affiliate_links = relationship("AffiliateLink", back_populates="user")
    
    @property
    def full_name(self):
        return f"{self.first_name} {self.last_name}".strip()
