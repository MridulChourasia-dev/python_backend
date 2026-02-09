"""
Milestones API routes
"""

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from datetime import date

from app.core.database import get_db
from app.models.user import User
from app.models.milestone import Milestone
from app.models.project import Project
from app.schemas.milestone import MilestoneCreate, MilestoneUpdate, MilestoneResponse
from app.api.auth import get_current_user

router = APIRouter()


@router.post("/", response_model=MilestoneResponse, status_code=status.HTTP_201_CREATED)
def create_milestone(
    milestone_data: MilestoneCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Create a new milestone"""
    # Verify project belongs to user
    project = db.query(Project).filter(
        Project.id == milestone_data.project_id,
        Project.user_id == current_user.id
    ).first()
    
    if not project:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Project not found"
        )
    
    new_milestone = Milestone(**milestone_data.dict())
    db.add(new_milestone)
    db.commit()
    db.refresh(new_milestone)
    return new_milestone


@router.get("/{milestone_id}", response_model=MilestoneResponse)
def get_milestone(
    milestone_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Get milestone by ID"""
    milestone = db.query(Milestone).join(Project).filter(
        Milestone.id == milestone_id,
        Project.user_id == current_user.id
    ).first()
    
    if not milestone:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Milestone not found"
        )
    return milestone


@router.put("/{milestone_id}", response_model=MilestoneResponse)
def update_milestone(
    milestone_id: int,
    milestone_update: MilestoneUpdate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Update a milestone"""
    milestone = db.query(Milestone).join(Project).filter(
        Milestone.id == milestone_id,
        Project.user_id == current_user.id
    ).first()
    
    if not milestone:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Milestone not found"
        )
    
    for field, value in milestone_update.dict(exclude_unset=True).items():
        setattr(milestone, field, value)
    
    # Set completed date if marking as completed
    if milestone_update.is_completed and not milestone.is_completed:
        milestone.completed_date = date.today()
    
    db.commit()
    db.refresh(milestone)
    return milestone


@router.delete("/{milestone_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_milestone(
    milestone_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Delete a milestone"""
    milestone = db.query(Milestone).join(Project).filter(
        Milestone.id == milestone_id,
        Project.user_id == current_user.id
    ).first()
    
    if not milestone:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Milestone not found"
        )
    
    db.delete(milestone)
    db.commit()
    return None
