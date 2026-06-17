import Link from "next/link";
import { ArrowUpRight, BookOpen, FileText } from "lucide-react";
import { MaterialTypeBadge } from "@/components/content/MaterialTypeBadge";
import { cn } from "@/lib/utils";
import type { MaterialType } from "@prisma/client";

interface MaterialRowProps {
  title: string;
  courseTitle: string;
  semester?: number;
  type: MaterialType;
  href: string;
  external?: boolean;
  dateLabel?: string;
  highlightQuery?: string;
  index?: number;
  className?: string;
}

function highlightText(text: string, query?: string): React.ReactNode {
  if (!query?.trim()) return text;
  const regex = new RegExp(`(${query.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")})`, "gi");
  const parts = text.split(regex);
  return parts.map((part, i) =>
    i % 2 === 1 ? (
      <mark key={i} className="rounded bg-primary/20 px-0.5 text-foreground">
        {part}
      </mark>
    ) : (
      part
    )
  );
}

export function MaterialRow({
  title,
  courseTitle,
  semester,
  type,
  href,
  external = false,
  dateLabel,
  highlightQuery,
  index = 0,
  className,
}: MaterialRowProps) {
  const hasReader = !external && href.includes("/learn/");

  const content = (
    <>
      <div
        className={cn(
          "flex h-11 w-11 shrink-0 items-center justify-center rounded-xl transition-colors",
          hasReader ? "bg-primary/10 text-primary" : "bg-muted text-muted-foreground"
        )}
      >
        {hasReader ? <BookOpen className="h-5 w-5" /> : <FileText className="h-5 w-5" />}
      </div>
      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center gap-2">
          <span className="font-medium group-hover:text-primary">
            {highlightText(title, highlightQuery)}
          </span>
          <MaterialTypeBadge type={type} />
        </div>
        <p className="mt-0.5 text-sm text-muted-foreground">
          {courseTitle}
          {semester ? ` · Sem ${semester}` : ""}
          {dateLabel ? ` · ${dateLabel}` : ""}
        </p>
      </div>
      <ArrowUpRight className="h-4 w-4 shrink-0 text-muted-foreground opacity-0 transition-all group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-primary group-hover:opacity-100" />
    </>
  );

  const rowClass = cn(
    "group list-item-enter flex items-center gap-4 rounded-xl border bg-card p-4 surface-card transition-[transform,box-shadow,border-color] duration-300",
    "hover:border-primary/30 hover:shadow-md active:scale-[0.99] md:hover:-translate-y-0.5",
    className
  );

  const style = { animationDelay: `${Math.min(index * 45, 360)}ms` };

  if (external) {
    return (
      <li className={rowClass} style={style}>
        <a href={href} target="_blank" rel="noopener noreferrer" className="flex w-full items-center gap-4">
          {content}
        </a>
      </li>
    );
  }

  return (
    <li className={rowClass} style={style}>
      <Link href={href} className="flex w-full items-center gap-4">
        {content}
      </Link>
    </li>
  );
}
