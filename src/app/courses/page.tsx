import Link from "next/link";
import { CourseCard } from "@/components/CourseCard";
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
      <div className="mb-8">
        <h1 className="font-display text-3xl font-bold">
          {activeYear ? `${activeYear.label} Courses` : "All Courses"}
        </h1>
        <p className="mt-2 text-muted-foreground">
          {activeYear
            ? `Business Economics resources for ${activeYear.description.toLowerCase()}.`
            : "Browse all Business Economics courses organized by year and semester."}
        </p>
      </div>

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
        <p className="text-muted-foreground">No courses found for this filter.</p>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filteredCourses.map((course) => (
            <CourseCard key={course.id} course={course} />
          ))}
        </div>
      )}
    </div>
  );
}
