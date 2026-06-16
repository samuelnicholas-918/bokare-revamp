import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth";
import { getTopDownloads } from "@/lib/analytics-server";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const session = await requireAdmin();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { searchParams } = new URL(request.url);
  const days = parseInt(searchParams.get("days") || "30", 10);

  return NextResponse.json(await getTopDownloads(days));
}
