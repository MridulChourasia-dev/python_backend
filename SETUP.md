# 🚀 SkillSphere - Quick Start Guide

## Prerequisites

Before you begin, ensure you have the following installed:
- **Docker** & **Docker Compose** (v20.10+)
- **Node.js** 18+ (for local frontend development)
- **Python** 3.11+ (for local backend development)
- **Git**

---

## 🐳 Quick Start with Docker (Recommended)

### 1. Clone the Repository

```bash
git clone <your-repo-url>
cd skillsphere
```

### 2. Set Up Environment Variables

```bash
# Copy the example env file
copy .env.example .env

# Edit .env and update values if needed
```

### 3. Start All Services

```bash
docker-compose up --build
```

This will start:
- **PostgreSQL** on port 5432
- **Redis** on port 6379
- **Backend API** on port 8000
- **Frontend** on port 3000

### 4. Access the Application

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:8000
- **API Docs**: http://localhost:8000/docs
- **ReDoc**: http://localhost:8000/redoc

---

## 💻 Local Development Setup

### Backend Setup

```bash
cd backend

# Create virtual environment
python -m venv venv

# Activate virtual environment
# Windows:
venv\Scripts\activate
# Linux/Mac:
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Run database migrations
alembic upgrade head

# Start the server
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

### Frontend Setup

```bash
cd frontend

# Install dependencies
npm install

# Start development server
npm run dev
```

---

## 🗄️ Database Setup

### Run Migrations

```bash
cd backend

# Create a new migration (after model changes)
alembic revision --autogenerate -m "description"

# Apply migrations
alembic upgrade head

# Rollback last migration
alembic downgrade -1
```

### Access PostgreSQL

```bash
# Using Docker
docker exec -it skillsphere_postgres psql -U skillsphere -d skillsphere_db

# Or use a GUI tool like pgAdmin, DBeaver, or TablePlus
# Host: localhost
# Port: 5432
# Database: skillsphere_db
# Username: skillsphere
# Password: skillsphere_dev_2026
```

---

## 🧪 Testing

### Backend Tests

```bash
cd backend
pytest
```

### Frontend Tests

```bash
cd frontend
npm test
```

---

## 📝 API Documentation

Once the backend is running, visit:
- **Swagger UI**: http://localhost:8000/docs
- **ReDoc**: http://localhost:8000/redoc

### Example API Calls

#### Register a User
```bash
curl -X POST "http://localhost:8000/api/auth/register" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "username": "testuser",
    "password": "password123",
    "full_name": "Test User"
  }'
```

#### Login
```bash
curl -X POST "http://localhost:8000/api/auth/login" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123"
  }'
```

---

## 🔧 Troubleshooting

### Port Already in Use

If you get a "port already in use" error:

```bash
# Windows - Kill process on port 8000
netstat -ano | findstr :8000
taskkill /PID <PID> /F

# Linux/Mac
lsof -ti:8000 | xargs kill -9
```

### Database Connection Issues

```bash
# Check if PostgreSQL is running
docker ps

# View PostgreSQL logs
docker logs skillsphere_postgres

# Restart PostgreSQL
docker-compose restart postgres
```

### Frontend Not Loading

```bash
# Clear Next.js cache
cd frontend
rm -rf .next
npm run dev
```

---

## 🚀 Deployment

### Production Build

```bash
# Backend
cd backend
# Update .env with production values
# Use a production WSGI server like Gunicorn

# Frontend
cd frontend
npm run build
npm start
```

### Deploy to Cloud

**Recommended Platforms**:
- **Railway** (Easiest)
- **DigitalOcean App Platform**
- **AWS ECS**
- **Google Cloud Run**
- **Heroku**

---

## 📚 Project Structure

```
skillsphere/
├── backend/
│   ├── app/
│   │   ├── api/          # API routes
│   │   ├── core/         # Config, security, database
│   │   ├── models/       # SQLAlchemy models
│   │   ├── schemas/      # Pydantic schemas
│   │   └── main.py       # FastAPI app
│   ├── alembic/          # Database migrations
│   ├── tests/            # Backend tests
│   └── requirements.txt
├── frontend/
│   ├── app/              # Next.js pages
│   ├── components/       # React components
│   ├── lib/              # Utilities & API client
│   └── package.json
├── docker-compose.yml
└── README.md
```

---

## 🎯 Next Steps

1. ✅ Complete the setup
2. 📖 Read the [BUILD_PLAN.md](BUILD_PLAN.md)
3. 🧑‍💻 Start coding!
4. 🧪 Write tests
5. 🚀 Deploy to production

---

## 💬 Need Help?

- Check the [BUILD_PLAN.md](BUILD_PLAN.md) for detailed roadmap
- Review API docs at http://localhost:8000/docs
- Open an issue on GitHub

---

**Happy Coding! 🚀**
