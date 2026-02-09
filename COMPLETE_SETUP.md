# 🚀 Complete Project Setup Guide

This guide will help you complete the SkillSphere project setup and get it running.

## ✅ What's Already Completed

### Backend
- ✅ Complete FastAPI application structure
- ✅ 6 database models (User, Skill, Project, Milestone, ProgressLog, AIFeedback)
- ✅ All API endpoints (31 total)
- ✅ JWT authentication
- ✅ Alembic migrations configured
- ✅ Unit tests for auth, skills, and projects

### Frontend
- ✅ Next.js 14 with TypeScript
- ✅ API client library (`lib/api.ts`)
- ✅ Utility functions (`lib/utils.ts`)
- ✅ Authentication pages (login, register)
- ✅ Dashboard page
- ✅ Skills management page (full CRUD)
- ✅ Projects management page (Kanban board)
- ✅ Progress tracking page
- ✅ Tailwind CSS with dark theme

## 🔧 Setup Steps

### 1. Environment Setup

Copy the `.env.example` to `.env` (already done):
```bash
cp .env.example .env
```

The `.env` file already contains a secure SECRET_KEY and default configuration.

### 2. Run Database Migration

To create all database tables, you need to run the Alembic migration:

```bash
cd backend
alembic revision --autogenerate -m "Initial migration with all tables"
alembic upgrade head
```

This will create the `alembic/versions/` directory with migration files.

### 3. Start the Application

#### Option A: Docker (Recommended)
```bash
docker-compose up --build
```

This starts:
- PostgreSQL database on port 5432
- Redis on port 6379
- Backend API on port 8000
- Frontend on port 3000

#### Option B: Local Development

**Backend:**
```bash
cd backend
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

**Frontend:**
```bash
cd frontend
npm install
npm run dev
```

### 4. Run Tests

```bash
cd backend
pytest -v
```

Expected output: All auth, skills, and projects tests should pass.

## 🌐 Access Points

Once running, you can access:

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:8000
- **API Docs (Swagger)**: http://localhost:8000/docs
- **API Docs (ReDoc)**: http://localhost:8000/redoc

## 🎯 Testing the Application

### 1. Register a New User
1. Go to http://localhost:3000
2. Click "Get Started Free"
3. Fill in the registration form
4. You'll be redirected to login

### 2. Login
1. Use your registered email and password
2. You'll be redirected to the dashboard

### 3. Test Features

**Skills Management** (http://localhost:3000/skills):
- Click "Add Skill" to create a new skill
- Fill in the form (name, category, current level, target level)
- View skills in a grid with progress bars
- Edit or delete skills using the icons

**Projects Management** (http://localhost:3000/projects):
- Click "New Project" to create a project
- View projects in Kanban board (Planning, Active, Completed, On Hold)
- Drag and drop between columns
- Edit or delete projects

**Progress Tracking** (http://localhost:3000/progress):
- Click "Log Progress" to add a daily log
- Enter date, title, description, hours, and mood
- View logs in a timeline grouped by date
- Delete logs as needed

### 4. Test API Directly

Using the Swagger UI (http://localhost:8000/docs):

1. **Register**: POST `/api/auth/register`
2. **Login**: POST `/api/auth/login` - Copy the `access_token`
3. **Authorize**: Click "Authorize" button, paste token as `Bearer <token>`
4. **Test endpoints**: Try creating skills, projects, etc.

## 📝 Running Unit Tests

```bash
cd backend
pytest tests/ -v

# Run specific test file
pytest tests/test_auth.py -v

# Run with coverage
pytest tests/ -v --cov=app --cov-report=html
```

## 🐛 Troubleshooting

### Database Connection Issues
- Ensure PostgreSQL is running
- Check DATABASE_URL in `.env` file
- For Docker: `docker-compose ps` to verify all services are up

### Frontend Build Errors
- Delete `node_modules` and `package-lock.json`
- Run `npm install` again
- Check Node.js version (requires Node 18+)

### CORS Errors
- Check CORS_ORIGINS in `.env`
- Ensure frontend URL matches (http://localhost:3000)

### Import Errors in Frontend
- Make sure `lib/` directory exists with `api.ts` and `utils.ts`
- Check `tsconfig.json` has correct path mappings

## 🎨 Customization

### Adding More Features

1. **AI Integration**: Add OpenAI API key to `.env`:
   ```
   OPENAI_API_KEY=your-api-key-here
   ```

2. **Email Notifications**: Configure email settings in `app/core/config.py`

3. **More Pages**: Create new pages in `frontend/app/`

### Styling
- Modify `frontend/tailwind.config.js` for theme colors
- Edit `frontend/app/globals.css` for global styles

## 🚀 Deployment

### Railway (Recommended)
1. Connect your GitHub repository
2. Add environment variables
3. Deploy backend and frontend as separate services

### Docker Deployment
```bash
docker-compose -f docker-compose.prod.yml up -d
```

## 📚 Additional Documentation

- `API_DOCUMENTATION.md` - Complete API reference
- `DATABASE_SCHEMA.md` - Database schema details
- `BUILD_PLAN.md` - 30-day development roadmap

## 🎉 Project Status

**Current Completion**: ~75%

### ✅ Completed
- Backend infrastructure
- Frontend infrastructure
- Core features (Skills, Projects, Progress)
- Unit tests
- API documentation

### 🔄 In Progress
- Database migrations
- End-to-end testing
- AI integration

### 📅 Future Enhancements
- State management (React Query/Zustand)
- Real-time features (WebSockets)
- Mobile responsiveness improvements
- Advanced analytics
- Social features

## 🤝 Contributing

This is a learning project, but contributions are welcome!

## 📄 License

MIT License

---

**Made with ❤️ using FastAPI and Next.js**
