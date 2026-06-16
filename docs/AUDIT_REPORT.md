# Bokare.in — Current State Audit Report

**Date:** June 16, 2026  
**Auditor:** Automated crawl + manual review  
**URL:** https://bokare.in

---

## Executive Summary

Bokare.in is a static HTML site serving B.Com Business Economics course materials. It has a clear academic purpose and some working lecture content, but suffers from **critical functional gaps** (82% of linked sub-pages return 404), **non-functional UI elements**, **inconsistent design**, and **no backend infrastructure**. Students cannot reliably find or download materials without trial-and-error.

---

## 1. Site Structure & Pages

### 1.1 Pages That Load (200 OK)

| Page | URL | Purpose |
|------|-----|---------|
| Homepage | `/` or `/index.html` | Course tile grid, welcome message |
| Commerce Hub | `/Com/Com_index.html` | Semester navigation with sidebar |
| Sem 1 Index | `/Com/Sem1/Sem1_index.html` | Theory of Consumer — sidebar + content |
| Sem 2 Index | `/Com/Sem2/Sem2_index.html` | Theory of Production |
| Sem 3 Index | `/Com/Sem3/Sem3_index.html` | Macroeconomics |
| Sem 4 Index | `/Com/Sem4/Sem4_index.html` | Banking |
| Sem 5 Index | `/Com/Sem5/Sem5_index.html` | Public Finance |
| Sem 6 Index | `/Com/Sem6/Sem6_index.html` | International Economics |
| Sem 5E Index | `/Com/Sem5E/Sem5E_index.html` | Managerial Economics (Micro) |
| Sem 6E Index | `/Com/Sem6E/Sem6E_index.html` | Managerial Economics (Macro) |

### 1.2 Pages That Fail (404)

| Page | URL | Impact |
|------|-----|--------|
| Professional Development | `/Other/pd.html` | **Critical** — linked from main nav |
| All Unit pages (I–IV) | `unitOne.html` … `unitFour.html` (all semesters) | **Critical** — topbar links broken |
| Question Bank | `questionBank.html` (all semesters) | **High** — promised on homepage |
| Question Papers | `auestionPapers.html` (all semesters) | **High** — typo in filename + 404 |
| Many sidebar topics | Sem 3 units 5–9, Sem 5E content, Sem 6 content | **High** — incomplete content |

### 1.3 Working Lecture Content (HTML fragments loaded via JS)

**Semester 1** (6 working topics):
- Syllabus, Economics, Business Economics, Basic Concepts, Demand Analysis, Elasticity

**Semester 2** (8 working topics):
- Syllabus, Production, Cost, Revenue, Firm Equilibrium, Perfect/Imperfect Competition, Oligopoly, Pricing

**Semester 3** (4 working topics):
- Syllabus, Introduction, National Income, Business Cycle, Circular Flow

**Semester 4** (2 working topics):
- Syllabus, Commercial Banking

**Semester 5** (2 working topics):
- Syllabus, Public Finance

**Semesters 6, 5E, 6E** (syllabus only):
- Most sidebar links point to Sem 2 files that don't exist in those directories

### 1.4 Available PDFs

| Semester | PDF URL | Notes |
|----------|---------|-------|
| Sem 1 | `/Com/Sem1/semOne.pdf` | Unique filename |
| Sem 2–6, 5E, 6E | `/Com/Sem{N}/semTwo.pdf` | **Same filename reused** — confusing |
| Root | `/Com/semOne.pdf` | Orphaned duplicate |

**Sem 5 has no PDF.**

---

## 2. Issues by Dimension

### 2.1 UI/UX Issues

| Issue | Severity | Impact on Students |
|-------|----------|-------------------|
| Clashing gradient colors (cyan→red, cyan→purple, tomato→green) | **High** | Unprofessional; reduces trust and readability |
| Homepage tiles are `<button>` elements wrapping links — poor semantics & accessibility | **Medium** | Screen readers and keyboard nav fail |
| Non-functional homepage tiles (Question Papers, PDF Sem 1–6, etc.) | **Critical** | Students click expecting downloads; nothing happens |
| No visual hierarchy — all tiles same size/weight | **Medium** | Hard to distinguish core courses vs. resource types |
| Inconsistent typography (Arial, inline styles, mixed font sizes) | **Medium** | Feels unfinished |
| Dark mode only on course pages, not homepage | **Low** | Inconsistent experience |
| Topbar overflows horizontally on mobile with no hamburger on homepage | **High** | Mobile users can't navigate semesters easily |
| Placeholder CTA: "Start learning CSS now »" | **High** | Copy-paste error; confusing and unprofessional |
| Logo uses invalid HTML attributes (`width="10%"` on div) | **Low** | Minor but indicates lack of polish |

### 2.2 Functional Issues

| Issue | Severity | Impact |
|-------|----------|--------|
| "Sign In" button links to `#` — non-functional | **Critical** | False promise of authentication |
| 50+ broken links (404) across site | **Critical** | Students hit dead ends constantly |
| Sidebar JS fetch fails silently for missing files | **High** | Error message only in red text; no recovery path |
| No search functionality (CSS exists for search box but unused on homepage) | **Critical** | Cannot find materials across semesters |
| Homepage resource type buttons have no click handlers | **Critical** | False affordances |
| Com_index.html sidebar has double `.html.html` extensions | **Critical** | All sidebar semester links broken |
| Duplicate `toggleSidebar` function definitions | **Low** | Code smell; potential bugs |

