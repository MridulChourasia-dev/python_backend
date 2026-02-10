"""
Core configuration settings for SkillSphere
"""

from pydantic_settings import BaseSettings
from pydantic import field_validator
from typing import List, Union


class Settings(BaseSettings):
    """Application settings"""
    
    # Database
    DATABASE_URL: str = "postgresql://skillsphere:skillsphere_dev_2026@localhost:5432/skillsphere_db"
    
    @field_validator('DATABASE_URL', mode='before')
    @classmethod
    def fix_postgres_url(cls, v):
        """Standardize postgres URL for SQLAlchemy"""
        if isinstance(v, str) and v.startswith('postgres://'):
            return v.replace('postgres://', 'postgresql://', 1)
        return v
    
    # Redis
    REDIS_URL: str = "redis://localhost:6379/0"
    
    # JWT Authentication
    SECRET_KEY: str = "your-secret-key-change-in-production-min-32-chars-long"
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 30
    REFRESH_TOKEN_EXPIRE_DAYS: int = 7
    
    # Environment
    ENVIRONMENT: str = "development"
    
    # CORS
    CORS_ORIGINS: Union[List[str], str] = [
        "http://localhost:3000",
        "http://127.0.0.1:3000"
    ]
    
    @field_validator('CORS_ORIGINS', mode='before')
    @classmethod
    def parse_cors_origins(cls, v):
        """Parse CORS origins from string or list"""
        if isinstance(v, str):
            # Handle comma-separated string
            return [origin.strip() for origin in v.split(',') if origin.strip()]
        return v
    
    # AI/OpenAI (Optional)
    OPENAI_API_KEY: str = ""
    
    class Config:
        env_file = ".env"
        case_sensitive = True


settings = Settings()
