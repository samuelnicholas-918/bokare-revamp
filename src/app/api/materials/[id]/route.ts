import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { requireAdmin } from "@/lib/auth";
import { validateMaterialPayload } from "@/lib/material-validation";

export async function GET(
  _request: NextRequest,
  { params }: { params: { id: string } }
) {
  const session = await requireAdmin();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const material = await prisma.material.findUnique({
      where: { id: params.id },
    });
    if (!material) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }
    return NextResponse.json(material);
  } catch (error) {
    console.error("GET /api/materials/[id]:", error);
    return NextResponse.json({ error: "Failed to fetch material" }, { status: 500 });
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
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

    const material = await prisma.material.update({
      where: { id: params.id },
      data: {
        courseId: body.courseId,
        title: body.title,
        description: body.description ?? null,
        type: body.type,
        fileUrl: body.fileUrl ?? null,
        externalUrl: body.externalUrl ?? null,
        contentHtml: body.contentHtml ?? null,
        slug: body.slug ?? null,
        order: body.order ?? 0,
        fileSizeBytes: body.fileSizeBytes ?? null,
      },
    });
    return NextResponse.json(material);
  } catch (error) {
    console.error("PUT /api/materials/[id]:", error);
    return NextResponse.json({ error: "Failed to update material" }, { status: 500 });
  }
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: { id: string } }
) {
  const session = await requireAdmin();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    await prisma.material.delete({ where: { id: params.id } });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("DELETE /api/materials/[id]:", error);
    return NextResponse.json({ error: "Failed to delete material" }, { status: 500 });
  }
}
