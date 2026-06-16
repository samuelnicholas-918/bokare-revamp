import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { CourseCard } from "@/components/CourseCard";
import { Button } from "@/components/ui/button";
import { ACADEMIC_YEARS, courseBelongsToYear } from "@/lib/utils";
import type { CourseWithMaterials } from "@/types";

interface YearCourseSectionProps {
  courses: CourseWithMaterials[];
  showElectives?: boolean;
}

export function YearCourseSections({ courses, showElectives = true }: YearCourseSectionProps) {
  return (
    <>
      {ACADEMIC_YEARS.map((year) => {
        const yearCourses = courses.filter(
          (course) =>
            course.category === "CORE" && courseBelongsToYear(course.semester, course.category, year.id)
        );
        const yearElectives =
          showElectives && year.id === "third-year"
            ? courses.filter(
                (course) =>
                  course.category === "ELECTIVE" &&
                  courseBelongsToYear(course.semester, course.category, year.id)
              )
            : [];
        const materialCount = [...yearCourses, ...yearElectives].reduce(
          (total, course) => total + (course._count?.materials ?? 0),
          0
        );

        if (yearCourses.length === 0 && yearElectives.length === 0) return null;

        return (
          <section
            key={year.id}
            id={year.id}
            className="scroll-mt-24 border-b py-12 last:border-b-0"
          >
            <div className="container mx-auto px-4">
              <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
                <div>
                  <p className="text-sm font-medium text-primary">{year.description}</p>
                  <h2 className="font-display text-2xl font-bold md:text-3xl">{year.label}</h2>
                  <p className="mt-1 text-muted-foreground">
                    {yearCourses.length + yearElectives.length} course
                    {yearCourses.length + yearElectives.length !== 1 ? "s" : ""} · {materialCount}{" "}
                    materials
                  </p>
                </div>
                <Button variant="outline" size="sm" asChild className="hidden sm:inline-flex">
                  <Link href={`/courses?year=${year.id}`}>
                    View {year.label.toLowerCase()} only
                    <ArrowRight className="ml-1 h-4 w-4" />
                  </Link>
                </Button>
              </div>

              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {yearCourses.map((course) => (
                  <CourseCard key={course.id} course={course} />
                ))}
              </div>

              {yearElectives.length > 0 && (
                <div className="mt-8">
                  <h3 className="mb-4 text-lg font-semibold">Electives</h3>
                  <div className="grid gap-4 sm:grid-cols-2">
                    {yearElectives.map((course) => (
                      <CourseCard key={course.id} course={course} />
                    ))}
                  </div>
                </div>
              )}
            </div>
          </section>
        );
      })}
    </>
  );
}
