import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getSession } from "@/lib/auth";

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const material = await prisma.material.findUnique({
      where: { id: params.id },
    });

    if (!material) {
      return NextResponse.json({ error: "Material not found" }, { status: 404 });
    }

    const session = await getSession();
    const ip = request.headers.get("x-forwarded-for") || request.headers.get("x-real-ip");

    await prisma.download.create({
      data: {
        materialId: material.id,
        userId: (session?.user as { id?: string })?.id,
        ipAddress: ip,
      },
    });

    const url = material.fileUrl || material.externalUrl;
    if (!url) {
      return NextResponse.json({ error: "No file available" }, { status: 404 });
    }

    return NextResponse.redirect(url);
  } catch (error) {
    console.error("GET /api/materials/[id]/download:", error);
    return NextResponse.json({ error: "Download failed" }, { status: 500 });
  }
}
