"""
SkillSphere FastAPI Application
Main entry point for the backend API
"""

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager

from app.core.config import settings
from app.core.database import engine
from app.models import base  # Import all models
from app.api import auth, users, skills, projects, milestones, progress, ai_feedback


@asynccontextmanager
async def lifespan(app: FastAPI):
    """Lifespan events for startup and shutdown"""
    # Startup
    print("🚀 Starting SkillSphere API...")
    print(f"📊 Database: {settings.DATABASE_URL.split('@')[1] if '@' in settings.DATABASE_URL else 'configured'}")
    print(f"🔴 Redis: {settings.REDIS_URL}")
    
    # Create tables
    base.Base.metadata.create_all(bind=engine)
    print("✅ Database tables created (if not present)")
    
    yield
    
    # Shutdown
    print("👋 Shutting down SkillSphere API...")


# Create FastAPI app
app = FastAPI(
    title="SkillSphere API",
    description="AI-Powered Learning & Project Tracker",
    version="1.0.0",
    docs_url="/docs",
    redoc_url="/redoc",
    lifespan=lifespan
)

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,
    allow_credentials=True if settings.CORS_ORIGINS != ["*"] else False, # Fix for Render '*' origins
    allow_methods=["*"],
    allow_headers=["*"],
)



# Include routers
app.include_router(auth.router, prefix="/api/auth", tags=["Authentication"])
app.include_router(users.router, prefix="/api/users", tags=["Users"])
app.include_router(skills.router, prefix="/api/skills", tags=["Skills"])
app.include_router(projects.router, prefix="/api/projects", tags=["Projects"])
app.include_router(milestones.router, prefix="/api/milestones", tags=["Milestones"])
app.include_router(progress.router, prefix="/api/progress", tags=["Progress Logs"])
app.include_router(ai_feedback.router, prefix="/api/ai-feedback", tags=["AI Feedback"])


@app.get("/")
async def root():
    """Root endpoint"""
    return {
        "message": "Welcome to SkillSphere API",
        "version": "1.0.0",
        "docs": "/docs",
        "status": "operational"
    }


@app.get("/health")
async def health_check():
    """Health check endpoint"""
    return {
        "status": "healthy",
        "environment": settings.ENVIRONMENT
    }
