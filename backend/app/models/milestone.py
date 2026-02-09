"""
Milestone model
"""

from sqlalchemy import Column, Integer, String, Text, Boolean, ForeignKey, DateTime, Date
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.core.database import Base


class Milestone(Base):
    """Project milestone model"""
    
    __tablename__ = "milestones"
    
    id = Column(Integer, primary_key=True, index=True)
    project_id = Column(Integer, ForeignKey("projects.id"), nullable=False)
    title = Column(String, nullable=False)
    description = Column(Text, nullable=True)
    is_completed = Column(Boolean, default=False)
    order = Column(Integer, default=0)  # For ordering milestones
    
    due_date = Column(Date, nullable=True)
    completed_date = Column(Date, nullable=True)
    
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
    
    # Relationships
    project = relationship("Project", back_populates="milestones")
    
    def __repr__(self):
        return f"<Milestone {self.title} - {'✓' if self.is_completed else '○'}>"
