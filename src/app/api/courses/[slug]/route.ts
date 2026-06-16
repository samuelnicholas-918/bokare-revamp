import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET(
  _request: Request,
  { params }: { params: { slug: string } }
) {
  try {
    const course = await prisma.course.findUnique({
      where: { slug: params.slug },
      include: {
        materials: { orderBy: [{ type: "asc" }, { order: "asc" }] },
      },
    });

    if (!course) {
      return NextResponse.json({ error: "Course not found" }, { status: 404 });
    }

    return NextResponse.json(course);
  } catch (error) {
    console.error("GET /api/courses/[slug]:", error);
    return NextResponse.json({ error: "Failed to fetch course" }, { status: 500 });
  }
}
