import { Clock, BookOpen } from "lucide-react";
import { MaterialTypeBadge } from "./MaterialTypeBadge";

interface ContentHeroProps {
  title: string;
  subtitle?: string;
  courseTitle: string;
  materialType: string;
  readingTime: number;
  wordCount: number;
}

export function ContentHero({
  title,
  subtitle,
  courseTitle,
  materialType,
  readingTime,
  wordCount,
}: ContentHeroProps) {
  return (
    <section className="relative overflow-hidden rounded-xl bg-gradient-to-br from-teal via-teal to-electric-blue px-5 py-8 text-white md:rounded-2xl md:px-10 md:py-14">
      <div className="absolute -right-16 -top-16 h-48 w-48 rounded-full bg-white/10 blur-3xl md:h-64 md:w-64" />
      <div className="absolute -bottom-8 -left-8 h-32 w-32 rounded-full bg-purple/20 blur-2xl" />

      <div className="relative">
        <div className="mb-3 flex flex-wrap items-center gap-2 md:mb-4">
          <span className="inline-flex items-center rounded-md bg-white/20 px-3 py-1 text-xs font-medium text-white md:text-sm">
            {courseTitle}
          </span>
          <MaterialTypeBadge type={materialType} className="border-0" />
        </div>

        <h1 className="font-display text-2xl font-bold tracking-tight text-white md:text-4xl lg:text-5xl">
          {title}
        </h1>

        {subtitle && (
          <p className="mt-2 max-w-2xl text-sm text-white/85 md:mt-3 md:text-lg">{subtitle}</p>
        )}

        <div className="mt-4 flex flex-wrap gap-3 text-xs text-white/80 md:mt-6 md:gap-4 md:text-sm">
          <span className="flex items-center gap-1.5">
            <Clock className="h-4 w-4 shrink-0" />
            {readingTime} min read
          </span>
          <span className="flex items-center gap-1.5">
            <BookOpen className="h-4 w-4 shrink-0" />
            {wordCount.toLocaleString()} words
          </span>
        </div>
      </div>
    </section>
  );
}
