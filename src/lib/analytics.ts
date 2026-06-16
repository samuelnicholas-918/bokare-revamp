export type AnalyticsEventType =
  | "page_viewed"
  | "course_viewed"
  | "material_viewed"
  | "material_downloaded"
  | "search_performed";

export interface TrackEventPayload {
  sessionId: string;
  eventType: AnalyticsEventType;
  materialId?: string;
  courseId?: string;
  data?: Record<string, unknown>;
  urlPath?: string;
  userAgent?: string;
}

export function getSessionId(): string {
  if (typeof window === "undefined") return "";
  let sessionId = sessionStorage.getItem("bokare_session_id");
  if (!sessionId) {
    sessionId = crypto.randomUUID();
    sessionStorage.setItem("bokare_session_id", sessionId);
  }
  return sessionId;
}

export async function trackEvent(
  eventType: AnalyticsEventType,
  data?: Record<string, unknown>,
  options?: { materialId?: string; courseId?: string }
): Promise<void> {
  if (typeof window === "undefined") return;

  const sessionId = getSessionId();

  try {
    await fetch("/api/analytics/track", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        sessionId,
        eventType,
        materialId: options?.materialId,
        courseId: options?.courseId,
        data,
        urlPath: window.location.pathname,
        userAgent: navigator.userAgent,
      }),
      keepalive: true,
    });
  } catch {
    // Silent fail — analytics must not block UX
  }
}

export function getDeviceType(userAgent: string): "Mobile" | "Desktop" | "Tablet" {
  const ua = userAgent.toLowerCase();
  if (/tablet|ipad/.test(ua)) return "Tablet";
  if (/mobile|android|iphone/.test(ua)) return "Mobile";
  return "Desktop";
}
