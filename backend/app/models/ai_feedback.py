"""
AI Feedback model
"""

from sqlalchemy import Column, Integer, String, Text, ForeignKey, DateTime
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.core.database import Base


class AIFeedback(Base):
    """AI-generated feedback and insights model"""
    
    __tablename__ = "ai_feedbacks"
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    feedback_type = Column(String, nullable=False)  # e.g., "daily_summary", "skill_suggestion", "project_feedback"
    title = Column(String, nullable=False)
    content = Column(Text, nullable=False)
    extra_data = Column(Text, nullable=True)  # JSON string for additional data (renamed from metadata)
    
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    
    # Relationships
    user = relationship("User", back_populates="ai_feedbacks")
    
    def __repr__(self):
        return f"<AIFeedback {self.feedback_type} - {self.title}>"
