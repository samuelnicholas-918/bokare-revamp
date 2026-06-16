-- Bokare.in Database Schema for Neon PostgreSQL
-- Run this via Neon MCP or psql to initialize the database

CREATE TYPE "Role" AS ENUM ('ADMIN', 'STUDENT');
CREATE TYPE "CourseCategory" AS ENUM ('CORE', 'ELECTIVE', 'PROFESSIONAL');
CREATE TYPE "MaterialType" AS ENUM (
  'LECTURE_NOTES',
  'NUMERICAL_PROBLEMS',
  'QUESTION_BANK',
  'SELF_STUDY',
  'TECHNICAL_NOTES',
  'QUESTION_PAPERS',
  'PDF',
  'RESOURCES'
);

CREATE TABLE "User" (
  id TEXT PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  "passwordHash" TEXT NOT NULL,
  name TEXT,
  role "Role" DEFAULT 'STUDENT' NOT NULL,
  "createdAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP NOT NULL,
  "updatedAt" TIMESTAMP(3) NOT NULL
);

CREATE TABLE "Course" (
  id TEXT PRIMARY KEY,
  semester INTEGER NOT NULL,
  title TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  description TEXT,
  category "CourseCategory" DEFAULT 'CORE' NOT NULL,
  "learningObjectives" TEXT[] DEFAULT ARRAY[]::TEXT[],
  "createdAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP NOT NULL,
  "updatedAt" TIMESTAMP(3) NOT NULL
);

CREATE TABLE "Material" (
  id TEXT PRIMARY KEY,
  "courseId" TEXT NOT NULL REFERENCES "Course"(id) ON DELETE CASCADE,
  type "MaterialType" NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  "fileUrl" TEXT,
  "externalUrl" TEXT,
  "contentHtml" TEXT,
  "order" INTEGER DEFAULT 0 NOT NULL,
  "fileSizeBytes" INTEGER,
  "createdAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP NOT NULL,
  "updatedAt" TIMESTAMP(3) NOT NULL
);

CREATE TABLE "Download" (
  id TEXT PRIMARY KEY,
  "userId" TEXT REFERENCES "User"(id) ON DELETE SET NULL,
  "materialId" TEXT NOT NULL REFERENCES "Material"(id) ON DELETE CASCADE,
  "downloadedAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP NOT NULL,
  "ipAddress" TEXT
);

-- Performance indexes
CREATE INDEX "Course_category_idx" ON "Course"(category);
CREATE INDEX "Course_semester_idx" ON "Course"(semester);
CREATE INDEX "Material_courseId_idx" ON "Material"("courseId");
CREATE INDEX "Material_type_idx" ON "Material"(type);
CREATE INDEX "Material_title_idx" ON "Material"(title);
CREATE INDEX "Download_materialId_idx" ON "Download"("materialId");
CREATE INDEX "Download_downloadedAt_idx" ON "Download"("downloadedAt");

-- Full-text search index for materials
CREATE INDEX "Material_search_idx" ON "Material"
  USING gin(to_tsvector('english', coalesce(title, '') || ' ' || coalesce(description, '')));

-- Row Level Security (optional — enable when using Supabase/Neon RLS)
-- ALTER TABLE "Material" ENABLE ROW LEVEL SECURITY;
-- CREATE POLICY "Public read materials" ON "Material" FOR SELECT USING (true);
-- CREATE POLICY "Admin write materials" ON "Material" FOR ALL USING (
--   EXISTS (SELECT 1 FROM "User" WHERE id = auth.uid() AND role = 'ADMIN')
-- );
