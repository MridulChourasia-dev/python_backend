"""
Project model
"""

from sqlalchemy import Column, Integer, String, Text, Enum, ForeignKey, DateTime, Date
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
import enum
from app.core.database import Base


class ProjectStatus(str, enum.Enum):
    """Project status options"""
    PLANNING = "planning"
    IN_PROGRESS = "in_progress"
    ON_HOLD = "on_hold"
    COMPLETED = "completed"
    ARCHIVED = "archived"


class Project(Base):
    """Project tracking model"""
    
    __tablename__ = "projects"
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    title = Column(String, nullable=False)
    description = Column(Text, nullable=True)
    status = Column(Enum(ProjectStatus), default=ProjectStatus.PLANNING)
    github_url = Column(String, nullable=True)
    demo_url = Column(String, nullable=True)
    tags = Column(String, nullable=True)  # Comma-separated tags
    
    start_date = Column(Date, nullable=True)
    target_end_date = Column(Date, nullable=True)
    completed_date = Column(Date, nullable=True)
    
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
    
    # Relationships
    user = relationship("User", back_populates="projects")
    milestones = relationship("Milestone", back_populates="project", cascade="all, delete-orphan")
    
    def __repr__(self):
        return f"<Project {self.title} - {self.status}>"
