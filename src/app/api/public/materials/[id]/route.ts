import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export const dynamic = "force-dynamic";

export async function GET(
  _request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const material = await prisma.material.findUnique({
      where: { id: params.id },
      include: {
        course: {
          select: { id: true, title: true, slug: true, semester: true },
        },
      },
    });

    if (!material) {
      return NextResponse.json({ error: "Material not found" }, { status: 404 });
    }

    const { contentHtml, ...publicMaterial } = material;
    return NextResponse.json({
      ...publicMaterial,
      hasContent: Boolean(contentHtml),
      learnUrl: material.slug
        ? `/courses/${material.course.slug}/learn/${material.slug}`
        : null,
    });
  } catch (error) {
    console.error("GET /api/public/materials/[id]:", error);
    return NextResponse.json({ error: "Failed to fetch material" }, { status: 500 });
  }
}
