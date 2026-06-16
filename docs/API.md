# API Documentation

Base URL: `https://bokare.in/api` (production) or `http://localhost:3000/api` (development)

## Public Endpoints

### GET /api/courses

List all courses with material counts.

**Response:**
```json
[
  {
    "id": "clx...",
    "semester": 1,
    "title": "Theory of Consumer",
    "slug": "sem-1-theory-of-consumer",
    "description": "...",
    "category": "CORE",
    "learningObjectives": ["..."],
    "_count": { "materials": 7 }
  }
]
```

### GET /api/courses/[slug]

Get course details with all materials.

**Parameters:** `slug` — course URL slug (e.g. `sem-1-theory-of-consumer`)

**Response:** Course object with nested `materials[]` ordered by type and order.

**Errors:** `404` if course not found.

### GET /api/materials/search

Search materials across all courses.

**Query Parameters:**

| Param | Type | Description |
|-------|------|-------------|
| `q` | string | Search keyword (title, description) |
| `type` | MaterialType | Filter by material type |
| `semester` | number | Filter by semester |

**Example:** `/api/materials/search?q=demand&type=LECTURE_NOTES`

**Response:**
```json
{
  "results": [...],
  "total": 5,
  "query": "demand"
}
```

### GET /api/materials/[id]/download

Track download and redirect to file URL.

**Behavior:**
1. Creates a `Download` record
2. Redirects (302) to `fileUrl` or `externalUrl`

**Errors:** `404` if material or URL not found.

---

## Admin Endpoints (Authentication Required)

All admin endpoints require an active NextAuth session with `role: ADMIN`.

### POST /api/materials

Create a new material.

**Body:**
```json
{
  "courseId": "clx...",
  "type": "LECTURE_NOTES",
  "title": "Unit 3 — Demand Analysis",
  "description": "Optional description",
  "fileUrl": "https://example.com/file.pdf",
  "externalUrl": "https://example.com/page.html",
  "order": 0
}
```

**Response:** `201` with created material object.

**Errors:** `401` unauthorized, `400` validation error.

### PUT /api/materials/[id]

Update material metadata.

**Body:** Same fields as POST (all optional except those being updated).

### DELETE /api/materials/[id]

Delete a material.

**Response:** `{ "success": true }`

### GET /api/analytics/downloads

Get download statistics.

**Response:**
```json
{
  "totalDownloads": 142,
  "topMaterials": [
    { "materialId": "...", "count": 45, "title": "...", "course": "..." }
  ],
  "recentDownloads": [
    { "material": "...", "downloadedAt": "2026-06-16T..." }
  ]
}
```

---

## Material Types

| Enum Value | Label |
|-----------|-------|
| `LECTURE_NOTES` | Lecture Notes |
| `NUMERICAL_PROBLEMS` | Numerical Problems |
| `QUESTION_BANK` | Question Bank |
| `SELF_STUDY` | Self-Study Exercises |
| `TECHNICAL_NOTES` | Technical Notes |
| `QUESTION_PAPERS` | Question Papers |
| `PDF` | PDF Resources |
| `RESOURCES` | Additional Resources |

## Authentication

Uses NextAuth.js with JWT sessions.

- **Sign in:** POST `/api/auth/callback/credentials`
- **Sign out:** POST `/api/auth/signout`
- **Session:** GET `/api/auth/session`

Admin login page: `/admin/login`
