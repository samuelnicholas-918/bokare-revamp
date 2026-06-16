import { notFound } from "next/navigation";
import { prisma } from "@/lib/db";
import { extractHeadings, estimateReadingTime, getWordCount } from "@/lib/content/clean-html";
import { ContentLayout } from "@/components/content/ContentLayout";
import { ContentHero } from "@/components/content/ContentHero";
import { ContentRenderer } from "@/components/content/ContentRenderer";
import { ContentSidebar } from "@/components/content/ContentSidebar";
import { MobileContentNav } from "@/components/content/MobileContentNav";

export const dynamic = "force-dynamic";

async function getMaterial(courseSlug: string, materialSlug: string) {
  return prisma.material.findFirst({
    where: {
      slug: materialSlug,
      course: { slug: courseSlug },
      contentHtml: { not: null },
    },
    include: {
      course: {
        select: { title: true, slug: true, semester: true },
      },
    },
  });
}

export async function generateMetadata({
  params,
}: {
  params: { slug: string; materialSlug: string };
}) {
  const material = await getMaterial(params.slug, params.materialSlug);
  if (!material) return { title: "Not Found" };
  return {
    title: material.title,
    description: material.description || `${material.title} — ${material.course.title}`,
  };
}

export default async function LearnPage({
  params,
}: {
  params: { slug: string; materialSlug: string };
}) {
  const material = await getMaterial(params.slug, params.materialSlug);
  if (!material?.contentHtml) notFound();

  const headings = extractHeadings(material.contentHtml);
  const readingTime = estimateReadingTime(material.contentHtml);
  const wordCount = getWordCount(material.contentHtml);

  const siblings = await prisma.material.findMany({
    where: {
      courseId: material.courseId,
      contentHtml: { not: null },
      slug: { not: null },
    },
    orderBy: { order: "asc" },
    select: { slug: true, title: true, type: true },
  });

  const idx = siblings.findIndex((s) => s.slug === material.slug);
  const prev = idx > 0 ? siblings[idx - 1] : null;
  const next = idx < siblings.length - 1 ? siblings[idx + 1] : null;

  return (
    <ContentLayout
      breadcrumbs={[
        { label: "Home", href: "/" },
        { label: "Courses", href: "/courses" },
        { label: material.course.title, href: `/courses/${params.slug}` },
        { label: material.title },
      ]}
      sidebar={
        <ContentSidebar
          headings={headings}
          fileUrl={material.fileUrl}
          materialId={material.id}
          updatedAt={material.updatedAt}
          prev={prev}
          next={next}
          courseSlug={params.slug}
        />
      }
    >
      <ContentHero
        title={material.title}
        subtitle={material.description || undefined}
        courseTitle={material.course.title}
        materialType={material.type}
        readingTime={readingTime}
        wordCount={wordCount}
      />
      <ContentRenderer html={material.contentHtml} />
      <MobileContentNav courseSlug={params.slug} prev={prev} next={next} />
    </ContentLayout>
  );
}
