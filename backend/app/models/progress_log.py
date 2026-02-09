"""
Progress Log model
"""

from sqlalchemy import Column, Integer, String, Text, ForeignKey, DateTime, Date
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.core.database import Base


class ProgressLog(Base):
    """Daily progress logging model"""
    
    __tablename__ = "progress_logs"
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    date = Column(Date, nullable=False, index=True)
    title = Column(String, nullable=False)
    description = Column(Text, nullable=True)
    hours_spent = Column(Integer, default=0)  # Minutes spent
    mood = Column(String, nullable=True)  # e.g., "productive", "struggling", "motivated"
    tags = Column(String, nullable=True)  # Comma-separated tags
    
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
    
    # Relationships
    user = relationship("User", back_populates="progress_logs")
    
    def __repr__(self):
        return f"<ProgressLog {self.date} - {self.title}>"
