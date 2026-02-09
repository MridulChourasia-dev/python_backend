"""
Progress logs API routes
"""

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from datetime import date, timedelta

from app.core.database import get_db
from app.models.user import User
from app.models.progress_log import ProgressLog
from app.schemas.progress_log import ProgressLogCreate, ProgressLogUpdate, ProgressLogResponse
from app.api.auth import get_current_user

router = APIRouter()


@router.get("/", response_model=List[ProgressLogResponse])
def get_progress_logs(
    skip: int = 0,
    limit: int = 100,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Get all progress logs for current user"""
    logs = db.query(ProgressLog).filter(
        ProgressLog.user_id == current_user.id
    ).order_by(ProgressLog.date.desc()).offset(skip).limit(limit).all()
    return logs


@router.get("/recent", response_model=List[ProgressLogResponse])
def get_recent_progress_logs(
    days: int = 7,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Get recent progress logs (last N days)"""
    start_date = date.today() - timedelta(days=days)
    logs = db.query(ProgressLog).filter(
        ProgressLog.user_id == current_user.id,
        ProgressLog.date >= start_date
    ).order_by(ProgressLog.date.desc()).all()
    return logs


@router.post("/", response_model=ProgressLogResponse, status_code=status.HTTP_201_CREATED)
def create_progress_log(
    log_data: ProgressLogCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Create a new progress log"""
    new_log = ProgressLog(**log_data.dict(), user_id=current_user.id)
    db.add(new_log)
    db.commit()
    db.refresh(new_log)
    return new_log


@router.get("/{log_id}", response_model=ProgressLogResponse)
def get_progress_log(
    log_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Get progress log by ID"""
    log = db.query(ProgressLog).filter(
        ProgressLog.id == log_id,
        ProgressLog.user_id == current_user.id
    ).first()
    
    if not log:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Progress log not found"
        )
    return log


@router.put("/{log_id}", response_model=ProgressLogResponse)
def update_progress_log(
    log_id: int,
    log_update: ProgressLogUpdate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Update a progress log"""
    log = db.query(ProgressLog).filter(
        ProgressLog.id == log_id,
        ProgressLog.user_id == current_user.id
    ).first()
    
    if not log:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Progress log not found"
        )
    
    for field, value in log_update.dict(exclude_unset=True).items():
        setattr(log, field, value)
    
    db.commit()
    db.refresh(log)
    return log


@router.delete("/{log_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_progress_log(
    log_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Delete a progress log"""
    log = db.query(ProgressLog).filter(
        ProgressLog.id == log_id,
        ProgressLog.user_id == current_user.id
    ).first()
    
    if not log:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Progress log not found"
        )
    
    db.delete(log)
    db.commit()
    return None
