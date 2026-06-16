import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { requireAdmin } from "@/lib/auth";

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
    const material = await prisma.material.update({
      where: { id: params.id },
      data: {
        title: body.title,
        description: body.description,
        type: body.type,
        fileUrl: body.fileUrl,
        externalUrl: body.externalUrl,
        order: body.order,
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
