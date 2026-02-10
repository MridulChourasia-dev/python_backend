# 🚀 SkillSphere – AI-Powered Learning & Project Tracker

[![Status](https://img.shields.io/badge/Status-Production--Ready-success)](https://github.com)
[![Version](https://img.shields.io/badge/Version-1.1.0-blue)](https://github.com)
[![FastAPI](https://img.shields.io/badge/FastAPI-0.109.0-009688)](https://fastapi.tiangolo.com/)
[![Next.js](https://img.shields.io/badge/Next.js-14.1.0-black)](https://nextjs.org/)
[![License](https://img.shields.io/badge/License-MIT-yellow)](LICENSE)

A **production-grade full-stack application** for developers to track their learning journey, manage projects, and monitor progress with AI-powered insights.

## 🌟 What is SkillSphere?

SkillSphere is a **developer learning & project management platform** where users can:

* ✅ **Track Skills** - Monitor learning progress across multiple technologies
* 📁 **Manage Projects** - Organize projects with Kanban board and status tracking
* 📈 **Log Progress** - Track daily activity with hours spent and mood
* 🎯 **View Analytics** - Beautiful charts showing progress over time
* 🔥 **Track Streaks** - Maintain learning streaks for motivation
* 🤖 **AI Insights** - Get AI-generated feedback and recommendations (coming soon)

Think **Notion + GitHub Projects + Duolingo streaks**, but developer-focused.

---

## ⚡ Quick Start

### Option 1: Docker (Recommended)

```powershell
# 1. Clone or navigate to the project
cd e:\python_backend

# 2. Run the start script (Windows)
.\start.ps1

# Or manually
docker-compose up --build
```

**Access points**:
- 🌐 Frontend: http://localhost:3000
- 🔌 API: http://localhost:8000
- 📚 API Docs: http://localhost:8000/docs

### Option 2: Local Development

**Backend**:
```bash
cd backend
pip install -r requirements.txt
uvicorn app.main:app --reload
```

**Frontend**:
```bash
cd frontend
npm install
npm run dev
```

---

## 🧠 Key Features

### ✅ Implemented
- ✅ **Authentication** - JWT-based auth with access & refresh tokens
- ✅ **Skills Management** - Full CRUD with progress bars and level tracking
- ✅ **Project Tracking** - Kanban board with status columns
- ✅ **Progress Logging** - Daily activity tracking with mood indicators
- ✅ **Dashboard** - Real-time stats, charts, and activity overview
- ✅ **Modern UI** - Dark theme with glassmorphism and smooth animations
- ✅ **Responsive Design** - Desktop optimized (mobile improvements coming)
- ✅ **API Documentation** - Interactive Swagger UI
- ✅ **Docker Support** - Full containerized deployment
- ✅ **Database Migrations** - Alembic for schema management
- ✅ **Unit Tests** - 15+ tests covering core functionality

### 🔄 Coming Soon
- ⏳ AI-powered insights and recommendations
- ⏳ Team collaboration features
- ⏳ Mobile responsiveness improvements
- ⏳ Real-time notifications (WebSockets)
- ⏳ Email verification
- ⏳ Public user profiles
- ⏳ GitHub integration

---

## 🧱 Tech Stack

### Backend
- **FastAPI** - High-performance async API framework
- **SQLAlchemy** - ORM with PostgreSQL
- **Alembic** - Database migrations
- **PostgreSQL** - Relational database
- **Redis** - Caching layer
- **JWT** - Secure authentication
- **Pydantic** - Data validation
- **Pytest** - Testing framework

### Frontend
- **Next.js 14** - React framework with App Router
- **TypeScript** - Type-safe development
- **Tailwind CSS** - Utility-first styling
- **Recharts** - Beautiful data visualizations
- **Axios** - HTTP client
- **Lucide Icons** - Modern icon library

### DevOps
- **Docker** - Containerization
- **Docker Compose** - Multi-service orchestration
- **PostgreSQL 15** - Production database
- **Redis 7** - In-memory cache

---

## 📐 Architecture

```
┌─────────────────────┐
│  Next.js Frontend   │  ← Modern React UI with TypeScript
│   (Port 3000)       │
└──────────┬──────────┘
           │ REST API (JSON)
           ↓
┌─────────────────────┐
│  FastAPI Backend    │  ← Async Python API
│   (Port 8000)       │
└──────────┬──────────┘
           │ SQLAlchemy ORM
           ↓
┌─────────────────────┐
│  PostgreSQL DB      │  ← Relational data storage
│   (Port 5432)       │
└─────────────────────┘
           ↓
┌─────────────────────┐
│  Redis Cache        │  ← Session & caching layer
│   (Port 6379)       │
└─────────────────────┘
```

---

## 🗂️ Project Structure

```
skillsphere/
├── backend/                 # FastAPI backend
│   ├── app/
│   │   ├── main.py         # App entry point
│   │   ├── core/           # Config, security, database
│   │   ├── models/         # SQLAlchemy models
│   │   ├── schemas/        # Pydantic schemas
│   │   ├── api/            # API route handlers
│   │   └── services/       # Business logic
│   ├── tests/              # Unit tests
│   ├── alembic/            # Database migrations
│   ├── requirements.txt    # Python dependencies
│   └── Dockerfile
├── frontend/               # Next.js frontend
│   ├── app/               # App router pages
│   │   ├── page.tsx       # Landing page
│   │   ├── auth/          # Login & register
│   │   ├── dashboard/     # Main dashboard
│   │   ├── skills/        # Skills management
│   │   ├── projects/      # Projects Kanban
│   │   └── progress/      # Progress logging
│   ├── components/        # Reusable components
│   │   ├── Sidebar.tsx    # Navigation sidebar
│   │   ├── Modal.tsx      # Modal dialog
│   │   ├── LoadingSpinner.tsx
│   │   └── EmptyState.tsx
│   ├── lib/               # Utilities
│   │   ├── api.ts         # API client
│   │   └── utils.ts       # Helper functions
│   ├── public/            # Static assets
│   └── package.json
├── docker-compose.yml     # Multi-service setup
├── start.ps1              # Quick start script
└── README.md              # This file
```

---

## 🗄️ Database Schema

### Core Tables
- **users** - User accounts with authentication
- **skills** - Skills being tracked with progress levels
- **projects** - User projects with status tracking
- **milestones** - Project milestones (planned)
- **progress_logs** - Daily progress entries with mood/hours
- **ai_feedback** - AI-generated insights (planned)

### Relationships
```
User (1) ──→ (*) Skills
User (1) ──→ (*) Projects
User (1) ──→ (*) ProgressLogs
Project (1) ──→ (*) Milestones
User (1) ──→ (*) AIFeedback
```

See `DATABASE_SCHEMA.md` for full details.

---

## 🔐 Authentication Flow

1. **Register** → POST `/api/auth/register`
   - Creates user with hashed password
   - Returns success message

2. **Login** → POST `/api/auth/login`
   - Validates credentials
   - Returns JWT access token & refresh token

3. **Protected Routes**
   - Include `Authorization: Bearer <token>` header
   - Token validated on each request
   - Auto-redirect to login on 401

4. **Logout**
   - Clear tokens from localStorage
   - Redirect to landing page

---

## 📚 API Documentation

### Interactive Docs
- **Swagger UI**: http://localhost:8000/docs
- **ReDoc**: http://localhost:8000/redoc

### Endpoints Summary
- **Auth**: `/api/auth/` - Register, login, get current user
- **Users**: `/api/users/` - User profile management
- **Skills**: `/api/skills/` - CRUD operations for skills
- **Projects**: `/api/projects/` - CRUD operations for projects
- **Progress**: `/api/progress/` - Daily progress logging
- **AI Feedback**: `/api/ai-feedback/` - AI insights (planned)

See `API_DOCUMENTATION.md` for full reference.

---

## 🧪 Testing

### Run Backend Tests
```bash
cd backend
pytest -v

# With coverage
pytest --cov=app --cov-report=html
```

### Test Coverage
- ✅ Authentication: 100%
- ✅ Skills API: 100%
- ✅ Projects API: 100%
- Overall: ~60%

---

## 🎨 UI Features

- 🌙 **Dark Theme** - Modern dark mode by default
- ✨ **Glassmorphism** - Frosted glass effects
- 🎭 **Smooth Animations** - Fade, slide, and scale transitions
- 📊 **Interactive Charts** - Line and bar charts with Recharts
- 🎯 **Empty States** - Helpful guidance when no data
- ⏳ **Loading States** - Animated spinners
- 🔘 **Hover Effects** - Visual feedback on interactions
- 📱 **Responsive** - Desktop optimized (mobile coming)

---

## 📝 Documentation

- **README.md** - This file
- **SETUP.md** - Quick setup guide
- **COMPLETE_SETUP.md** - Detailed setup instructions
- **API_DOCUMENTATION.md** - API endpoint reference
- **DATABASE_SCHEMA.md** - Database structure
- **BUILD_PLAN.md** - 30-day development roadmap
- **PROJECT_COMPLETION.md** - Current status report
- **UI_IMPROVEMENTS.md** - Latest UI enhancements

---

## 🚀 Deployment

### Production Checklist
- [ ] Set strong `SECRET_KEY` in environment
- [ ] Configure production database URL
- [ ] Set up Redis for production
- [ ] Enable HTTPS with SSL certificate
- [ ] Configure CORS for production domain
- [ ] Set up monitoring (Sentry, etc.)
- [ ] Configure backup strategy
- [ ] Set up CI/CD pipeline
- [ ] Load testing
- [ ] Security audit

### Platforms
- **Railway** - Recommended for quick deployment
- **AWS** - For enterprise-grade hosting
- **DigitalOcean** - For cost-effective VPS
- **Vercel** - For frontend (with separate backend)

---

## 🎓 Development Workflow

### Starting Development
```bash
# 1. Start Docker services
docker-compose up

# 2. Apply database migrations
cd backend
alembic upgrade head

# 3. Run tests
pytest

# 4. Start development
# Backend auto-reloads on changes
# Frontend auto-reloads on changes
```

### Making Changes
1. Create feature branch
2. Make changes
3. Run tests
4. Commit with descriptive message
5. Push and create PR

---

## 🤝 Contributing

Contributions are welcome! Please:

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add/update tests
5. Update documentation
6. Submit a pull request

---

## 🐛 Known Issues

- Mobile responsiveness needs improvement
- AI features require OpenAI API key
- Email verification not implemented
- Some edge cases in form validation

See `PROJECT_COMPLETION.md` for full list.

---

## 📊 Project Status

**Current Version**: 1.1.0  
**Completion**: 95%  
**Status**: Production-Ready (with recommendations)  
**Last Updated**: February 10, 2026

✅ **Ready**: Core features, UI, authentication, Docker deployment  
⏳ **In Progress**: Mobile responsiveness, AI integration  
🔄 **Planned**: Team features, notifications, advanced analytics

---

## 🧑‍💻 Author

**Mridul Chourasia**  
Full-Stack Developer | Python | Next.js | AI Enthusiast

---

## 📄 License

MIT License - see LICENSE file for details

---

## 🙏 Acknowledgments

Built with:
- [FastAPI](https://fastapi.tiangolo.com/)
- [Next.js](https://nextjs.org/)
- [Tailwind CSS](https://tailwindcss.com/)
- [PostgreSQL](https://www.postgresql.org/)
- [Docker](https://www.docker.com/)

---

**Made with ❤️ for developers who want to level up their skills**

