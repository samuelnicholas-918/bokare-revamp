import { Prisma } from "@prisma/client";
import { prisma } from "@/lib/db";
import { getDeviceType, type TrackEventPayload } from "@/lib/analytics";

const RETENTION_DAYS = parseInt(process.env.ANALYTICS_RETENTION_DAYS || "90", 10);

export async function recordAnalyticsEvent(payload: TrackEventPayload) {
  const userAgent = payload.userAgent || "";
  return prisma.analyticsEvent.create({
    data: {
      sessionId: payload.sessionId,
      eventType: payload.eventType,
      materialId: payload.materialId,
      courseId: payload.courseId,
      data: payload.data ? (payload.data as Prisma.InputJsonValue) : undefined,
      userAgent: userAgent.slice(0, 512),
      urlPath: payload.urlPath?.slice(0, 512),
      deviceType: userAgent ? getDeviceType(userAgent) : undefined,
    },
  });
}

function sinceDays(days: number) {
  const d = new Date();
  d.setDate(d.getDate() - days);
  return d;
}

export async function getAnalyticsOverview(days = 30) {
  const since = sinceDays(days);

  const [events, uniqueSessions, downloads, searches, views] = await Promise.all([
    prisma.analyticsEvent.count({ where: { createdAt: { gte: since } } }),
    prisma.analyticsEvent.groupBy({
      by: ["sessionId"],
      where: { createdAt: { gte: since } },
    }),
    prisma.analyticsEvent.count({
      where: { eventType: "material_downloaded", createdAt: { gte: since } },
    }),
    prisma.analyticsEvent.count({
      where: { eventType: "search_performed", createdAt: { gte: since } },
    }),
    prisma.analyticsEvent.count({
      where: { eventType: "material_viewed", createdAt: { gte: since } },
    }),
  ]);

  return {
    days,
    totalEvents: events,
    uniqueSessions: uniqueSessions.length,
    downloads,
    searches,
    views,
  };
}

export async function getTopDownloads(days = 30, limit = 10) {
  const since = sinceDays(days);
  const grouped = await prisma.analyticsEvent.groupBy({
    by: ["materialId"],
    where: {
      eventType: "material_downloaded",
      createdAt: { gte: since },
      materialId: { not: null },
    },
    _count: { materialId: true },
    orderBy: { _count: { materialId: "desc" } },
    take: limit,
  });

  const materialIds = grouped.map((g) => g.materialId!).filter(Boolean);
  const materials = await prisma.material.findMany({
    where: { id: { in: materialIds } },
    select: { id: true, title: true, course: { select: { title: true } } },
  });
  const map = Object.fromEntries(materials.map((m) => [m.id, m]));

  const sessionCounts = await Promise.all(
    grouped.map(async (g) => {
      const unique = await prisma.analyticsEvent.groupBy({
        by: ["sessionId"],
        where: {
          eventType: "material_downloaded",
          materialId: g.materialId,
          createdAt: { gte: since },
        },
      });
      return { materialId: g.materialId!, unique: unique.length };
    })
  );
  const uniqueMap = Object.fromEntries(sessionCounts.map((s) => [s.materialId, s.unique]));

  return grouped.map((g) => ({
    materialId: g.materialId,
    downloads: g._count.materialId,
    uniqueDownloads: uniqueMap[g.materialId!] || 0,
    title: map[g.materialId!]?.title,
    course: map[g.materialId!]?.course.title,
  }));
}

export async function getPopularSearches(days = 30, limit = 20) {
  const since = sinceDays(days);
  const events = await prisma.analyticsEvent.findMany({
    where: { eventType: "search_performed", createdAt: { gte: since } },
    select: { data: true },
  });

  const counts: Record<string, { count: number; totalResults: number }> = {};
  for (const e of events) {
    const data = e.data as { query?: string; resultCount?: number } | null;
    const query = data?.query?.toLowerCase().trim();
    if (!query) continue;
    if (!counts[query]) counts[query] = { count: 0, totalResults: 0 };
    counts[query].count++;
    counts[query].totalResults += data?.resultCount ?? 0;
  }

  return Object.entries(counts)
    .map(([query, stats]) => ({
      query,
      timesSearched: stats.count,
      avgResults: stats.count ? Math.round(stats.totalResults / stats.count) : 0,
    }))
    .sort((a, b) => b.timesSearched - a.timesSearched)
    .slice(0, limit);
}

export async function getTrafficOverTime(days = 30) {
  const since = sinceDays(days);
  const events = await prisma.analyticsEvent.findMany({
    where: { createdAt: { gte: since } },
    select: { sessionId: true, createdAt: true },
    orderBy: { createdAt: "asc" },
  });

  const byDate: Record<string, { sessions: Set<string>; events: number }> = {};
  for (const e of events) {
    const date = e.createdAt.toISOString().split("T")[0];
    if (!byDate[date]) byDate[date] = { sessions: new Set(), events: 0 };
    byDate[date].sessions.add(e.sessionId);
    byDate[date].events++;
  }

  return Object.entries(byDate)
    .map(([date, stats]) => ({
      date,
      uniqueSessions: stats.sessions.size,
      totalEvents: stats.events,
    }))
    .sort((a, b) => a.date.localeCompare(b.date));
}

export async function getDeviceBreakdown(days = 30) {
  const since = sinceDays(days);
  const grouped = await prisma.analyticsEvent.groupBy({
    by: ["deviceType"],
    where: { createdAt: { gte: since } },
    _count: { deviceType: true },
  });

  return grouped.map((g) => ({
    deviceType: g.deviceType || "Unknown",
    events: g._count.deviceType,
  }));
}

export { RETENTION_DAYS };
