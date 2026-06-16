import Link from "next/link";
import { BookOpen, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { MaterialTypeBadge } from "@/components/content/MaterialTypeBadge";
import { MaterialDownloadButton } from "@/components/analytics/MaterialDownloadButton";
import { formatDate, formatFileSize } from "@/lib/utils";
import type { Material } from "@prisma/client";

interface MaterialListProps {
  materials: Material[];
  courseSlug: string;
}

export function MaterialList({ materials, courseSlug }: MaterialListProps) {
  if (materials.length === 0) {
    return (
      <div className="rounded-xl border border-dashed p-8 text-center text-muted-foreground">
        <FileText className="mx-auto mb-2 h-8 w-8 opacity-50" />
        <p>No materials available yet in this category.</p>
        <p className="mt-1 text-sm">Check back soon — content is being organized.</p>
      </div>
    );
  }

  return (
    <ul className="space-y-3">
      {materials.map((material) => {
        const hasReader = material.slug && material.contentHtml;
        const href = hasReader
          ? `/courses/${courseSlug}/learn/${material.slug}`
          : material.fileUrl
            ? `/api/materials/${material.id}/download`
            : material.externalUrl;

        return (
          <li
            key={material.id}
            className="group rounded-xl border bg-card p-4 transition-all active:scale-[0.99] md:hover:-translate-y-0.5 md:hover:border-teal/40 md:hover:shadow-md"
          >
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  {hasReader ? (
                    <Link
                      href={href!}
                      className="font-medium group-hover:text-teal"
                    >
                      {material.title}
                    </Link>
                  ) : (
                    <h4 className="font-medium">{material.title}</h4>
                  )}
                  <MaterialTypeBadge type={material.type} />
                </div>
                {material.description && (
                  <p className="mt-1 text-sm text-muted-foreground">{material.description}</p>
                )}
                <p className="mt-1 text-xs text-muted-foreground">
                  Updated {formatDate(material.updatedAt)}
                  {material.fileSizeBytes ? ` · ${formatFileSize(material.fileSizeBytes)}` : ""}
                </p>
              </div>
              <div className="flex shrink-0 gap-2">
                {hasReader && (
                  <Button size="sm" asChild className="bg-teal hover:bg-teal/90">
                    <Link href={href!}>
                      <BookOpen className="mr-1 h-4 w-4" />
                      Read
                    </Link>
                  </Button>
                )}
                {material.fileUrl && (
                  <MaterialDownloadButton href={`/api/materials/${material.id}/download`} />
                )}
                {!hasReader && material.externalUrl && !material.fileUrl && (
                  <Button size="sm" variant="outline" asChild>
                    <a href={material.externalUrl} target="_blank" rel="noopener noreferrer">
                      View
                    </a>
                  </Button>
                )}
              </div>
            </div>
          </li>
        );
      })}
    </ul>
  );
}
