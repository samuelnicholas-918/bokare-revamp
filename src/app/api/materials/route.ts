import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { requireAdmin } from "@/lib/auth";
import { validateMaterialPayload } from "@/lib/material-validation";

export async function POST(request: NextRequest) {
  const session = await requireAdmin();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const validationError = validateMaterialPayload(body);
    if (validationError) {
      return NextResponse.json({ error: validationError }, { status: 400 });
    }

    const material = await prisma.material.create({
      data: {
        courseId: body.courseId,
        type: body.type,
        title: body.title,
        description: body.description ?? null,
        fileUrl: body.fileUrl ?? null,
        externalUrl: body.externalUrl ?? null,
        contentHtml: body.contentHtml ?? null,
        slug: body.slug ?? null,
        order: body.order ?? 0,
        fileSizeBytes: body.fileSizeBytes ?? null,
      },
    });

    return NextResponse.json(material, { status: 201 });
  } catch (error) {
    console.error("POST /api/materials:", error);
    return NextResponse.json({ error: "Failed to create material" }, { status: 500 });
  }
}
