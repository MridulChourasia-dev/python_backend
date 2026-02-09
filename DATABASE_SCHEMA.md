# Database Schema Diagram

```
┌─────────────────────────────────────────────────────────────────────────┐
│                          SkillSphere Database Schema                     │
└─────────────────────────────────────────────────────────────────────────┘

┌──────────────────────┐
│       users          │
├──────────────────────┤
│ id (PK)              │
│ email (UNIQUE)       │
│ username (UNIQUE)    │
│ full_name            │
│ hashed_password      │
│ is_active            │
│ is_superuser         │
│ avatar_url           │
│ bio                  │
│ created_at           │
│ updated_at           │
└──────────────────────┘
         │
         │ 1:N
         ├─────────────────────────────────────────┐
         │                                         │
         │                                         │
         ▼                                         ▼
┌──────────────────────┐                 ┌──────────────────────┐
│      skills          │                 │     projects         │
├──────────────────────┤                 ├──────────────────────┤
│ id (PK)              │                 │ id (PK)              │
│ user_id (FK)         │                 │ user_id (FK)         │
│ name                 │                 │ title                │
│ category             │                 │ description          │
│ level (ENUM)         │                 │ status (ENUM)        │
│ target_level (ENUM)  │                 │ github_url           │
│ description          │                 │ demo_url             │
│ hours_invested       │                 │ tags                 │
│ created_at           │                 │ start_date           │
│ updated_at           │                 │ target_end_date      │
└──────────────────────┘                 │ completed_date       │
                                         │ created_at           │
                                         │ updated_at           │
                                         └──────────────────────┘
                                                  │
                                                  │ 1:N
                                                  ▼
                                         ┌──────────────────────┐
                                         │    milestones        │
                                         ├──────────────────────┤
                                         │ id (PK)              │
                                         │ project_id (FK)      │
                                         │ title                │
                                         │ description          │
                                         │ is_completed         │
                                         │ order                │
                                         │ due_date             │
                                         │ completed_date       │
                                         │ created_at           │
                                         │ updated_at           │
                                         └──────────────────────┘

         │
         │ 1:N
         ├─────────────────────────────────────────┐
         │                                         │
         ▼                                         ▼
┌──────────────────────┐                 ┌──────────────────────┐
│   progress_logs      │                 │   ai_feedbacks       │
├──────────────────────┤                 ├──────────────────────┤
│ id (PK)              │                 │ id (PK)              │
│ user_id (FK)         │                 │ user_id (FK)         │
│ date                 │                 │ feedback_type        │
│ title                │                 │ title                │
│ description          │                 │ content              │
│ hours_spent          │                 │ metadata             │
│ mood                 │                 │ created_at           │
│ tags                 │                 └──────────────────────┘
│ created_at           │
│ updated_at           │
└──────────────────────┘


═══════════════════════════════════════════════════════════════════════════

ENUMS:

SkillLevel:
  - beginner
  - intermediate
  - advanced
  - expert

ProjectStatus:
  - planning
  - in_progress
  - on_hold
  - completed
  - archived

FeedbackType:
  - daily_summary
  - skill_suggestion
  - project_feedback

═══════════════════════════════════════════════════════════════════════════

INDEXES:

users:
  - email (UNIQUE)
  - username (UNIQUE)

skills:
  - user_id

projects:
  - user_id

milestones:
  - project_id

progress_logs:
  - user_id
  - date

ai_feedbacks:
  - user_id

═══════════════════════════════════════════════════════════════════════════
```

## Relationships

1. **User → Skills** (One-to-Many)
   - A user can have multiple skills
   - Each skill belongs to one user

2. **User → Projects** (One-to-Many)
   - A user can have multiple projects
   - Each project belongs to one user

3. **Project → Milestones** (One-to-Many)
   - A project can have multiple milestones
   - Each milestone belongs to one project

4. **User → Progress Logs** (One-to-Many)
   - A user can have multiple progress logs
   - Each log belongs to one user

5. **User → AI Feedbacks** (One-to-Many)
   - A user can have multiple AI feedbacks
   - Each feedback belongs to one user

## Key Features

- **Cascade Deletes**: When a user is deleted, all related data is deleted
- **Timestamps**: All tables have created_at and updated_at
- **Enums**: Type-safe status and level tracking
- **Indexes**: Optimized queries on foreign keys and unique fields
