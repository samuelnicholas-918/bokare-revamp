# Admin User Guide

This guide explains how to manage course materials on bokare.in without any technical knowledge.

---

## Logging In

1. Go to **bokare.in/admin/login**
2. Enter your email and password (provided during setup)
3. Click **Sign In**

You'll land on the Admin Dashboard.

---

## Dashboard Overview

The dashboard shows:
- **Total courses** — number of active courses
- **Total materials** — all uploaded resources
- **Total downloads** — how many times students downloaded files
- **Recently added** — your latest uploads

---

## Uploading New Material

1. From the dashboard, click **Upload Material**
2. Fill in the form:

| Field | What to enter |
|-------|--------------|
| **Course** | Which semester/course this belongs to |
| **Material Type** | Lecture Notes, PDF, Question Bank, etc. |
| **Title** | Clear name students will see (e.g. "Unit 3 — Elasticity") |
| **Description** | Optional short summary |
| **File URL** | Direct link to a PDF file for download |
| **External URL** | Link to view content online (optional) |
| **Display Order** | Number for sorting (0 = first) |

3. Click **Upload Material**

The material appears immediately on the course page.

### Where to get File URLs

- **Existing PDFs on bokare.in:** Use the full URL like `https://bokare.in/Com/Sem1/semOne.pdf`
- **Google Drive:** Use "Anyone with the link" sharing, then copy the direct download link
- **Future:** Upload to Supabase Storage or Vercel Blob (coming soon)

---

## Viewing Analytics

1. Go to **Admin → Analytics** (or `/admin/analytics`)
2. See:
   - **Total downloads** across all materials
   - **Most downloaded** — popular resources ranked
   - **Recent downloads** — latest activity

Use this to understand which materials students use most.

---

## Material Types Explained

| Type | Use for |
|------|---------|
| Lecture Notes | HTML/text lesson content |
| PDF Resources | Complete semester PDFs |
| Question Bank | Practice questions |
| Question Papers | Previous exam papers |
| Numerical Problems | Solved numerical exercises |
| Self-Study Exercises | Independent practice |
| Technical Notes | Reference/formula sheets |
| Additional Resources | External links, readings |

---

## Tips

- **Use clear titles** — students search by topic name
- **Set display order** — syllabus first (0), then units in sequence
- **Add descriptions** — helps search find your materials
- **Check the public site** after uploading to verify it looks correct

---

## Getting Help

If something isn't working:
1. Check that the File URL opens in your browser
2. Make sure you're logged in (session expires after inactivity)
3. Contact your developer for password resets or technical issues
