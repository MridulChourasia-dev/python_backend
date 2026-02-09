# 🚀 SkillSphere – AI-Powered Learning & Project Tracker

A **production-grade full-stack project** using **Python (Backend)**, **Next.js (Frontend)**, **PostgreSQL**, **Docker**, and **Web Containers**.

## 🌟 What is SkillSphere?

SkillSphere is a **developer learning & project management platform** where users:

* Track skills they are learning (Python, ML, Web, etc.)
* Create projects and milestones
* Log daily progress
* Get **AI-generated feedback & summaries**
* View analytics & streaks

Think **Notion + GitHub Projects + Duolingo streaks**, but developer-focused.

---

## 🧠 Key Features

✔ Microservice-ready backend architecture  
✔ JWT authentication & role-based access  
✔ Async background tasks  
✔ PostgreSQL relational modeling  
✔ Dockerized full environment  
✔ Modern Next.js UI with dashboards  
✔ API documentation & testing  

---

## 🧱 Tech Stack

### Backend (Python)
* **FastAPI** (high-performance async API)
* **SQLAlchemy + Alembic** (ORM & migrations)
* **PostgreSQL** (relational DB)
* **Redis** (caching & background jobs)
* **Celery / BackgroundTasks** (async processing)
* **JWT Authentication**

### Frontend (Next.js)
* **Next.js 14 (App Router)**
* **TypeScript**
* **Tailwind CSS + ShadCN UI**
* **Charts (Recharts)**
* **Server Actions & API Routes**

### DevOps
* **Docker & Docker Compose**
* **NGINX (optional)**

---

## 📐 System Architecture

```
[ Next.js Frontend ]
        |
        | REST / JSON
        v
[ FastAPI Backend ]
        |
        | SQLAlchemy ORM
        v
[ PostgreSQL Database ]
        |
        v
[ Redis + Background Workers ]
```

---

## 🚀 Quick Start

### Prerequisites
- Docker & Docker Compose
- Node.js 18+ (for local frontend development)
- Python 3.11+ (for local backend development)

### Run with Docker

```bash
docker-compose up --build
```

Services will be available at:
- Frontend: http://localhost:3000
- Backend API: http://localhost:8000
- API Docs: http://localhost:8000/docs
- PostgreSQL: localhost:5432
- Redis: localhost:6379

---

## 🗂️ Project Structure

```
skillsphere/
├── backend/              # FastAPI backend
│   ├── app/
│   │   ├── main.py
│   │   ├── core/         # Config, security, dependencies
│   │   ├── models/       # SQLAlchemy models
│   │   ├── schemas/      # Pydantic schemas
│   │   ├── api/          # API routes
│   │   ├── services/     # Business logic
│   │   └── workers/      # Background tasks
│   ├── tests/
│   ├── alembic/          # Database migrations
│   ├── requirements.txt
│   └── Dockerfile
├── frontend/             # Next.js frontend
│   ├── app/              # App router pages
│   ├── components/       # React components
│   ├── lib/              # Utilities
│   ├── public/           # Static assets
│   └── package.json
├── docker-compose.yml
└── README.md
```

---

## 🗄️ Database Schema

Core tables:
- **users** - User accounts
- **skills** - Skills being tracked
- **projects** - User projects
- **milestones** - Project milestones
- **progress_logs** - Daily progress entries
- **ai_feedback** - AI-generated insights

---

## 🔐 Authentication

JWT-based authentication with:
- User registration & login
- Access & refresh tokens
- Protected routes
- Role-based access control

---

## 📚 API Documentation

FastAPI auto-generated interactive docs:
- Swagger UI: http://localhost:8000/docs
- ReDoc: http://localhost:8000/redoc

---

## 🧪 Testing

### Backend
```bash
cd backend
pytest
```

### Frontend
```bash
cd frontend
npm test
```

---

## 🎨 Frontend Features

* 🔐 Auth pages (Login / Signup)
* 📊 Dashboard (skills, progress, streaks)
* 📁 Project boards with milestones
* 📈 Analytics charts
* 🌙 Dark mode
* ⚡ Fast loading with Server Components

---

## 🤖 AI Features

* Daily progress summary generation
* Skill improvement suggestions
* Project feedback & recommendations

---

## 🚀 Future Enhancements

* Team collaboration
* Public portfolios
* GitHub integration
* Notifications & reminders
* Mobile app

---

## 🧑💻 Author

**Mridul Chourasia**  
Full-Stack Developer | Python | Next.js

---

## 📄 License

MIT License
