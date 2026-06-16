import Link from "next/link";
import { ArrowRight, BookMarked } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { getAcademicYear } from "@/lib/utils";

interface CourseCardProps {
  course: CourseWithMaterials;
}

const categoryLabels: Record<string, string> = {
  CORE: "Core",
  ELECTIVE: "Elective",
  PROFESSIONAL: "Professional",
};

export function CourseCard({ course }: CourseCardProps) {
  const materialCount = course._count?.materials ?? course.materials?.length ?? 0;
  const academicYear = getAcademicYear(course.semester);

  return (
    <Link href={`/courses/${course.slug}`}>
      <Card className="card-interactive group h-full border bg-card transition-all md:hover:border-primary/50 md:hover:shadow-md">
        <CardHeader>
          <div className="flex items-start justify-between gap-2">
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
            <Badge variant="outline">{categoryLabels[course.category]}</Badge>
          </div>
          <CardTitle className="group-hover:text-primary">{course.title}</CardTitle>
          <CardDescription className="line-clamp-2">{course.description}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between text-sm text-muted-foreground">
            <span className="flex items-center gap-1">
              <BookMarked className="h-4 w-4" />
              {materialCount} material{materialCount !== 1 ? "s" : ""}
            </span>
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
