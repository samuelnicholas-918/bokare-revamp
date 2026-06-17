import Link from "next/link";
import { EmptyState } from "@/components/ui/EmptyState";
import { CourseCard } from "@/components/CourseCard";
import { PageHero } from "@/components/PageHero";
import { Badge } from "@/components/ui/badge";
import { prisma } from "@/lib/db";
import {
  ACADEMIC_YEARS,
  cn,
  courseBelongsToYear,
  type AcademicYearId,
} from "@/lib/utils";

export const metadata = {
  title: "All Courses",
};

export const dynamic = "force-dynamic";

const categories = [
  { value: "ALL", label: "All" },
  { value: "CORE", label: "Core" },
  { value: "ELECTIVE", label: "Electives" },
  { value: "PROFESSIONAL", label: "Professional" },
];

function isAcademicYearId(value?: string): value is AcademicYearId {
  return ACADEMIC_YEARS.some((year) => year.id === value);
}

export default async function CoursesPage({
  searchParams,
}: {
  searchParams: { category?: string; year?: string };
}) {
  const category = searchParams.category?.toUpperCase();
  const year = isAcademicYearId(searchParams.year) ? searchParams.year : undefined;

  const courses = await prisma.course.findMany({
    where:
      category && category !== "ALL"
        ? { category: category as "CORE" | "ELECTIVE" | "PROFESSIONAL" }
        : undefined,
    orderBy: [{ category: "asc" }, { semester: "asc" }],
    include: { _count: { select: { materials: true } } },
  });

  const filteredCourses = year
    ? courses.filter((course) => courseBelongsToYear(course.semester, course.category, year))
    : courses;

  const activeYear = year ? ACADEMIC_YEARS.find((entry) => entry.id === year) : null;

  return (
    <div className="container mx-auto px-4 py-8">
      <PageHero
        eyebrow="Course catalog"
        title={activeYear ? `${activeYear.label} Courses` : "All Courses"}
        description={
          activeYear
            ? `Business Economics resources for ${activeYear.description.toLowerCase()}.`
            : "Browse every Business Economics course — filter by year or category."
        }
        className="mb-8"
      >
        <p className="text-sm font-medium text-muted-foreground">
          {filteredCourses.length} course{filteredCourses.length !== 1 ? "s" : ""} shown
        </p>
      </PageHero>

      <div className="mb-4 flex flex-wrap gap-2">
        <Link href={category && category !== "ALL" ? `/courses?category=${category}` : "/courses"}>
          <Badge
            variant={!year ? "default" : "outline"}
            className={cn("cursor-pointer px-4 py-1.5 text-sm")}
          >
            All Years
          </Badge>
        </Link>
        {ACADEMIC_YEARS.map((entry) => {
          const params = new URLSearchParams();
          params.set("year", entry.id);
          if (category && category !== "ALL") params.set("category", category);

          return (
            <Link key={entry.id} href={`/courses?${params.toString()}`}>
              <Badge
                variant={year === entry.id ? "default" : "outline"}
                className={cn("cursor-pointer px-4 py-1.5 text-sm")}
              >
                {entry.label}
              </Badge>
            </Link>
          );
        })}
      </div>

      <div className="mb-8 flex flex-wrap gap-2">
        {categories.map((cat) => {
          const params = new URLSearchParams();
          if (cat.value !== "ALL") params.set("category", cat.value);
          if (year) params.set("year", year);

          return (
            <Link
              key={cat.value}
              href={params.toString() ? `/courses?${params.toString()}` : "/courses"}
            >
              <Badge
                variant={
                  (!category && cat.value === "ALL") || category === cat.value ? "default" : "outline"
                }
                className={cn("cursor-pointer px-4 py-1.5 text-sm")}
              >
                {cat.label}
              </Badge>
            </Link>
          );
        })}
      </div>

      {filteredCourses.length === 0 ? (
        <EmptyState
          variant="courses-filter"
          action={{ label: "View all courses", href: "/courses" }}
          secondaryAction={
            year
              ? { label: "Go home", href: "/" }
              : { label: "Search materials", href: "/search" }
          }
        />
      ) : (
        <div className="stagger-grid grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filteredCourses.map((course, i) => (
            <CourseCard key={course.id} course={course} index={i} />
          ))}
        </div>
      )}
    </div>
  );
}
