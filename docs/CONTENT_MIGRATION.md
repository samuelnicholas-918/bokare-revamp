# Content Migration Guide

## Overview

All lecture HTML from bokare.in has been imported into the Next.js app as reformatted, in-app reader pages.

**Reader URL pattern:** `/courses/[course-slug]/learn/[material-slug]`

**Example:** `/courses/sem-1-theory-of-consumer/learn/introduction-to-economics`

## What Was Done

1. **23 HTML files** crawled from bokare.in (syllabi + lecture notes across 8 courses)
2. Content cleaned: scripts removed, typos fixed, tables styled, callouts converted
3. Stored in PostgreSQL `Material.contentHtml` with unique `slug` per course
4. Futuristic reader UI with hero, reading progress, TOC, prev/next navigation

## Re-import Content

After adding new sources to `src/lib/content/sources.ts`:

```bash
npm run content:import
```

## Add a New Page

1. Add entry to `src/lib/content/sources.ts`
2. Run `npm run content:import`
3. Page appears automatically on the course detail page with a **Read** button

## Component Library

| Component | Location | Purpose |
|-----------|----------|---------|
| `ContentHero` | `src/components/content/` | Gradient hero with metadata |
| `ContentRenderer` | | Styled HTML + MathJax |
| `ContentLayout` | | Breadcrumbs + 2-column layout |
| `ContentSidebar` | | TOC, downloads, prev/next |
| `ReadingProgress` | | Top scroll progress bar |
| `TableOfContents` | | Sticky section nav |
| `MaterialTypeBadge` | | Color-coded type badges |

## Design Tokens

See `tailwind.config.ts` — teal, electric-blue, purple, coral, mint, gold palette.

## Updating Content

**Option 1:** Re-run import script (overwrites from bokare.in source)

**Option 2:** Admin panel → upload/edit (for new materials)

**Option 3:** Direct DB update to `contentHtml` field
