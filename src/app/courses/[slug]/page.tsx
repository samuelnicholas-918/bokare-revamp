import Link from "next/link";
import { notFound } from "next/navigation";
import { BookOpen, ChevronRight } from "lucide-react";
import { MaterialList } from "@/components/MaterialList";
import { PageHero } from "@/components/PageHero";
import { CourseViewTracker } from "@/components/analytics/CourseViewTracker";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { prisma } from "@/lib/db";
import { getCourseIcon } from "@/lib/course-visuals";
import { MATERIAL_TYPE_LABELS, getAcademicYear } from "@/lib/utils";
import { MaterialType } from "@prisma/client";

export const dynamic = "force-dynamic";

async function getCourse(slug: string) {
  return prisma.course.findUnique({
    where: { slug },
    include: {
      materials: { orderBy: [{ order: "asc" }] },
    },
  });
}

export async function generateMetadata({ params }: { params: { slug: string } }) {
  const course = await getCourse(params.slug);
  if (!course) return { title: "Course Not Found" };
  return {
    title: course.title,
    description: course.description,
  };
}

export default async function CourseDetailPage({ params }: { params: { slug: string } }) {
  const course = await getCourse(params.slug);
  if (!course) notFound();

  const relatedCourses = await prisma.course.findMany({
    where: {
      category: course.category,
      id: { not: course.id },
    },
    take: 3,
    include: { _count: { select: { materials: true } } },
  });

  const materialsByType = course.materials.reduce(
    (acc, m) => {
      if (!acc[m.type]) acc[m.type] = [];
      acc[m.type].push(m);
      return acc;
    },
    {} as Record<MaterialType, typeof course.materials>
  );

  const typesWithContent = Object.keys(materialsByType) as MaterialType[];
  const academicYear = getAcademicYear(course.semester);
  const Icon = getCourseIcon(course.slug, course.category);

  return (
    <>
      <CourseViewTracker courseId={course.id} slug={course.slug} title={course.title} />
      <div className="container mx-auto px-4 py-8">
        <nav className="mb-6 flex items-center gap-1 text-sm text-muted-foreground">
          <Link href="/" className="hover:text-primary">Home</Link>
          <ChevronRight className="h-4 w-4" />
          <Link href="/courses" className="hover:text-primary">Courses</Link>
          <ChevronRight className="h-4 w-4" />
          <span className="text-foreground">{course.title}</span>
        </nav>

        <PageHero
          eyebrow={academicYear ?? "Course"}
          title={course.title}
          description={course.description ?? undefined}
          className="mb-8"
        >
          <div className="flex flex-wrap items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-[hsl(var(--accent-electric))] text-white shadow-sm">
              <Icon className="h-5 w-5" />
            </div>
            <div className="flex flex-wrap gap-2">
              <Badge>
                {course.category === "ELECTIVE"
                  ? `Semester ${course.semester}E`
                  : course.semester > 0
                    ? `Semester ${course.semester}`
                    : "Professional"}
              </Badge>
              <Badge variant="outline">{course.category}</Badge>
              <Badge variant="secondary" className="gap-1">
                <BookOpen className="h-3 w-3" />
                {course.materials.length} material{course.materials.length !== 1 ? "s" : ""}
              </Badge>
            </div>
          </div>
        </PageHero>

        <div className="grid gap-8 lg:grid-cols-3">
          <div className="lg:col-span-2">
            {typesWithContent.length === 0 ? (
              <MaterialList materials={[]} courseSlug={params.slug} />
            ) : (
              <Tabs defaultValue={typesWithContent[0]}>
                <TabsList className="mb-4 flex h-auto flex-wrap gap-1 bg-muted/50 p-1">
                  {typesWithContent.map((type) => (
                    <TabsTrigger key={type} value={type} className="text-xs sm:text-sm">
                      {MATERIAL_TYPE_LABELS[type]} ({materialsByType[type].length})
                    </TabsTrigger>
                  ))}
                </TabsList>
                {typesWithContent.map((type) => (
                  <TabsContent key={type} value={type} className="mt-0">
                    <MaterialList materials={materialsByType[type]} courseSlug={params.slug} />
                  </TabsContent>
                ))}
              </Tabs>
            )}
          </div>

          <aside className="space-y-6">
            {course.learningObjectives.length > 0 && (
              <Card className="surface-card">
                <CardHeader>
                  <CardTitle className="text-lg">Learning Objectives</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3">
                    {course.learningObjectives.map((obj, i) => (
                      <li key={i} className="flex gap-3 text-sm text-muted-foreground">
                        <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-bold text-primary">
                          {i + 1}
                        </span>
                        {obj}
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            )}

            {relatedCourses.length > 0 && (
              <Card className="surface-card">
                <CardHeader>
                  <CardTitle className="text-lg">Related Courses</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  {relatedCourses.map((c) => {
                    const RelIcon = getCourseIcon(c.slug, c.category);
                    return (
                      <Link
                        key={c.id}
                        href={`/courses/${c.slug}`}
                        className="group flex items-center gap-3 rounded-xl border p-3 transition-colors hover:border-primary/30 hover:bg-muted/30"
                      >
                        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                          <RelIcon className="h-4 w-4" />
                        </div>
                        <div className="min-w-0">
                          <p className="truncate text-sm font-medium group-hover:text-primary">{c.title}</p>
                          <p className="text-xs text-muted-foreground">{c._count.materials} materials</p>
                        </div>
                      </Link>
                    );
                  })}
                </CardContent>
              </Card>
            )}
          </aside>
        </div>
      </div>
    </>
  );
}
