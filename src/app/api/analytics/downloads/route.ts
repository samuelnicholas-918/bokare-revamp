import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { requireAdmin } from "@/lib/auth";

export async function GET() {
  const session = await requireAdmin();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const [totalDownloads, byMaterial, recentDownloads] = await Promise.all([
      prisma.download.count(),
      prisma.download.groupBy({
        by: ["materialId"],
        _count: { materialId: true },
        orderBy: { _count: { materialId: "desc" } },
        take: 20,
      }),
      prisma.download.findMany({
        take: 10,
        orderBy: { downloadedAt: "desc" },
        include: {
          material: { select: { title: true } },
        },
      }),
    ]);

    const materialIds = byMaterial.map((b) => b.materialId);
    const materials = await prisma.material.findMany({
      where: { id: { in: materialIds } },
      select: { id: true, title: true, course: { select: { title: true } } },
    });

    const materialMap = Object.fromEntries(materials.map((m) => [m.id, m]));

    const topMaterials = byMaterial.map((b) => ({
      materialId: b.materialId,
      count: b._count.materialId,
      title: materialMap[b.materialId]?.title,
      course: materialMap[b.materialId]?.course.title,
    }));

    return NextResponse.json({
      totalDownloads,
      topMaterials,
      recentDownloads: recentDownloads.map((d) => ({
        material: d.material.title,
        downloadedAt: d.downloadedAt,
      })),
    });
  } catch (error) {
    console.error("GET /api/analytics/downloads:", error);
    return NextResponse.json({ error: "Failed to fetch analytics" }, { status: 500 });
  }
}
