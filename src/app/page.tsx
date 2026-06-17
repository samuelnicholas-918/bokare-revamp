import Link from "next/link";
import { EmptyState } from "@/components/ui/EmptyState";
import { MaterialRow } from "@/components/MaterialRow";
import { BookOpen, Clock, GraduationCap } from "lucide-react";
import { SearchBar } from "@/components/SearchBar";
import { YearCourseSections } from "@/components/YearCourseSections";
import { YearNavCard } from "@/components/YearNavCard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { prisma } from "@/lib/db";
import { getMaterialHref, isExternalMaterialHref } from "@/lib/material-links";
import { YEAR_VISUALS } from "@/lib/year-visuals";
import { ACADEMIC_YEARS, courseBelongsToYear, formatDate } from "@/lib/utils";

export const dynamic = "force-dynamic";

async function getHomeData() {
  const [courses, recentMaterials] = await Promise.all([
    prisma.course.findMany({
      orderBy: [{ category: "asc" }, { semester: "asc" }],
      include: { _count: { select: { materials: true } } },
    }),
    prisma.material.findMany({
      orderBy: { updatedAt: "desc" },
      take: 5,
      include: {
        course: { select: { title: true, slug: true, semester: true } },
      },
    }),
  ]);

  return { courses, recentMaterials };
}

export default async function HomePage() {
  const { courses, recentMaterials } = await getHomeData();

  const totalMaterials = courses.reduce((n, c) => n + (c._count?.materials ?? 0), 0);

  const yearSummaries = ACADEMIC_YEARS.map((year) => {
    const yearCourses = courses.filter((course) =>
      courseBelongsToYear(course.semester, course.category, year.id)
    );
    const materialCount = yearCourses.reduce(
      (total, course) => total + (course._count?.materials ?? 0),
      0
    );

    return { ...year, courseCount: yearCourses.length, materialCount };
  });

  return (
    <>
      <section className="relative overflow-hidden border-b bg-gradient-to-br from-primary/8 via-background to-[hsl(var(--accent-electric)/0.06)] dark:from-primary/15 dark:via-background dark:to-[hsl(var(--accent-electric)/0.06)]">
        <div className="pointer-events-none absolute -right-32 top-0 h-72 w-72 rounded-full bg-primary/10 blur-3xl" />
        <div className="container relative mx-auto px-4 py-10 md:py-16 lg:py-20">
          <div className="mx-auto max-w-3xl text-center">
            <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-3 py-1.5 text-xs font-medium text-primary md:mb-4 md:px-4 md:text-sm">
              <GraduationCap className="h-4 w-4" />
              B.Com Business Economics
            </div>
            <h1 className="font-display text-[1.75rem] font-bold tracking-tight md:text-5xl lg:text-6xl">
              Your Economics Study Hub
            </h1>
            <p className="mt-3 text-base text-muted-foreground md:mt-4 md:text-xl">
              Lecture notes, syllabi, and PDFs — organised by year and semester. No login required.
            </p>
            <div className="mx-auto mt-8 max-w-xl">
              <SearchBar size="lg" />
              <p className="mt-2 text-xs text-muted-foreground">Press <kbd className="rounded border bg-muted px-1.5 py-0.5 font-mono text-[10px]">/</kbd> to search anytime</p>
            </div>
            <div className="stats-strip">
              <div className="stat-item">
                <span className="stat-value">{courses.length}</span>
                <span className="stat-label">Courses</span>
              </div>
              <div className="stat-item">
                <span className="stat-value">{totalMaterials}</span>
                <span className="stat-label">Materials</span>
              </div>
              <div className="stat-item">
                <span className="stat-value">6</span>
                <span className="stat-label">Semesters</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="container mx-auto px-4 py-10 md:py-12">
        <div className="section-header">
          <h2>Choose Your Year</h2>
          <p>Jump straight to First, Second, or Third Year courses</p>
        </div>
        <div className="stagger-grid grid gap-4 md:grid-cols-3">
          {yearSummaries.map((year, i) => (
            <YearNavCard
              key={year.id}
              id={year.id}
              label={year.label}
              description={year.description}
              courseCount={year.courseCount}
              materialCount={year.materialCount}
              index={i}
            />
          ))}
        </div>
      </section>

      <YearCourseSections courses={courses} />

      <section className="container mx-auto px-4 py-12">
        <div className="grid gap-8 lg:grid-cols-2">
          <Card className="surface-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="h-5 w-5 text-primary" />
                Recently Updated
              </CardTitle>
            </CardHeader>
            <CardContent>
              {recentMaterials.length === 0 ? (
                <EmptyState variant="recent" compact />
              ) : (
                <ul className="space-y-2">
                  {recentMaterials.map((m, i) => {
                    const href = getMaterialHref(m);
                    return (
                      <MaterialRow
                        key={m.id}
                        title={m.title}
                        courseTitle={m.course.title}
                        semester={m.course.semester}
                        type={m.type}
                        href={href}
                        external={isExternalMaterialHref(href)}
                        dateLabel={formatDate(m.updatedAt)}
                        index={i}
                      />
                    );
                  })}
                </ul>
              )}
            </CardContent>
          </Card>

          <Card className="surface-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BookOpen className="h-5 w-5 text-primary" />
                Quick Access
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-3">
                {(
                  [
                    { yearId: "first-year" as const, label: "First Year", href: "#first-year" },
                    { yearId: "second-year" as const, label: "Second Year", href: "#second-year" },
                    { yearId: "third-year" as const, label: "Third Year", href: "#third-year" },
                    { label: "All Materials", href: "/search", icon: BookOpen },
                  ] as const
                ).map((item) => {
                  const visual = "yearId" in item ? YEAR_VISUALS[item.yearId] : null;
                  const Icon = visual?.icon ?? item.icon;

                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      className="quick-link-tile group flex min-w-0 flex-col items-center gap-2.5 py-5"
                    >
                      <span
                        className={
                          visual
                            ? `flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br text-white shadow-sm ${visual.accent}`
                            : "flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary"
                        }
                      >
                        <Icon className="h-5 w-5 shrink-0" strokeWidth={2} />
                      </span>
                      <span className="line-clamp-2 text-center text-sm font-medium leading-snug">
                        {item.label}
                      </span>
                    </Link>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </div>
      </section>
    </>
  );
}
