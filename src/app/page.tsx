import Link from "next/link";
import { ArrowRight, BookOpen, Clock, GraduationCap } from "lucide-react";
import { SearchBar } from "@/components/SearchBar";
import { CourseCard } from "@/components/CourseCard";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { prisma } from "@/lib/db";
import { formatDate } from "@/lib/utils";

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
  const coreCourses = courses.filter((c) => c.category === "CORE");
  const electives = courses.filter((c) => c.category === "ELECTIVE");

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
              Empowering students with organized resources in Business Economics and its modern
              tools — lecture notes, PDFs, and more across all semesters.
            </p>
            <div className="mx-auto mt-8 max-w-xl">
              <SearchBar size="lg" />
            </div>
          </div>
        </div>
      </section>

      <section className="container mx-auto px-4 py-12">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h2 className="font-display text-2xl font-bold md:text-3xl">Core Courses</h2>
            <p className="mt-1 text-muted-foreground">Semesters 1 through 6</p>
          </div>
          <Button variant="outline" asChild className="hidden sm:inline-flex">
            <Link href="/courses">
              View all <ArrowRight className="ml-1 h-4 w-4" />
            </Link>
          </Button>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {coreCourses.map((course) => (
            <CourseCard key={course.id} course={course} />
          ))}
        </div>
      </section>

      {electives.length > 0 && (
        <section className="bg-muted/30 py-12">
          <div className="container mx-auto px-4">
            <h2 className="font-display text-2xl font-bold md:text-3xl">Electives</h2>
            <p className="mt-1 mb-8 text-muted-foreground">Managerial Economics courses</p>
            <div className="grid gap-4 sm:grid-cols-2">
              {electives.map((course) => (
                <CourseCard key={course.id} course={course} />
              ))}
            </div>
          </div>
        </section>
      )}

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
                  { label: "Lecture Notes", href: "/search?type=LECTURE_NOTES" },
                  { label: "PDF Resources", href: "/search?type=PDF" },
                  { label: "Question Bank", href: "/search?type=QUESTION_BANK" },
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
