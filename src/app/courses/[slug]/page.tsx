import Link from "next/link";
import { notFound } from "next/navigation";
import { ChevronRight } from "lucide-react";
import { MaterialList } from "@/components/MaterialList";
import { CourseViewTracker } from "@/components/analytics/CourseViewTracker";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { prisma } from "@/lib/db";
import { MATERIAL_TYPE_LABELS } from "@/lib/utils";
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

  return (
    <>
      <CourseViewTracker courseId={course.id} slug={course.slug} title={course.title} />
      <div className="container mx-auto px-4 py-8">
      <nav className="mb-6 flex items-center gap-1 text-sm text-muted-foreground">
        <Link href="/" className="hover:text-foreground">Home</Link>
        <ChevronRight className="h-4 w-4" />
        <Link href="/courses" className="hover:text-foreground">Courses</Link>
        <ChevronRight className="h-4 w-4" />
        <span className="text-foreground">{course.title}</span>
      </nav>

      <div className="grid gap-8 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <div className="mb-6">
            <div className="mb-2 flex flex-wrap gap-2">
              <Badge>
                {course.category === "ELECTIVE"
                  ? `Semester ${course.semester}E`
                  : course.semester > 0
                    ? `Semester ${course.semester}`
                    : "Professional"}
              </Badge>
              <Badge variant="outline">{course.category}</Badge>
            </div>
            <h1 className="font-display text-3xl font-bold md:text-4xl">{course.title}</h1>
            {course.description && (
              <p className="mt-3 text-lg text-muted-foreground">{course.description}</p>
            )}
          </div>

          {typesWithContent.length === 0 ? (
            <MaterialList materials={[]} courseSlug={params.slug} />
          ) : (
            <Tabs defaultValue={typesWithContent[0]}>
              <TabsList className="flex h-auto flex-wrap">
                {typesWithContent.map((type) => (
                  <TabsTrigger key={type} value={type} className="text-xs sm:text-sm">
                    {MATERIAL_TYPE_LABELS[type]} ({materialsByType[type].length})
                  </TabsTrigger>
                ))}
              </TabsList>
              {typesWithContent.map((type) => (
                <TabsContent key={type} value={type}>
                  <MaterialList materials={materialsByType[type]} courseSlug={params.slug} />
                </TabsContent>
              ))}
            </Tabs>
          )}
        </div>

        <aside className="space-y-6">
          {course.learningObjectives.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Learning Objectives</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="list-inside list-disc space-y-2 text-sm text-muted-foreground">
                  {course.learningObjectives.map((obj, i) => (
                    <li key={i}>{obj}</li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          )}

          {relatedCourses.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Related Courses</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {relatedCourses.map((c) => (
                    <li key={c.id}>
                      <Link
                        href={`/courses/${c.slug}`}
                        className="text-sm font-medium hover:text-primary"
                      >
                        {c.title}
                      </Link>
                      <p className="text-xs text-muted-foreground">
                        {c._count.materials} materials
                      </p>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          )}
        </aside>
      </div>
    </div>
    </>
  );
}
