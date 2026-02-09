"""
AI Feedback schemas
"""

from pydantic import BaseModel, Field
from typing import Optional
from datetime import datetime


class AIFeedbackBase(BaseModel):
    """Base AI feedback schema"""
    feedback_type: str
    title: str = Field(..., min_length=1, max_length=200)
    content: str
    extra_data: Optional[str] = None


class AIFeedbackCreate(AIFeedbackBase):
    """Schema for creating AI feedback"""
    pass


class AIFeedbackResponse(AIFeedbackBase):
    """Schema for AI feedback response"""
    id: int
    user_id: int
    created_at: datetime
    
    class Config:
        from_attributes = True
