"""
Base model imports - ensures all models are imported for Alembic
"""

from app.core.database import Base
from app.models.user import User
from app.models.skill import Skill
from app.models.project import Project
from app.models.milestone import Milestone
from app.models.progress_log import ProgressLog
from app.models.ai_feedback import AIFeedback

__all__ = ["Base", "User", "Skill", "Project", "Milestone", "ProgressLog", "AIFeedback"]