### 2.3 Content Issues

| Issue | Severity | Example |
|-------|----------|---------|
| Typos in navigation | **High** | "Theort of Production", "Init IV", "Peoduction", "Business Cucle", "Manegerial", "Elaticity", "Semeester VI" |
| Typo in filename | **High** | `auestionPapers.html` instead of `questionPapers.html` |
| Copy-pasted sidebar across semesters | **High** | Sem 4–6E sidebars link to Sem 2 production/cost files |
| Incomplete semesters | **High** | Sem 6, 5E, 6E have almost no unique content |
| No metadata (dates, file sizes, descriptions) | **Medium** | Students can't assess relevance or freshness |
| No learning objectives or course descriptions beyond boilerplate | **Medium** | Hard to understand what each semester covers |

### 2.4 Technical Issues

| Issue | Severity | Details |
|-------|----------|---------|
| Static HTML with no API | **Critical** | No dynamic content, search, or analytics |
| No database backend | **Critical** | Content hardcoded in HTML files |
| Exposed internal file paths in URLs | **Medium** | `/Com/Sem1/1_4demandFunction.html` reveals structure |
| Invalid CSS link: `<link rel="stylesheet" src="style_table.html">` | **Medium** | Uses `src` instead of `href` |
| Content loaded via client-side fetch (not SSR) | **Medium** | Poor SEO; slow perceived load |
| No sitemap.xml | **Low** | Search engines can't index effectively |
| No authentication system | **High** | Professor cannot manage content |
| No content management | **High** | Every update requires editing HTML manually |
| Google Charts loaded on all course pages | **Low** | Unnecessary JS payload |

---

## 3. Visual Design Assessment

### Current State
- **Header:** Dark gray (#333), sticky, logo + title + Sign In
- **Topbar:** Medium gray (#555), horizontal semester links
- **Content:** Light gray / bisque backgrounds, gradient tile buttons
- **Typography:** Arial sans-serif throughout
- **Colors:** Cyan, red, purple, tomato, green, pink gradients — no cohesive palette
- **Spacing:** Inconsistent padding; tiles use fixed 270×120px

### Screenshot Descriptions
1. **Homepage:** Grid of 8 large gradient course tiles + two rows of smaller non-functional resource buttons. Pink gradient hero banner. Cluttered, no whitespace.
2. **Course page (Sem 1):** Left sidebar with topic links, main card with welcome text. Dark mode toggle present. Bisque background. Functional but dated.
3. **404 page (PD):** Hostinger default "This Page Does Not Exist" — completely breaks site branding.

---

## 4. Backend & Infrastructure

| Capability | Current State |
|------------|---------------|
| Database | ❌ None |
| API | ❌ None |
| Authentication | ❌ Non-functional placeholder |
| Search | ❌ None |
| File storage | Static files on web host |
| Analytics | ❌ None (Google Analytics on 404 page only) |
| CMS | ❌ Manual HTML editing |
| CDN | ❌ None |

---

## 5. Content Inventory Summary

| Category | Count | Status |
|----------|-------|--------|
| Core courses | 6 | Partial content |
| Electives | 2 | Syllabus only |
| Working lecture topics | ~24 | Scattered across semesters |
| PDFs | 8 | 7 working, 1 missing (Sem 5) |
| Question banks | 0 | All 404 |
| Question papers | 0 | All 404 |
| Numerical problems | 0 | Homepage buttons non-functional |
| Self-study exercises | 0 | Homepage buttons non-functional |
| Technical notes | 0 | Homepage buttons non-functional |
| Professional Development | 0 | Page 404 |

---

## 6. Priority Matrix for Rebuild

### Must Fix (P0)
1. All broken links → proper routing with real content or graceful empty states
2. Global search across all materials
3. Organized course pages with material types (lecture notes, PDFs, question banks)
4. Mobile-responsive navigation
5. Professional, consistent design system
6. Working PDF download links with metadata

### Should Fix (P1)
1. Admin panel for professor to upload/manage materials
2. Authentication for admin
3. Download analytics
4. Fix all typos and placeholder content
5. Breadcrumb navigation

### Nice to Have (P2)
1. Dark mode
2. Student accounts for download tracking
3. Recently updated materials widget
4. Full-text search with highlighting

---

## 7. Key Decisions for Rebuild

| Decision | Recommendation | Rationale |
|----------|---------------|-----------|
| Authentication | Email/password for professor (NextAuth credentials) | Simple; professor-only admin |
| File storage | Keep original bokare.in URLs initially; support upload to Vercel Blob/S3 later | PDFs already hosted; migration optional |
| Analytics | Track downloads in PostgreSQL | Lightweight; useful for professor |
| Search | PostgreSQL full-text search via Prisma | Fast; no extra service needed |

---

## 8. Success Criteria Mapping

| Criterion | Current | Target |
|-----------|---------|--------|
| Find any material in < 1 min | ❌ Often impossible (404s) | ✅ Search + clear IA |
| All courses present | ⚠️ Partial | ✅ 100% with organized structure |
| Mobile usable | ❌ Poor | ✅ Mobile-first responsive |
| No broken links | ❌ 50+ broken | ✅ Zero 404s |
| Professor can manage content | ❌ Requires HTML editing | ✅ Admin dashboard |
| Page load < 2s | ⚠️ Variable (client fetch) | ✅ SSR + optimized |
