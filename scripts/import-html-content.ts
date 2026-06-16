import { PrismaClient } from "@prisma/client";
import { CONTENT_SOURCES, BASE_URL } from "../src/lib/content/sources";
import {
  cleanHtml,
  extractTitle,
  addHeadingIds,
} from "../src/lib/content/clean-html";

const prisma = new PrismaClient();

async function fetchHtml(url: string): Promise<string | null> {
  try {
    const res = await fetch(url);
    if (!res.ok) return null;
    const text = await res.text();
    if (text.length < 100) return null;
    return text;
  } catch {
    return null;
  }
}

async function main() {
  console.log("Importing HTML content from bokare.in...\n");
  let imported = 0;
  let skipped = 0;

  for (const source of CONTENT_SOURCES) {
    const url = `${BASE_URL}/${source.sem}/${source.file}`;
    const raw = await fetchHtml(url);

    if (!raw) {
      console.log(`  SKIP (empty/404): ${source.file}`);
      skipped++;
      continue;
    }

    const cleaned = addHeadingIds(cleanHtml(raw, { formatAsSyllabus: source.slug === "syllabus" }));
    const title = source.title;
    const externalUrl = url;

    const course = await prisma.course.findUnique({
      where: { slug: source.courseSlug },
    });

    if (!course) {
      console.log(`  SKIP (no course): ${source.courseSlug}`);
      skipped++;
      continue;
    }

    const existing = await prisma.material.findFirst({
      where: {
        courseId: course.id,
        OR: [{ slug: source.slug }, { externalUrl }, { title: source.title }],
      },
    });

    if (existing) {
      await prisma.material.update({
        where: { id: existing.id },
        data: {
          slug: source.slug,
          title,
          contentHtml: cleaned,
          externalUrl,
        },
      });
      console.log(`  UPDATE: ${course.title} → ${title}`);
    } else {
      await prisma.material.create({
        data: {
          courseId: course.id,
          slug: source.slug,
          type: source.type,
          title,
          contentHtml: cleaned,
          externalUrl,
          order: imported,
        },
      });
      console.log(`  CREATE: ${course.title} → ${title}`);
    }
    imported++;
  }

  console.log(`\nDone: ${imported} imported, ${skipped} skipped`);
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
