import Link from "next/link";
import { Suspense } from "react";
import { SearchBar } from "@/components/SearchBar";
import { SearchTracker } from "@/components/analytics/SearchTracker";
import { Badge } from "@/components/ui/badge";
import { prisma } from "@/lib/db";
import { MATERIAL_TYPE_LABELS } from "@/lib/utils";
import { MaterialType } from "@prisma/client";
import { FileText, SearchX } from "lucide-react";

export const metadata = {
  title: "Search Materials",
};

export const dynamic = "force-dynamic";

function highlightMatch(text: string, query: string): string {
  if (!query) return text;
  const regex = new RegExp(`(${query.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")})`, "gi");
  return text.replace(regex, "<mark class='bg-primary/20 rounded px-0.5'>$1</mark>");
}

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
      <div className="mx-auto max-w-2xl">
        <h1 className="font-display text-3xl font-bold">Search Materials</h1>
        <p className="mt-2 text-muted-foreground">
          Find lecture notes, PDFs, and resources across all courses.
        </p>
        <div className="mt-6">
          <SearchBar defaultValue={q} />
        </div>
      </div>

      <div className="mt-6 flex flex-wrap gap-2">
        {Object.entries(MATERIAL_TYPE_LABELS).map(([key, label]) => (
          <Link
            key={key}
            href={`/search?${new URLSearchParams({ ...(q && { q }), type: key }).toString()}`}
          >
            <Badge variant={type === key ? "default" : "outline"} className="cursor-pointer">
              {label}
            </Badge>
          </Link>
        ))}
      </div>

      <div className="mt-8">
        {!q && !type && !semester ? (
          <div className="rounded-lg border border-dashed p-12 text-center text-muted-foreground">
            <SearchX className="mx-auto mb-3 h-10 w-10 opacity-50" />
            <p>Enter a search term or select a filter to find materials.</p>
          </div>
        ) : results.length === 0 ? (
          <div className="rounded-lg border border-dashed p-12 text-center text-muted-foreground">
            <FileText className="mx-auto mb-3 h-10 w-10 opacity-50" />
            <p>No results found{q ? ` for "${q}"` : ""}.</p>
            <p className="mt-1 text-sm">Try different keywords or remove filters.</p>
          </div>
        ) : (
          <>
            <p className="mb-4 text-sm text-muted-foreground">
              {results.length} result{results.length !== 1 ? "s" : ""}
              {q ? ` for "${q}"` : ""}
            </p>
            <ul className="space-y-3">
              {results.map((material) => (
                <li key={material.id} className="rounded-lg border p-4 hover:bg-muted/50">
                  <div className="flex flex-wrap items-center gap-2">
                    <Link
                      href={`/courses/${material.course.slug}`}
                      className="font-medium hover:text-primary"
                      dangerouslySetInnerHTML={{
                        __html: highlightMatch(material.title, q || ""),
                      }}
                    />
                    <Badge variant="outline">
                      {MATERIAL_TYPE_LABELS[material.type]}
                    </Badge>
                  </div>
                  <p className="mt-1 text-sm text-muted-foreground">
                    in{" "}
                    <Link href={`/courses/${material.course.slug}`} className="hover:underline">
                      {material.course.title}
                    </Link>
                    {" "}(Sem {material.course.semester})
                  </p>
                </li>
              ))}
            </ul>
          </>
        )}
      </div>
    </div>
  );
}
