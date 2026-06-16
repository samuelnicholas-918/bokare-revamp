# Deployment Guide — Bokare.in

## Prerequisites

- [Neon](https://neon.tech) account (PostgreSQL)
- [Vercel](https://vercel.com) account
- Domain access for bokare.in DNS

---

## Step 1: Set Up Neon Database

1. Create a new Neon project named `bokare`
2. Copy the connection string (PostgreSQL)
3. Optionally run the raw schema via Neon SQL Editor:
   ```bash
   # Contents of schema/schema.sql
   ```
   Or use Prisma migrations (recommended):
   ```bash
   DATABASE_URL="your-neon-url" npx prisma migrate dev --name init
   ```

## Step 2: Seed the Database

```bash
cp .env.example .env
# Edit .env with your Neon DATABASE_URL and secrets

npm run db:seed
```

This creates:
- 9 courses (6 core + 2 electives + professional development)
- All known materials from the original site
- Admin user (default: `professor@bokare.in`)

## Step 3: Deploy to Vercel

1. Push code to GitHub
2. Import project in Vercel
3. Set environment variables:

| Variable | Value |
|----------|-------|
| `DATABASE_URL` | Neon connection string |
| `NEXTAUTH_URL` | `https://bokare.in` |
| `NEXTAUTH_SECRET` | Random 32+ char string |
| `ADMIN_EMAIL` | Professor email |
| `ADMIN_PASSWORD` | Strong password (for re-seeding only) |

4. Deploy

```bash
# Or via CLI:
vercel --prod
```

## Step 4: Configure DNS

In your domain registrar (where bokare.in is managed):

| Type | Name | Value |
|------|------|-------|
| A | @ | `76.76.21.21` (Vercel) |
| CNAME | www | `cname.vercel-dns.com` |

Or use Vercel's nameservers for automatic SSL.

## Step 5: Verify

- [ ] Homepage loads at https://bokare.in
- [ ] All 8 course pages load without errors
- [ ] Search returns results for "demand", "banking", etc.
- [ ] PDF download links redirect correctly
- [ ] Admin login works at /admin/login
- [ ] Upload and analytics work after login
- [ ] Mobile layout is responsive

## Step 6: Neon Backups

Enable automated backups in Neon dashboard:
- **Settings → Backups → Enable**
- Recommended: daily backups with 7-day retention

---

## Local Development

```bash
git clone <repo>
cd bokare_revamp
cp .env.example .env
# Set DATABASE_URL to Neon dev branch or local Postgres

npm install
npm run db:push
npm run db:seed
npm run dev
```

Open http://localhost:3000

---

## MCP Integration (Neon)

When Neon MCP is connected in Cursor:

1. Create project: `bokare-production`
2. Run schema: execute `schema/schema.sql`
3. Set RLS policies if using Supabase-compatible auth
4. Create indexes (included in schema.sql)
5. Copy connection string to Vercel env vars

---

## Troubleshooting

| Issue | Fix |
|-------|-----|
| `PrismaClientInitializationError` | Check DATABASE_URL, ensure Neon project is active |
| Admin login fails | Re-run `npm run db:seed` with correct ADMIN_EMAIL/PASSWORD |
| 404 on course pages | Run seed script; check slugs match |
| PDF downloads fail | Verify original bokare.in URLs are still accessible |
| Build fails on Vercel | Ensure `postinstall` runs `prisma generate` |
