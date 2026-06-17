import Link from "next/link";
import { BookOpen, FileText } from "lucide-react";
import { EmptyState } from "@/components/ui/EmptyState";
import { Button } from "@/components/ui/button";
import { MaterialTypeBadge } from "@/components/content/MaterialTypeBadge";
import { MaterialDownloadButton } from "@/components/analytics/MaterialDownloadButton";
import { getMaterialHref, isExternalMaterialHref } from "@/lib/material-links";
import { formatDate, formatFileSize } from "@/lib/utils";
import type { Material } from "@prisma/client";

interface MaterialListProps {
  materials: Material[];
  courseSlug: string;
}

export function MaterialList({ materials, courseSlug }: MaterialListProps) {
  if (materials.length === 0) {
    return (
      <EmptyState
        variant="materials"
        compact
        action={{ label: "Browse other courses", href: "/courses" }}
        secondaryAction={{ label: "Search materials", href: "/search" }}
      />
    );
  }

  return (
    <ul className="space-y-3">
      {materials.map((material, index) => {
        const href = getMaterialHref({ ...material, course: { slug: courseSlug } });
        const hasReader = !!(material.slug && material.contentHtml);
        const external = href ? isExternalMaterialHref(href) : false;

        return (
          <li
            key={material.id}
            className="material-list-item group"
            style={{ animationDelay: `${Math.min(index * 40, 280)}ms` }}
          >
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex min-w-0 flex-1 gap-3">
                <div
                  className={
                    hasReader
                      ? "material-list-icon"
                      : "flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-muted text-muted-foreground"
                  }
                >
                  {hasReader ? <BookOpen className="h-5 w-5" /> : <FileText className="h-5 w-5" />}
                </div>
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    {href && (hasReader || external) ? (
                      external ? (
                        <a
                          href={href}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="font-medium group-hover:text-primary"
                        >
                          {material.title}
                        </a>
                      ) : (
                        <Link href={href} className="font-medium group-hover:text-primary">
                          {material.title}
                        </Link>
                      )
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
              </div>
              <div className="flex shrink-0 gap-2">
                {hasReader && href && (
                  <Button size="sm" asChild>
                    <Link href={href}>
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
