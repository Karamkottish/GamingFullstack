from sqlalchemy import Column, String, ForeignKey, Numeric, DateTime, Enum as SqlEnum, Boolean
from sqlalchemy.dialects import postgresql
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship
import uuid
from datetime import datetime
from app.core.database import Base
import enum
from decimal import Decimal

class TransactionType(str, enum.Enum):
    DEPOSIT = "DEPOSIT"
    WITHDRAWAL = "WITHDRAWAL"
    WAGER = "WAGER"
    WIN = "WIN"
    COMMISSION = "COMMISSION"

class Wallet(Base):
    __tablename__ = "wallets"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id = Column(UUID(as_uuid=True), ForeignKey("users.id"), unique=True, nullable=False)
    balance = Column(Numeric(18, 2), default=0.00)
    currency = Column(String, default="USD")
    is_frozen = Column(Boolean, default=False)
    
    # Relationships
    user = relationship("User", back_populates="wallet")
    transactions = relationship("Transaction", back_populates="wallet")

class Transaction(Base):
    __tablename__ = "transactions"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    wallet_id = Column(UUID(as_uuid=True), ForeignKey("wallets.id"), nullable=False)
    amount = Column(Numeric(18, 2), nullable=False)
    type = Column(SqlEnum(TransactionType), nullable=False)
    status = Column(String, default="PENDING") # PENDING, COMPLETED, FAILED
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    tx_metadata = Column(postgresql.JSONB, nullable=True) # Store additional info like rejection reason, payment details

    # Relationships
    wallet = relationship("Wallet", back_populates="transactions")

    @property
    def balance_before(self) -> Decimal:
        if not self.tx_metadata: return Decimal("0")
        return Decimal(str(self.tx_metadata.get("balance_before", "0")))

    @property
    def balance_after(self) -> Decimal:
        if not self.tx_metadata: return Decimal("0")
        return Decimal(str(self.tx_metadata.get("balance_after", "0")))

    @property
    def description(self) -> str | None:
        if not self.tx_metadata: return None
        return self.tx_metadata.get("description")
