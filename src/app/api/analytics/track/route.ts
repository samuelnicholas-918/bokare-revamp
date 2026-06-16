import { NextRequest, NextResponse } from "next/server";
import { recordAnalyticsEvent } from "@/lib/analytics-server";
import type { AnalyticsEventType } from "@/lib/analytics";

const ALLOWED_EVENTS: AnalyticsEventType[] = [
  "page_viewed",
  "course_viewed",
  "material_viewed",
  "material_downloaded",
  "search_performed",
];

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { sessionId, eventType, materialId, courseId, data, urlPath, userAgent } = body;

    if (!sessionId || typeof sessionId !== "string" || sessionId.length > 64) {
      return NextResponse.json({ error: "Invalid session" }, { status: 400 });
    }

    if (!eventType || !ALLOWED_EVENTS.includes(eventType)) {
      return NextResponse.json({ error: "Invalid event type" }, { status: 400 });
    }

    const payload = {
      sessionId,
      eventType: eventType as AnalyticsEventType,
      materialId: materialId || undefined,
      courseId: courseId || undefined,
      data: data || undefined,
      urlPath: urlPath || undefined,
      userAgent: userAgent || request.headers.get("user-agent") || undefined,
    };

    await recordAnalyticsEvent(payload);

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("POST /api/analytics/track:", error);
    return NextResponse.json({ error: "Failed to track event" }, { status: 500 });
  }
}
