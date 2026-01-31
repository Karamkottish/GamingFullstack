from sqlalchemy import Column, String, ForeignKey, Numeric, DateTime, Enum as SqlEnum
from sqlalchemy.dialects.postgresql import UUID
import uuid
from datetime import datetime
from app.core.database import Base

class Commission(Base):
    __tablename__ = "commissions"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    agent_id = Column(UUID(as_uuid=True), ForeignKey("users.id"), nullable=False)
    source_user_id = Column(UUID(as_uuid=True), ForeignKey("users.id"), nullable=True) # User who generated revenue
    amount = Column(Numeric(18, 2), nullable=False)
    type = Column(String, default="REVENUE_SHARE")
    created_at = Column(DateTime, default=datetime.utcnow)
    status = Column(String, default="PAID")
