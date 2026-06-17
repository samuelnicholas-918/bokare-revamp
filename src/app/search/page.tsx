import Link from "next/link";
import { Suspense } from "react";
import { SearchBar } from "@/components/SearchBar";
import { SearchTracker } from "@/components/analytics/SearchTracker";
import { MaterialRow } from "@/components/MaterialRow";
import { PageHero } from "@/components/PageHero";
import { Badge } from "@/components/ui/badge";
import { EmptyState } from "@/components/ui/EmptyState";
import { prisma } from "@/lib/db";
import { getMaterialHref, isExternalMaterialHref } from "@/lib/material-links";
import { MATERIAL_TYPE_LABELS } from "@/lib/utils";
import { MaterialType } from "@prisma/client";

export const metadata = {
  title: "Search Materials",
};

export const dynamic = "force-dynamic";

export default async function SearchPage({
  searchParams,
}: {
  searchParams: { q?: string; type?: string; semester?: string };
}) {
  const q = searchParams.q?.trim();
  const type = searchParams.type as MaterialType | undefined;
  const semester = searchParams.semester ? parseInt(searchParams.semester, 10) : undefined;

  let results: Awaited<
    ReturnType<
      typeof prisma.material.findMany<{
        include: { course: { select: { title: true; slug: true; semester: true } } };
      }>
    >
  > = [];

  if (q || type || semester) {
    results = await prisma.material.findMany({
      where: {
        ...(q && {
          OR: [
            { title: { contains: q, mode: "insensitive" } },
            { description: { contains: q, mode: "insensitive" } },
          ],
        }),
        ...(type && { type }),
        ...(semester && { course: { semester } }),
      },
      include: {
        course: { select: { title: true, slug: true, semester: true } },
      },
      orderBy: { updatedAt: "desc" },
      take: 50,
    });
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <Suspense fallback={null}>
        <SearchTracker resultCount={results.length} />
      </Suspense>

      <PageHero
        eyebrow="Search"
        title="Find study materials"
        description="Lecture notes, syllabi, PDFs — across all semesters."
        compact
        className="mb-8"
      >
        <SearchBar defaultValue={q} />
      </PageHero>

      <div className="mb-6 flex flex-wrap gap-2">
        {Object.entries(MATERIAL_TYPE_LABELS).map(([key, label]) => (
          <Link
            key={key}
            href={`/search?${new URLSearchParams({ ...(q && { q }), type: key }).toString()}`}
          >
            <Badge variant={type === key ? "default" : "outline"} className="cursor-pointer px-3 py-1 transition-colors hover:border-primary/40">
              {label}
            </Badge>
          </Link>
        ))}
      </div>

      <div className="mt-4">
        {!q && !type && !semester ? (
          <EmptyState variant="search-prompt" />
        ) : results.length === 0 ? (
          <EmptyState
            variant="search-empty"
            query={q}
            action={{ label: "View all courses", href: "/courses" }}
            secondaryAction={{ label: "Clear search", href: "/search" }}
          />
        ) : (
          <>
            <p className="mb-4 text-sm text-muted-foreground">
              {results.length} result{results.length !== 1 ? "s" : ""}
              {q ? ` for “${q}”` : ""}
            </p>
            <ul className="space-y-2">
              {results.map((material, index) => {
                const href = getMaterialHref(material);
                return (
                  <MaterialRow
                    key={material.id}
                    title={material.title}
                    courseTitle={material.course.title}
                    semester={material.course.semester}
                    type={material.type}
                    href={href}
                    external={isExternalMaterialHref(href)}
                    highlightQuery={q}
                    index={index}
                  />
                );
              })}
            </ul>
          </>
        )}
      </div>
    </div>
  );
}
