from pydantic import BaseModel
from typing import List, Optional
from datetime import datetime
from uuid import UUID

class AffiliateStats(BaseModel):
    total_clicks: int
    registrations: int
    ftd_count: int
    total_revenue: float

class PerformancePoint(BaseModel):
    name: str # Date or time
    clicks: int
    conversions: int

class CreateLinkRequest(BaseModel):
    target_url: str
    campaign_name: str

class LinkResponse(BaseModel):
    short_link: str

class PayoutLog(BaseModel):
    id: UUID
    amount: float
    method: str
    status: str
    date: datetime
