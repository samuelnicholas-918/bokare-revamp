import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { recordAnalyticsEvent } from "@/lib/analytics-server";

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const material = await prisma.material.findUnique({
      where: { id: params.id },
      include: { course: { select: { id: true } } },
    });

    if (!material) {
      return NextResponse.json({ error: "Material not found" }, { status: 404 });
    }

    const sessionId =
      request.headers.get("x-bokare-session") ||
      new URL(request.url).searchParams.get("session");

    await prisma.download.create({
      data: { materialId: material.id },
    });

    if (sessionId) {
      await recordAnalyticsEvent({
        sessionId,
        eventType: "material_downloaded",
        materialId: material.id,
        courseId: material.courseId,
        data: { title: material.title },
        userAgent: request.headers.get("user-agent") || undefined,
        urlPath: `/api/materials/${material.id}/download`,
      });
    }

    const url = material.fileUrl || material.externalUrl;
    if (!url) {
      return NextResponse.json({ error: "No file available" }, { status: 404 });
    }

    const target = url.startsWith("/") ? new URL(url, request.url).toString() : url;
    return NextResponse.redirect(target);
  } catch (error) {
    console.error("GET /api/materials/[id]/download:", error);
    return NextResponse.json({ error: "Download failed" }, { status: 500 });
  }
}
