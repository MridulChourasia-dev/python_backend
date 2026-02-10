"""
Skill model
"""

from sqlalchemy import Column, Integer, String, Enum, ForeignKey, DateTime
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
import enum
from app.core.database import Base


class Skill(Base):
    """Skill tracking model"""
    
    __tablename__ = "skills"
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    name = Column(String, nullable=False)  # e.g., "Python", "Machine Learning"
    category = Column(String, nullable=True)  # e.g., "Programming", "Data Science"
    current_level = Column(Integer, default=0)
    target_level = Column(Integer, nullable=True)
    description = Column(String, nullable=True)
    hours_invested = Column(Integer, default=0)
    
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
    
    # Relationships
    user = relationship("User", back_populates="skills")
    
    def __repr__(self):
        return f"<Skill {self.name} - {self.current_level}>"
