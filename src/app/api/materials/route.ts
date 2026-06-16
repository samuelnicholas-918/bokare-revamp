import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { requireAdmin } from "@/lib/auth";
import { MaterialType } from "@prisma/client";

export async function POST(request: NextRequest) {
  const session = await requireAdmin();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { courseId, type, title, description, fileUrl, externalUrl, order } = body;

    if (!courseId || !type || !title) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    if (!Object.values(MaterialType).includes(type)) {
      return NextResponse.json({ error: "Invalid material type" }, { status: 400 });
    }

    const material = await prisma.material.create({
      data: {
        courseId,
        type,
        title,
        description,
        fileUrl,
        externalUrl,
        order: order ?? 0,
      },
    });

    return NextResponse.json(material, { status: 201 });
  } catch (error) {
    console.error("POST /api/materials:", error);
    return NextResponse.json({ error: "Failed to create material" }, { status: 500 });
  }
}
