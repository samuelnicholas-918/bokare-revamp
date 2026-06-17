import Link from "next/link";
import { ArrowRight, BookMarked } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { getAcademicYear, cn } from "@/lib/utils";
import { CATEGORY_ACCENT, getCourseIcon } from "@/lib/course-visuals";
import type { CourseWithMaterials } from "@/types";

interface CourseCardProps {
  course: CourseWithMaterials;
  index?: number;
}

const categoryLabels: Record<string, string> = {
  CORE: "Core",
  ELECTIVE: "Elective",
  PROFESSIONAL: "Professional",
};

export function CourseCard({ course, index = 0 }: CourseCardProps) {
  const materialCount = course._count?.materials ?? course.materials?.length ?? 0;
  const academicYear = getAcademicYear(course.semester);
  const isEmpty = materialCount === 0;
  const Icon = getCourseIcon(course.slug, course.category);
  const accent = CATEGORY_ACCENT[course.category];

  return (
    <Link
      href={`/courses/${course.slug}`}
      className="block h-full"
      style={{ animationDelay: `${Math.min(index * 50, 400)}ms` }}
    >
      <Card
        className={cn(
          "card-interactive group relative h-full overflow-hidden border bg-card surface-card md:hover:border-primary/50 md:hover:shadow-md",
          "list-item-enter",
          isEmpty && "border-dashed opacity-90"
        )}
      >
        <div className={cn("absolute inset-x-0 top-0 h-1 bg-gradient-to-r", accent)} aria-hidden />
        <CardHeader className="pt-7">
          <div className="mb-3 flex items-start justify-between gap-3">
            <div
              className={cn(
                "flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br text-white shadow-sm",
                accent
              )}
            >
              <Icon className="h-5 w-5" />
            </div>
            <Badge variant="outline" className="shrink-0">
              {categoryLabels[course.category]}
            </Badge>
          </div>
          <div className="flex flex-wrap gap-1">
            {academicYear && <Badge>{academicYear}</Badge>}
            <Badge variant="secondary">
              {course.category === "ELECTIVE"
                ? `Sem ${course.semester}E`
                : course.semester > 0
                  ? `Sem ${course.semester}`
                  : "PD"}
            </Badge>
          </div>
          <CardTitle className="mt-2 group-hover:text-primary">{course.title}</CardTitle>
          <CardDescription className="line-clamp-2">
            {isEmpty
              ? "Notes incoming — the professor hasn't uploaded here yet."
              : course.description}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between text-sm text-muted-foreground">
            <span className="flex items-center gap-1.5">
              <BookMarked className="h-4 w-4 text-primary/70" />
              {isEmpty ? "Coming soon" : `${materialCount} material${materialCount !== 1 ? "s" : ""}`}
            </span>
            <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1 group-hover:text-primary" />
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
