import type { MetadataRoute } from "next";
import { prisma } from "@/lib/db";

const BASE =
  process.env.NEXT_PUBLIC_SITE_URL ||
  (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : "https://bokare-revamp.vercel.app");

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [courses, materials] = await Promise.all([
    prisma.course.findMany({ select: { slug: true, updatedAt: true } }),
    prisma.material.findMany({
      where: { slug: { not: null }, contentHtml: { not: null } },
      select: { slug: true, updatedAt: true, course: { select: { slug: true } } },
    }),
  ]);

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: BASE, lastModified: new Date(), changeFrequency: "weekly", priority: 1 },
    { url: `${BASE}/courses`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.9 },
    { url: `${BASE}/search`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.7 },
  ];

  const courseRoutes: MetadataRoute.Sitemap = courses.map((c) => ({
    url: `${BASE}/courses/${c.slug}`,
    lastModified: c.updatedAt,
    changeFrequency: "weekly",
    priority: 0.8,
  }));

  const learnRoutes: MetadataRoute.Sitemap = materials.map((m) => ({
    url: `${BASE}/courses/${m.course.slug}/learn/${m.slug}`,
    lastModified: m.updatedAt,
    changeFrequency: "monthly",
    priority: 0.7,
  }));

  return [...staticRoutes, ...courseRoutes, ...learnRoutes];
}
