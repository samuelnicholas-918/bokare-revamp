import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { MaterialType } from "@prisma/client";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const q = searchParams.get("q")?.trim();
    const semester = searchParams.get("semester");
    const type = searchParams.get("type") as MaterialType | null;

    if (!q && !semester && !type) {
      return NextResponse.json({ results: [], total: 0 });
    }

    const where: {
      OR?: Array<{ title: { contains: string; mode: "insensitive" } } | { description: { contains: string; mode: "insensitive" } }>;
      type?: MaterialType;
      course?: { semester: number };
    } = {};

    if (q) {
      where.OR = [
        { title: { contains: q, mode: "insensitive" } },
        { description: { contains: q, mode: "insensitive" } },
      ];
    }

    if (type && Object.values(MaterialType).includes(type)) {
      where.type = type;
    }

    if (semester) {
      where.course = { semester: parseInt(semester, 10) };
    }

    const results = await prisma.material.findMany({
      where,
      include: {
        course: { select: { id: true, title: true, slug: true, semester: true } },
      },
      orderBy: [{ updatedAt: "desc" }],
      take: 50,
    });

    return NextResponse.json({ results, total: results.length, query: q });
  } catch (error) {
    console.error("GET /api/materials/search:", error);
    return NextResponse.json({ error: "Search failed" }, { status: 500 });
  }
}
