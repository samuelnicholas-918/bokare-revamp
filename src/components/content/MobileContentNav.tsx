import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface MobileContentNavProps {
  courseSlug: string;
  prev?: { slug: string | null; title: string } | null;
  next?: { slug: string | null; title: string } | null;
}

export function MobileContentNav({ courseSlug, prev, next }: MobileContentNavProps) {
  if (!prev?.slug && !next?.slug) return null;

  return (
    <div className="flex gap-2 border-t pt-4 md:hidden">
      {prev?.slug ? (
        <Link
          href={`/courses/${courseSlug}/learn/${prev.slug}`}
          className="card-interactive flex min-h-11 flex-1 items-center gap-2 rounded-lg border bg-card p-3 text-sm"
        >
          <ChevronLeft className="h-4 w-4 shrink-0 text-teal" />
          <div className="min-w-0">
            <p className="text-xs text-muted-foreground">Previous</p>
            <p className="truncate font-medium">{prev.title}</p>
          </div>
        </Link>
      ) : (
        <div className="flex-1" />
      )}
      {next?.slug ? (
        <Link
          href={`/courses/${courseSlug}/learn/${next.slug}`}
          className="card-interactive flex min-h-11 flex-1 items-center justify-end gap-2 rounded-lg border bg-card p-3 text-sm text-right"
        >
          <div className="min-w-0">
            <p className="text-xs text-muted-foreground">Next</p>
            <p className="truncate font-medium">{next.title}</p>
          </div>
          <ChevronRight className="h-4 w-4 shrink-0 text-teal" />
        </Link>
      ) : (
        <div className="flex-1" />
      )}
    </div>
  );
}
