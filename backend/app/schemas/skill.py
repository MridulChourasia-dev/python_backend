"""
Skill schemas
"""

from pydantic import BaseModel, Field
from typing import Optional
from datetime import datetime
from app.models.skill import SkillLevel


class SkillBase(BaseModel):
    """Base skill schema"""
    name: str = Field(..., min_length=1, max_length=100)
    category: Optional[str] = None
    level: SkillLevel = SkillLevel.BEGINNER
    target_level: Optional[SkillLevel] = None
    description: Optional[str] = None


class SkillCreate(SkillBase):
    """Schema for creating a skill"""
    pass


class SkillUpdate(BaseModel):
    """Schema for updating a skill"""
    name: Optional[str] = None
    category: Optional[str] = None
    level: Optional[SkillLevel] = None
    target_level: Optional[SkillLevel] = None
    description: Optional[str] = None
    hours_invested: Optional[int] = None


class SkillResponse(SkillBase):
    """Schema for skill response"""
    id: int
    user_id: int
    hours_invested: int
    created_at: datetime
    updated_at: Optional[datetime] = None
    
    class Config:
        from_attributes = True
