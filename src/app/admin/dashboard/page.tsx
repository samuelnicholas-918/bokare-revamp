import Link from "next/link";
import { redirect } from "next/navigation";
import { BarChart3, FolderOpen, Plus, Settings } from "lucide-react";
import { requireAdmin } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { formatDate } from "@/lib/utils";

export const metadata = { title: "Admin Dashboard" };
export const dynamic = "force-dynamic";

export default async function AdminDashboardPage() {
  const session = await requireAdmin();
  if (!session) redirect("/admin/login");

  const [courseCount, materialCount, downloadCount, recentMaterials] = await Promise.all([
    prisma.course.count(),
    prisma.material.count(),
    prisma.download.count(),
    prisma.material.findMany({
      take: 5,
      orderBy: { createdAt: "desc" },
      include: { course: { select: { title: true } } },
    }),
  ]);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="font-display text-3xl font-bold">Admin Dashboard</h1>
          <p className="text-muted-foreground">Welcome back, {session.user?.name || "Professor"}</p>
        </div>
        <Button asChild>
          <Link href="/admin/upload">
            <Plus className="mr-2 h-4 w-4" />
            Upload Material
          </Link>
        </Button>
      </div>

      <div className="mb-8 grid gap-4 sm:grid-cols-3">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Courses</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{courseCount}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Materials</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{materialCount}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Downloads</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{downloadCount}</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-2">
            <Button variant="outline" asChild className="justify-start">
              <Link href="/admin/upload">
                <Plus className="mr-2 h-4 w-4" />
                Upload New Material
              </Link>
            </Button>
            <Button variant="outline" asChild className="justify-start">
              <Link href="/admin/manage-content">
                <FolderOpen className="mr-2 h-4 w-4" />
                Manage Content
              </Link>
            </Button>
            <Button variant="outline" asChild className="justify-start">
              <Link href="/admin/analytics">
                <BarChart3 className="mr-2 h-4 w-4" />
                View Analytics
              </Link>
            </Button>
            <Button variant="outline" asChild className="justify-start">
              <Link href="/courses">
                <Settings className="mr-2 h-4 w-4" />
                View Public Site
              </Link>
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Recently Added</CardTitle>
          </CardHeader>
          <CardContent>
            {recentMaterials.length === 0 ? (
              <p className="text-sm text-muted-foreground">No materials yet.</p>
            ) : (
              <ul className="space-y-2">
                {recentMaterials.map((m) => (
                  <li key={m.id} className="text-sm">
                    <p className="font-medium">{m.title}</p>
                    <p className="text-muted-foreground">
                      {m.course.title} · {formatDate(m.createdAt)}
                    </p>
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
