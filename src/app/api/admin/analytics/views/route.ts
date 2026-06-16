import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth";
import { prisma } from "@/lib/db";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const session = await requireAdmin();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const days = parseInt(new URL(request.url).searchParams.get("days") || "30", 10);
  const since = new Date();
  since.setDate(since.getDate() - days);

  const views = await prisma.analyticsEvent.groupBy({
    by: ["materialId"],
    where: {
      eventType: "material_viewed",
      createdAt: { gte: since },
      materialId: { not: null },
    },
    _count: { materialId: true },
    orderBy: { _count: { materialId: "desc" } },
    take: 20,
  });

  const materialIds = views.map((v) => v.materialId!);
  const materials = await prisma.material.findMany({
    where: { id: { in: materialIds } },
    select: { id: true, title: true, course: { select: { title: true } } },
  });
  const map = Object.fromEntries(materials.map((m) => [m.id, m]));

  return NextResponse.json(
    views.map((v) => ({
      materialId: v.materialId,
      views: v._count.materialId,
      title: map[v.materialId!]?.title,
      course: map[v.materialId!]?.course.title,
    }))
  );
}
