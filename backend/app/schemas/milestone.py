"""
Milestone schemas
"""

from pydantic import BaseModel, Field
from typing import Optional
from datetime import datetime, date


class MilestoneBase(BaseModel):
    """Base milestone schema"""
    title: str = Field(..., min_length=1, max_length=200)
    description: Optional[str] = None
    due_date: Optional[date] = None
    order: int = 0


class MilestoneCreate(MilestoneBase):
    """Schema for creating a milestone"""
    project_id: int


class MilestoneUpdate(BaseModel):
    """Schema for updating a milestone"""
    title: Optional[str] = None
    description: Optional[str] = None
    is_completed: Optional[bool] = None
    due_date: Optional[date] = None
    order: Optional[int] = None


class MilestoneResponse(MilestoneBase):
    """Schema for milestone response"""
    id: int
    project_id: int
    is_completed: bool
    completed_date: Optional[date] = None
    created_at: datetime
    updated_at: Optional[datetime] = None
    
    class Config:
        from_attributes = True
