import { redirect } from "next/navigation";
import { requireAdmin } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatDate } from "@/lib/utils";

export const metadata = { title: "Download Analytics" };
export const dynamic = "force-dynamic";

export default async function AdminAnalyticsPage() {
  const session = await requireAdmin();
  if (!session) redirect("/admin/login");

  const [totalDownloads, byMaterial, recentDownloads] = await Promise.all([
    prisma.download.count(),
    prisma.download.groupBy({
      by: ["materialId"],
      _count: { materialId: true },
      orderBy: { _count: { materialId: "desc" } },
      take: 20,
    }),
    prisma.download.findMany({
      take: 15,
      orderBy: { downloadedAt: "desc" },
      include: { material: { select: { title: true } } },
    }),
  ]);

  const materialIds = byMaterial.map((b) => b.materialId);
  const materials = await prisma.material.findMany({
    where: { id: { in: materialIds } },
    select: { id: true, title: true, course: { select: { title: true } } },
  });
  const materialMap = Object.fromEntries(materials.map((m) => [m.id, m]));

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="font-display mb-8 text-3xl font-bold">Download Analytics</h1>

      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Total Downloads</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-4xl font-bold">{totalDownloads}</p>
        </CardContent>
      </Card>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Most Downloaded</CardTitle>
          </CardHeader>
          <CardContent>
            {byMaterial.length === 0 ? (
              <p className="text-sm text-muted-foreground">No downloads yet.</p>
            ) : (
              <ul className="space-y-3">
                {byMaterial.map((b, i) => (
                  <li key={b.materialId} className="flex items-center justify-between text-sm">
                    <div>
                      <span className="mr-2 font-mono text-muted-foreground">#{i + 1}</span>
                      <span className="font-medium">{materialMap[b.materialId]?.title}</span>
                      <p className="ml-6 text-xs text-muted-foreground">
                        {materialMap[b.materialId]?.course.title}
                      </p>
                    </div>
                    <span className="font-bold">{b._count.materialId}</span>
                  </li>
                ))}
              </ul>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Recent Downloads</CardTitle>
          </CardHeader>
          <CardContent>
            {recentDownloads.length === 0 ? (
              <p className="text-sm text-muted-foreground">No downloads yet.</p>
            ) : (
              <ul className="space-y-2">
                {recentDownloads.map((d) => (
                  <li key={d.id} className="text-sm">
                    <span className="font-medium">{d.material.title}</span>
                    <span className="text-muted-foreground"> · {formatDate(d.downloadedAt)}</span>
                  </li>
                ))}
              </ul>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
