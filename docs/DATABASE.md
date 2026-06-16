# Database Schema Documentation

## Entity Relationship Diagram

```
User ──────────< Download >────────── Material
                                          │
                                          │ many-to-one
                                          ▼
                                       Course
```

## Tables

### User

| Column | Type | Description |
|--------|------|-------------|
| id | TEXT (cuid) | Primary key |
| email | TEXT | Unique login email |
| passwordHash | TEXT | bcrypt hash |
| name | TEXT | Display name |
| role | ENUM | `ADMIN` or `STUDENT` |
| createdAt | TIMESTAMP | Account creation |
| updatedAt | TIMESTAMP | Last update |

### Course

| Column | Type | Description |
|--------|------|-------------|
| id | TEXT (cuid) | Primary key |
| semester | INT | Semester number (0 for PD) |
| title | TEXT | Course name |
| slug | TEXT | URL-friendly unique identifier |
| description | TEXT | Course overview |
| category | ENUM | `CORE`, `ELECTIVE`, `PROFESSIONAL` |
| learningObjectives | TEXT[] | Array of learning goals |
| createdAt | TIMESTAMP | Creation date |
| updatedAt | TIMESTAMP | Last update |

**Indexes:** `category`, `semester`, unique `slug`

### Material

| Column | Type | Description |
|--------|------|-------------|
| id | TEXT (cuid) | Primary key |
| courseId | TEXT | FK → Course |
| type | ENUM | Material category (see below) |
| title | TEXT | Display name |
| description | TEXT | Optional summary |
| fileUrl | TEXT | Direct download URL |
| externalUrl | TEXT | External view link |
| contentHtml | TEXT | Inline HTML content (future) |
| order | INT | Sort order within type |
| fileSizeBytes | INT | File size for display |
| createdAt | TIMESTAMP | Creation date |
| updatedAt | TIMESTAMP | Last update |

**Indexes:** `courseId`, `type`, `title`, GIN full-text on title+description

### Download

| Column | Type | Description |
|--------|------|-------------|
| id | TEXT (cuid) | Primary key |
| userId | TEXT | FK → User (nullable) |
| materialId | TEXT | FK → Material |
| downloadedAt | TIMESTAMP | When downloaded |
| ipAddress | TEXT | Client IP for analytics |

**Indexes:** `materialId`, `downloadedAt`

## Enums

### MaterialType
- `LECTURE_NOTES` — HTML/text lesson content
- `NUMERICAL_PROBLEMS` — Solved numerical exercises
- `QUESTION_BANK` — Practice questions
- `SELF_STUDY` — Independent exercises
- `TECHNICAL_NOTES` — Reference sheets
- `QUESTION_PAPERS` — Previous exams
- `PDF` — Complete PDF resources
- `RESOURCES` — External links

### CourseCategory
- `CORE` — Semesters 1–6
- `ELECTIVE` — Managerial Economics
- `PROFESSIONAL` — Professional Development

## Seed Data

Running `npm run db:seed` creates:
- 9 courses matching original site structure
- ~35 materials (lecture notes + PDFs from bokare.in)
- 1 admin user

## Migrations

```bash
# Create migration
npx prisma migrate dev --name description

# Apply to production
npx prisma migrate deploy

# Quick push (dev only)
npx prisma db push
```
