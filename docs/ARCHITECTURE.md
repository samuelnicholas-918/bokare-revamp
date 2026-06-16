# Bokare.in — Architecture Overview

## System Architecture

```
┌─────────────────────────────────────────────────────────┐
│                     Vercel (Frontend)                  │
│  Next.js 14 App Router · TypeScript · Tailwind CSS      │
├─────────────────────────────────────────────────────────┤
│  Public Pages          │  Admin Pages                   │
│  / (Home)              │  /admin/login                  │
│  /courses              │  /admin/dashboard              │
│  /courses/[slug]       │  /admin/upload                 │
│  /search               │  /admin/analytics              │
├─────────────────────────────────────────────────────────┤
│  API Routes (Next.js)                                    │
│  GET  /api/courses                                       │
│  GET  /api/courses/[slug]                                │
│  GET  /api/materials/search?q=                           │
│  POST /api/materials (admin)                             │
│  PUT  /api/materials/[id] (admin)                        │
│  GET  /api/materials/[id]/download                       │
│  GET  /api/analytics/downloads (admin)                   │
│  POST /api/auth/[...nextauth]                            │
└──────────────────────┬──────────────────────────────────┘
                       │
                       ▼
┌─────────────────────────────────────────────────────────┐
│              Neon PostgreSQL (Database)                  │
│  Tables: User, Course, Material, Download                │
│  ORM: Prisma                                             │
│  Search: ILIKE queries (upgradeable to full-text)        │
└─────────────────────────────────────────────────────────┘
                       │
                       ▼
┌─────────────────────────────────────────────────────────┐
│           External File Storage (Current)                │
│  Original PDFs hosted at bokare.in/Com/Sem*/             │
│  Future: Supabase Storage / Vercel Blob / S3             │
└─────────────────────────────────────────────────────────┘
```

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | Next.js 14 (App Router) |
| Language | TypeScript |
| Styling | Tailwind CSS + custom design tokens |
| Components | shadcn/ui patterns (Radix primitives) |
| Data Fetching | Server Components + React Query (client) |
| State | Zustand (available), NextAuth sessions |
| ORM | Prisma 7 |
| Database | Neon PostgreSQL |
| Auth | NextAuth.js (Credentials provider) |

## Information Architecture

```
Home (Dashboard)
├── Core Courses (Sem 1–6)
├── Electives (Sem 5E, 6E)
├── Professional Development
└── Admin Panel
    ├── Dashboard
    ├── Upload
    └── Analytics

Course Detail Page
├── Overview + Learning Objectives
├── Materials by Type (tabs)
│   ├── Lecture Notes
│   ├── PDF Resources
│   ├── Question Bank
│   ├── Numerical Problems
│   ├── Self-Study Exercises
│   ├── Technical Notes
│   └── Question Papers
└── Related Courses sidebar
```

## Key Design Decisions

1. **Authentication:** Email/password for professor only (NextAuth credentials). Students browse freely without login.
2. **File storage:** Links to existing bokare.in PDFs preserved; admin can add new URLs.
3. **Analytics:** Download events tracked in PostgreSQL when users click download.
4. **Search:** Prisma `contains` with case-insensitive mode; PostgreSQL full-text index defined in `schema/schema.sql`.

## Directory Structure

```
src/
├── app/
│   ├── page.tsx                 # Home dashboard
│   ├── courses/                 # Course listing + detail
│   ├── search/                  # Global search
│   ├── admin/                   # Professor admin panel
│   └── api/                     # REST API routes
├── components/
│   ├── ui/                      # shadcn-style primitives
│   ├── Navbar.tsx
│   ├── CourseCard.tsx
│   ├── MaterialList.tsx
│   └── SearchBar.tsx
├── lib/
│   ├── db.ts                    # Prisma client
│   ├── auth.ts                  # NextAuth config
│   └── utils.ts
prisma/
├── schema.prisma
└── seed.ts                      # Seed courses + materials
schema/
└── schema.sql                   # Raw SQL for Neon setup
docs/
├── AUDIT_REPORT.md
├── ARCHITECTURE.md
├── API.md
├── DEPLOYMENT.md
└── ADMIN_GUIDE.md
```
