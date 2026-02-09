"""
AI Feedback API routes
"""

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List

from app.core.database import get_db
from app.models.user import User
from app.models.ai_feedback import AIFeedback
from app.schemas.ai_feedback import AIFeedbackCreate, AIFeedbackResponse
from app.api.auth import get_current_user

router = APIRouter()


@router.get("/", response_model=List[AIFeedbackResponse])
def get_ai_feedbacks(
    skip: int = 0,
    limit: int = 50,
    feedback_type: str = None,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Get all AI feedbacks for current user"""
    query = db.query(AIFeedback).filter(AIFeedback.user_id == current_user.id)
    
    if feedback_type:
        query = query.filter(AIFeedback.feedback_type == feedback_type)
    
    feedbacks = query.order_by(AIFeedback.created_at.desc()).offset(skip).limit(limit).all()
    return feedbacks


@router.post("/", response_model=AIFeedbackResponse, status_code=status.HTTP_201_CREATED)
def create_ai_feedback(
    feedback_data: AIFeedbackCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Create a new AI feedback (typically called by background workers)"""
    new_feedback = AIFeedback(**feedback_data.dict(), user_id=current_user.id)
    db.add(new_feedback)
    db.commit()
    db.refresh(new_feedback)
    return new_feedback


@router.get("/{feedback_id}", response_model=AIFeedbackResponse)
def get_ai_feedback(
    feedback_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Get AI feedback by ID"""
    feedback = db.query(AIFeedback).filter(
        AIFeedback.id == feedback_id,
        AIFeedback.user_id == current_user.id
    ).first()
    
    if not feedback:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="AI feedback not found"
        )
    return feedback


@router.delete("/{feedback_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_ai_feedback(
    feedback_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Delete AI feedback"""
    feedback = db.query(AIFeedback).filter(
        AIFeedback.id == feedback_id,
        AIFeedback.user_id == current_user.id
    ).first()
    
    if not feedback:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="AI feedback not found"
        )
    
    db.delete(feedback)
    db.commit()
    return None
