"""
Project schemas
"""

from pydantic import BaseModel, Field
from typing import Optional, List
from datetime import datetime, date
from app.models.project import ProjectStatus


class MilestoneBase(BaseModel):
    """Base milestone schema"""
    title: str
    description: Optional[str] = None
    due_date: Optional[date] = None


class MilestoneResponse(MilestoneBase):
    """Milestone response schema"""
    id: int
    project_id: int
    is_completed: bool
    order: int
    completed_date: Optional[date] = None
    created_at: datetime
    
    class Config:
        from_attributes = True


class ProjectBase(BaseModel):
    """Base project schema"""
    title: str = Field(..., min_length=1, max_length=200)
    description: Optional[str] = None
    status: ProjectStatus = ProjectStatus.PLANNING
    github_url: Optional[str] = None
    demo_url: Optional[str] = None
    tags: Optional[str] = None
    start_date: Optional[date] = None
    target_end_date: Optional[date] = None


class ProjectCreate(ProjectBase):
    """Schema for creating a project"""
    pass


class ProjectUpdate(BaseModel):
    """Schema for updating a project"""
    title: Optional[str] = None
    description: Optional[str] = None
    status: Optional[ProjectStatus] = None
    github_url: Optional[str] = None
    demo_url: Optional[str] = None
    tags: Optional[str] = None
    start_date: Optional[date] = None
    target_end_date: Optional[date] = None
    completed_date: Optional[date] = None


class ProjectResponse(ProjectBase):
    """Schema for project response"""
    id: int
    user_id: int
    completed_date: Optional[date] = None
    created_at: datetime
    updated_at: Optional[datetime] = None
    milestones: List[MilestoneResponse] = []
    
    class Config:
        from_attributes = True
