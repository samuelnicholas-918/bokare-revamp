import Link from "next/link";
import { CourseCard } from "@/components/CourseCard";
import { Badge } from "@/components/ui/badge";
import { prisma } from "@/lib/db";
import { cn } from "@/lib/utils";

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

export default async function CoursesPage({
  searchParams,
}: {
  searchParams: { category?: string };
}) {
  const category = searchParams.category?.toUpperCase();

  const courses = await prisma.course.findMany({
    where: category && category !== "ALL" ? { category: category as "CORE" | "ELECTIVE" | "PROFESSIONAL" } : undefined,
    orderBy: [{ category: "asc" }, { semester: "asc" }],
    include: { _count: { select: { materials: true } } },
  });

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="font-display text-3xl font-bold">All Courses</h1>
        <p className="mt-2 text-muted-foreground">
          Browse all Business Economics courses organized by semester and category.
        </p>
      </div>

      <div className="mb-8 flex flex-wrap gap-2">
        {categories.map((cat) => (
          <Link key={cat.value} href={cat.value === "ALL" ? "/courses" : `/courses?category=${cat.value}`}>
            <Badge
              variant={(!category && cat.value === "ALL") || category === cat.value ? "default" : "outline"}
              className={cn("cursor-pointer px-4 py-1.5 text-sm")}
            >
              {cat.label}
            </Badge>
          </Link>
        ))}
      </div>

      {courses.length === 0 ? (
        <p className="text-muted-foreground">No courses found in this category.</p>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {courses.map((course) => (
            <CourseCard key={course.id} course={course} />
          ))}
        </div>
      )}
    </div>
  );
}
