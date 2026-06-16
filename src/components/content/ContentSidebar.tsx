import Link from "next/link";
import { Download, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { TableOfContents } from "./TableOfContents";
import { formatDate } from "@/lib/utils";

interface RelatedMaterial {
  slug: string | null;
  title: string;
  type: string;
}

interface ContentSidebarProps {
  headings: { id: string; text: string; level: number }[];
  fileUrl?: string | null;
  materialId: string;
  updatedAt: Date;
  prev?: RelatedMaterial | null;
  next?: RelatedMaterial | null;
  courseSlug: string;
}

export function ContentSidebar({
  headings,
  fileUrl,
  materialId,
  updatedAt,
  prev,
  next,
  courseSlug,
}: ContentSidebarProps) {
  return (
    <aside className="space-y-4 md:space-y-6">
      <TableOfContents headings={headings} />

      <div className="rounded-xl border bg-card p-4">
        <h3 className="mb-3 text-sm font-semibold">Actions</h3>
        <div className="space-y-2">
          {fileUrl && (
            <Button className="w-full min-h-11 bg-teal hover:bg-teal/90" size="sm" asChild>
              <a href={`/api/materials/${materialId}/download`}>
                <Download className="mr-2 h-4 w-4" />
                Download PDF
              </a>
            </Button>
          )}
          <Button variant="outline" className="w-full min-h-11" size="sm" asChild>
            <Link href={`/courses/${courseSlug}`}>Back to Course</Link>
          </Button>
        </div>
        <p className="mt-3 text-xs text-muted-foreground">
          Updated {formatDate(updatedAt)}
        </p>
      </div>

      {(prev || next) && (
        <div className="hidden space-y-2 md:block">
          {prev?.slug && (
            <Link
              href={`/courses/${courseSlug}/learn/${prev.slug}`}
              className="card-interactive flex min-h-11 items-center gap-2 rounded-lg border bg-card p-3 text-sm"
            >
              <ChevronLeft className="h-4 w-4 shrink-0 text-teal" />
              <div className="min-w-0">
                <p className="text-xs text-muted-foreground">Previous</p>
                <p className="truncate font-medium">{prev.title}</p>
              </div>
            </Link>
          )}
          {next?.slug && (
            <Link
              href={`/courses/${courseSlug}/learn/${next.slug}`}
              className="card-interactive flex min-h-11 items-center gap-2 rounded-lg border bg-card p-3 text-sm"
            >
              <div className="min-w-0 flex-1 text-right">
                <p className="text-xs text-muted-foreground">Next</p>
                <p className="truncate font-medium">{next.title}</p>
              </div>
              <ChevronRight className="h-4 w-4 shrink-0 text-teal" />
            </Link>
          )}
        </div>
      )}
    </aside>
  );
}
