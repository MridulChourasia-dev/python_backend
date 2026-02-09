"""
Skills API routes
"""

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List

from app.core.database import get_db
from app.models.user import User
from app.models.skill import Skill
from app.schemas.skill import SkillCreate, SkillUpdate, SkillResponse
from app.api.auth import get_current_user

router = APIRouter()


@router.get("/", response_model=List[SkillResponse])
def get_skills(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Get all skills for current user"""
    skills = db.query(Skill).filter(Skill.user_id == current_user.id).all()
    return skills


@router.post("/", response_model=SkillResponse, status_code=status.HTTP_201_CREATED)
def create_skill(
    skill_data: SkillCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Create a new skill"""
    new_skill = Skill(**skill_data.dict(), user_id=current_user.id)
    db.add(new_skill)
    db.commit()
    db.refresh(new_skill)
    return new_skill


@router.get("/{skill_id}", response_model=SkillResponse)
def get_skill(
    skill_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Get skill by ID"""
    skill = db.query(Skill).filter(
        Skill.id == skill_id,
        Skill.user_id == current_user.id
    ).first()
    
    if not skill:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Skill not found"
        )
    return skill


@router.put("/{skill_id}", response_model=SkillResponse)
def update_skill(
    skill_id: int,
    skill_update: SkillUpdate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Update a skill"""
    skill = db.query(Skill).filter(
        Skill.id == skill_id,
        Skill.user_id == current_user.id
    ).first()
    
    if not skill:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Skill not found"
        )
    
    for field, value in skill_update.dict(exclude_unset=True).items():
        setattr(skill, field, value)
    
    db.commit()
    db.refresh(skill)
    return skill


@router.delete("/{skill_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_skill(
    skill_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Delete a skill"""
    skill = db.query(Skill).filter(
        Skill.id == skill_id,
        Skill.user_id == current_user.id
    ).first()
    
    if not skill:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Skill not found"
        )
    
    db.delete(skill)
    db.commit()
    return None
