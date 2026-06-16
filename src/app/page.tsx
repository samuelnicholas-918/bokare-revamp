import Link from "next/link";
import { BookOpen, Clock, GraduationCap } from "lucide-react";
import { SearchBar } from "@/components/SearchBar";
import { YearCourseSections } from "@/components/YearCourseSections";
import { YearNavCard } from "@/components/YearNavCard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { prisma } from "@/lib/db";
import { ACADEMIC_YEARS, courseBelongsToYear, formatDate } from "@/lib/utils";

export const dynamic = "force-dynamic";

async function getHomeData() {
  const [courses, recentMaterials] = await Promise.all([
    prisma.course.findMany({
      orderBy: [{ category: "asc" }, { semester: "asc" }],
      include: {
        _count: { select: { materials: true } },
        materials: false,
      },
    }),
    prisma.material.findMany({
      orderBy: { updatedAt: "desc" },
      take: 5,
      include: {
        course: { select: { title: true, slug: true } },
      },
    }),
  ]);

  return { courses, recentMaterials };
}

export default async function HomePage() {
  const { courses, recentMaterials } = await getHomeData();

  const yearSummaries = ACADEMIC_YEARS.map((year) => {
    const yearCourses = courses.filter((course) =>
      courseBelongsToYear(course.semester, course.category, year.id)
    );
    const materialCount = yearCourses.reduce(
      (total, course) => total + (course._count?.materials ?? 0),
      0
    );

    return {
      ...year,
      courseCount: yearCourses.length,
      materialCount,
    };
  });

  return (
    <>
      <section className="border-b bg-gradient-to-br from-primary/5 via-background to-secondary/30 dark:from-primary/10 dark:via-background dark:to-secondary/20">
        <div className="container mx-auto px-4 py-10 md:py-16 lg:py-24">
          <div className="mx-auto max-w-3xl text-center">
            <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-primary/10 px-3 py-1.5 text-xs font-medium text-primary md:mb-4 md:px-4 md:text-sm">
              <GraduationCap className="h-4 w-4" />
              B.Com Business Economics
            </div>
            <h1 className="font-display text-[1.75rem] font-bold tracking-tight md:text-5xl lg:text-6xl">
              Your Economics Study Hub
            </h1>
            <p className="mt-3 text-base text-muted-foreground md:mt-4 md:text-xl">
              Pick your year, find your semester, and download everything you need — no login
              required.
            </p>
            <div className="mx-auto mt-8 max-w-xl">
              <SearchBar size="lg" />
            </div>
          </div>
        </div>
      </section>

      <section className="container mx-auto px-4 py-10 md:py-12">
        <div className="mb-6 text-center md:mb-8">
          <h2 className="font-display text-2xl font-bold md:text-3xl">Choose Your Year</h2>
          <p className="mt-1 text-muted-foreground">
            Jump straight to First, Second, or Third Year courses
          </p>
        </div>
        <div className="grid gap-4 md:grid-cols-3">
          {yearSummaries.map((year) => (
            <YearNavCard
              key={year.id}
              id={year.id}
              label={year.label}
              description={year.description}
              courseCount={year.courseCount}
              materialCount={year.materialCount}
            />
          ))}
        </div>
      </section>

      <YearCourseSections courses={courses} />

      <section className="container mx-auto px-4 py-12">
        <div className="grid gap-8 lg:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="h-5 w-5 text-primary" />
                Recently Updated
              </CardTitle>
            </CardHeader>
            <CardContent>
              {recentMaterials.length === 0 ? (
                <p className="text-sm text-muted-foreground">No materials yet.</p>
              ) : (
                <ul className="space-y-3">
                  {recentMaterials.map((m) => (
                    <li key={m.id}>
                      <Link
                        href={`/courses/${m.course.slug}`}
                        className="block rounded-lg p-2 hover:bg-muted"
                      >
                        <p className="font-medium">{m.title}</p>
                        <p className="text-sm text-muted-foreground">
                          {m.course.title} · {formatDate(m.updatedAt)}
                        </p>
                      </Link>
                    </li>
                  ))}
                </ul>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BookOpen className="h-5 w-5 text-primary" />
                Quick Access
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-2">
                {[
                  { label: "First Year", href: "#first-year" },
                  { label: "Second Year", href: "#second-year" },
                  { label: "Third Year", href: "#third-year" },
                  { label: "All Materials", href: "/search" },
                ].map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className="rounded-lg border p-3 text-center text-sm font-medium transition-colors hover:border-primary hover:bg-primary/5"
                  >
                    {item.label}
                  </Link>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </section>
    </>
  );
}
