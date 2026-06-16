# Bokare.in Redesign

Modern B.Com Business Economics course materials platform — rebuilt with Next.js 14, TypeScript, and PostgreSQL.

## Quick Start

```bash
cp .env.example .env
# Add your Neon DATABASE_URL

npm install
npm run db:push
npm run db:seed
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

**Admin login:** `/admin/login` (default: `professor@bokare.in` / see `.env`)

## Documentation

- [Audit Report](docs/AUDIT_REPORT.md) — Current site analysis
- [Architecture](docs/ARCHITECTURE.md) — System design overview
- [API Docs](docs/API.md) — REST API reference
- [Deployment](docs/DEPLOYMENT.md) — Vercel + Neon setup
- [Admin Guide](docs/ADMIN_GUIDE.md) — Professor content management

## Features

- Responsive home dashboard with course grid
- Course pages with tabbed material organization
- Global search with type filters
- Admin panel for upload and analytics
- Download tracking
- Professional teal/cream design system

## Tech Stack

Next.js 14 · TypeScript · Tailwind CSS · Prisma · Neon PostgreSQL · NextAuth
