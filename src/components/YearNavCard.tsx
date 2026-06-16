import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";
import type { AcademicYearId } from "@/lib/utils";

interface YearNavCardProps {
  id: AcademicYearId;
  label: string;
  description: string;
  courseCount: number;
  materialCount: number;
  className?: string;
}

export function YearNavCard({
  id,
  label,
  description,
  courseCount,
  materialCount,
  className,
}: YearNavCardProps) {
  return (
    <Link
      href={`#${id}`}
      className={cn(
        "group flex flex-col rounded-2xl border bg-card p-5 transition-all",
        "active:scale-[0.98] md:hover:-translate-y-0.5 md:hover:border-primary/50 md:hover:shadow-md",
        className
      )}
    >
      <p className="text-xs font-semibold uppercase tracking-wide text-primary">{description}</p>
      <h3 className="mt-1 font-display text-xl font-bold group-hover:text-primary md:text-2xl">
        {label}
      </h3>
      <p className="mt-2 text-sm text-muted-foreground">
        {courseCount} course{courseCount !== 1 ? "s" : ""} · {materialCount} material
        {materialCount !== 1 ? "s" : ""}
      </p>
      <span className="mt-4 inline-flex items-center text-sm font-medium text-primary">
        Browse {label.toLowerCase()}
        <ArrowRight className="ml-1 h-4 w-4 transition-transform group-hover:translate-x-1" />
      </span>
    </Link>
  );
}
