import { mkdir, writeFile } from "fs/promises";
import { join } from "path";
import { NextResponse } from "next/server";
import { put } from "@vercel/blob";
import { requireAdmin } from "@/lib/auth";

const MAX_BYTES = 25 * 1024 * 1024; // 25 MB
const ALLOWED_TYPES = new Set([
  "application/pdf",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  "application/vnd.ms-powerpoint",
  "application/vnd.openxmlformats-officedocument.presentationml.presentation",
]);

function sanitizeFilename(name: string): string {
  return name.replace(/[^\w.-]/g, "_").slice(0, 120);
}

export async function POST(request: Request) {
  const session = await requireAdmin();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const formData = await request.formData();
    const file = formData.get("file");

    if (!(file instanceof File) || file.size === 0) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    if (file.size > MAX_BYTES) {
      return NextResponse.json({ error: "File must be 25 MB or smaller" }, { status: 400 });
    }

    const contentType = file.type || "application/octet-stream";
    if (!ALLOWED_TYPES.has(contentType) && !file.name.toLowerCase().endsWith(".pdf")) {
      return NextResponse.json(
        { error: "Only PDF and Office documents are supported" },
        { status: 400 }
      );
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    const safeName = sanitizeFilename(file.name);
    const key = `materials/${Date.now()}-${safeName}`;

    if (process.env.BLOB_READ_WRITE_TOKEN) {
      const blob = await put(key, buffer, {
        access: "public",
        contentType,
        addRandomSuffix: true,
      });
      return NextResponse.json({ url: blob.url, fileSizeBytes: buffer.length });
    }

    const dir = join(process.cwd(), "public", "uploads");
    await mkdir(dir, { recursive: true });
    const filename = `${Date.now()}-${safeName}`;
    await writeFile(join(dir, filename), buffer);

    return NextResponse.json({
      url: `/uploads/${filename}`,
      fileSizeBytes: buffer.length,
    });
  } catch (error) {
    console.error("POST /api/admin/upload-file:", error);
    return NextResponse.json({ error: "Failed to upload file" }, { status: 500 });
  }
}
