"""
User schemas
"""

from pydantic import BaseModel, EmailStr, Field
from typing import Optional
from datetime import datetime


class UserBase(BaseModel):
    """Base user schema"""
    email: EmailStr
    username: str = Field(..., min_length=3, max_length=50)
    full_name: Optional[str] = None
    bio: Optional[str] = None
    avatar_url: Optional[str] = None


class UserCreate(UserBase):
    """Schema for user registration"""
    password: str = Field(..., min_length=8)


class UserUpdate(BaseModel):
    """Schema for user update"""
    full_name: Optional[str] = None
    bio: Optional[str] = None
    avatar_url: Optional[str] = None


class UserResponse(UserBase):
    """Schema for user response"""
    id: int
    is_active: bool
    is_superuser: bool
    created_at: datetime
    updated_at: Optional[datetime] = None
    
    class Config:
        from_attributes = True


class UserLogin(BaseModel):
    """Schema for user login"""
    email: EmailStr
    password: str


class Token(BaseModel):
    """Schema for JWT token response"""
    access_token: str
    refresh_token: str
    token_type: str = "bearer"


class TokenData(BaseModel):
    """Schema for token payload"""
    user_id: Optional[int] = None
    email: Optional[str] = None
