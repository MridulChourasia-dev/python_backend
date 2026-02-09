"""
Progress log schemas
"""

from pydantic import BaseModel, Field
from typing import Optional
from datetime import datetime, date


class ProgressLogBase(BaseModel):
    """Base progress log schema"""
    date: date
    title: str = Field(..., min_length=1, max_length=200)
    description: Optional[str] = None
    hours_spent: int = Field(default=0, ge=0)
    mood: Optional[str] = None
    tags: Optional[str] = None


class ProgressLogCreate(ProgressLogBase):
    """Schema for creating a progress log"""
    pass


class ProgressLogUpdate(BaseModel):
    """Schema for updating a progress log"""
    title: Optional[str] = None
    description: Optional[str] = None
    hours_spent: Optional[int] = None
    mood: Optional[str] = None
    tags: Optional[str] = None


class ProgressLogResponse(ProgressLogBase):
    """Schema for progress log response"""
    id: int
    user_id: int
    created_at: datetime
    updated_at: Optional[datetime] = None
    
    class Config:
        from_attributes = True
