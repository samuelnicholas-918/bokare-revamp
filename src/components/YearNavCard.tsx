import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { getYearVisual } from "@/lib/year-visuals";
import { cn } from "@/lib/utils";
import type { AcademicYearId } from "@/lib/utils";

interface YearNavCardProps {
  id: AcademicYearId;
  label: string;
  description: string;
  courseCount: number;
  materialCount: number;
  className?: string;
  index?: number;
}

export function YearNavCard({
  id,
  label,
  description,
  courseCount,
  materialCount,
  className,
  index = 0,
}: YearNavCardProps) {
  const { icon: Icon, accent, roman, shortLabel } = getYearVisual(id);

  return (
    <Link
      href={`#${id}`}
      className={cn(
        "group flex min-w-0 flex-col rounded-2xl border bg-card p-5 list-item-enter",
        "transition-[transform,box-shadow,border-color] duration-300 ease-out",
        "active:scale-[0.98] md:hover:-translate-y-0.5 md:hover:border-primary/50 md:hover:shadow-md",
        "surface-card",
        materialCount === 0 && "border-dashed",
        className
      )}
      style={{ animationDelay: `${Math.min(index * 60, 300)}ms` }}
    >
      <div className="mb-4 flex items-start justify-between gap-3">
        <div
          className={cn(
            "flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-gradient-to-br text-white shadow-sm ring-1 ring-white/10",
            accent
          )}
          aria-hidden
        >
          <Icon className="h-6 w-6 shrink-0" strokeWidth={2} />
        </div>
        <span className="shrink-0 rounded-lg border border-primary/15 bg-primary/5 px-2.5 py-1 font-mono text-xs font-semibold tracking-wide text-primary">
          {shortLabel}
        </span>
      </div>

      <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-primary">
        {description}
      </p>
      <h3 className="mt-1.5 font-display text-xl font-bold leading-tight group-hover:text-primary md:text-2xl">
        <span className="sr-only">Year {roman}: </span>
        {label}
      </h3>
      <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-muted-foreground">
        {courseCount} course{courseCount !== 1 ? "s" : ""}
        {materialCount > 0
          ? ` · ${materialCount} material${materialCount !== 1 ? "s" : ""}`
          : " · notes still loading"}
      </p>
      <span className="mt-auto inline-flex items-center pt-4 text-sm font-medium text-primary">
        Browse {label.toLowerCase()}
        <ArrowRight className="ml-1 h-4 w-4 shrink-0 transition-transform group-hover:translate-x-1" />
      </span>
    </Link>
  );
}
