# SkillSphere API Endpoints

Base URL: `http://localhost:8000`

## Authentication

### Register User
```http
POST /api/auth/register
Content-Type: application/json

{
  "email": "user@example.com",
  "username": "username",
  "password": "password123",
  "full_name": "John Doe"
}
```

### Login
```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123"
}

Response:
{
  "access_token": "eyJ...",
  "refresh_token": "eyJ...",
  "token_type": "bearer"
}
```

### Get Current User
```http
GET /api/auth/me
Authorization: Bearer {access_token}
```

---

## Users

### Get All Users
```http
GET /api/users/
Authorization: Bearer {access_token}
```

### Get User by ID
```http
GET /api/users/{user_id}
Authorization: Bearer {access_token}
```

### Update Current User
```http
PUT /api/users/me
Authorization: Bearer {access_token}
Content-Type: application/json

{
  "full_name": "Updated Name",
  "bio": "My bio"
}
```

### Delete Current User
```http
DELETE /api/users/me
Authorization: Bearer {access_token}
```

---

## Skills

### Get All Skills
```http
GET /api/skills/
Authorization: Bearer {access_token}
```

### Create Skill
```http
POST /api/skills/
Authorization: Bearer {access_token}
Content-Type: application/json

{
  "name": "Python",
  "category": "Programming",
  "level": "intermediate",
  "target_level": "expert",
  "description": "Backend development"
}
```

### Get Skill by ID
```http
GET /api/skills/{skill_id}
Authorization: Bearer {access_token}
```

### Update Skill
```http
PUT /api/skills/{skill_id}
Authorization: Bearer {access_token}
Content-Type: application/json

{
  "level": "advanced",
  "hours_invested": 100
}
```

### Delete Skill
```http
DELETE /api/skills/{skill_id}
Authorization: Bearer {access_token}
```

---

## Projects

### Get All Projects
```http
GET /api/projects/
Authorization: Bearer {access_token}
```

### Create Project
```http
POST /api/projects/
Authorization: Bearer {access_token}
Content-Type: application/json

{
  "title": "E-commerce Platform",
  "description": "Full-stack e-commerce",
  "status": "in_progress",
  "github_url": "https://github.com/user/repo",
  "tags": "python,react,postgres"
}
```

### Get Project by ID
```http
GET /api/projects/{project_id}
Authorization: Bearer {access_token}
```

### Update Project
```http
PUT /api/projects/{project_id}
Authorization: Bearer {access_token}
Content-Type: application/json

{
  "status": "completed",
  "completed_date": "2026-02-09"
}
```

### Delete Project
```http
DELETE /api/projects/{project_id}
Authorization: Bearer {access_token}
```

---

## Milestones

### Create Milestone
```http
POST /api/milestones/
Authorization: Bearer {access_token}
Content-Type: application/json

{
  "project_id": 1,
  "title": "Setup Database",
  "description": "Configure PostgreSQL",
  "due_date": "2026-02-15",
  "order": 1
}
```

### Get Milestone by ID
```http
GET /api/milestones/{milestone_id}
Authorization: Bearer {access_token}
```

### Update Milestone
```http
PUT /api/milestones/{milestone_id}
Authorization: Bearer {access_token}
Content-Type: application/json

{
  "is_completed": true
}
```

### Delete Milestone
```http
DELETE /api/milestones/{milestone_id}
Authorization: Bearer {access_token}
```

---

## Progress Logs

### Get All Progress Logs
```http
GET /api/progress/
Authorization: Bearer {access_token}
```

### Get Recent Logs
```http
GET /api/progress/recent?days=7
Authorization: Bearer {access_token}
```

### Create Progress Log
```http
POST /api/progress/
Authorization: Bearer {access_token}
Content-Type: application/json

{
  "date": "2026-02-09",
  "title": "Learned FastAPI",
  "description": "Built REST API",
  "hours_spent": 120,
  "mood": "productive",
  "tags": "python,api"
}
```

### Get Progress Log by ID
```http
GET /api/progress/{log_id}
Authorization: Bearer {access_token}
```

### Update Progress Log
```http
PUT /api/progress/{log_id}
Authorization: Bearer {access_token}
Content-Type: application/json

{
  "hours_spent": 180
}
```

### Delete Progress Log
```http
DELETE /api/progress/{log_id}
Authorization: Bearer {access_token}
```

---

## AI Feedback

### Get All Feedbacks
```http
GET /api/ai-feedback/
Authorization: Bearer {access_token}
```

### Get Feedbacks by Type
```http
GET /api/ai-feedback/?feedback_type=daily_summary
Authorization: Bearer {access_token}
```

### Create Feedback
```http
POST /api/ai-feedback/
Authorization: Bearer {access_token}
Content-Type: application/json

{
  "feedback_type": "skill_suggestion",
  "title": "Improve Python Skills",
  "content": "Focus on async programming",
  "metadata": "{}"
}
```

### Get Feedback by ID
```http
GET /api/ai-feedback/{feedback_id}
Authorization: Bearer {access_token}
```

### Delete Feedback
```http
DELETE /api/ai-feedback/{feedback_id}
Authorization: Bearer {access_token}
```

---

## Health Check

### Root
```http
GET /
```

### Health
```http
GET /health
```

---

## Interactive Documentation

- **Swagger UI**: http://localhost:8000/docs
- **ReDoc**: http://localhost:8000/redoc
