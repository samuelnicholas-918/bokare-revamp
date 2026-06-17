import { redirect } from "next/navigation";
import Link from "next/link";
import { requireAdmin } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { MATERIAL_TYPE_LABELS, formatDate } from "@/lib/utils";
import { MaterialRowActions } from "@/components/admin/MaterialRowActions";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Plus } from "lucide-react";

export const metadata = { title: "Manage Content" };
export const dynamic = "force-dynamic";

export default async function ManageContentPage() {
  const session = await requireAdmin();
  if (!session) redirect("/admin/login");

  const materials = await prisma.material.findMany({
    orderBy: [{ course: { title: "asc" } }, { order: "asc" }],
    include: {
      course: { select: { title: true, slug: true } },
    },
  });

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-display text-3xl font-bold">Manage Content</h1>
          <p className="text-muted-foreground">{materials.length} materials across all courses</p>
        </div>
        <Button asChild className="min-h-11">
          <Link href="/admin/upload">
            <Plus className="mr-2 h-4 w-4" />
            Upload New
          </Link>
        </Button>
      </div>

      <div className="overflow-x-auto rounded-xl border">
        <table className="w-full min-w-[640px] text-sm">
          <thead>
            <tr className="border-b bg-muted/50">
              <th className="px-4 py-3 text-left font-semibold">Title</th>
              <th className="px-4 py-3 text-left font-semibold">Course</th>
              <th className="px-4 py-3 text-left font-semibold">Type</th>
              <th className="px-4 py-3 text-left font-semibold">Updated</th>
              <th className="px-4 py-3 text-right font-semibold">Actions</th>
            </tr>
          </thead>
          <tbody>
            {materials.map((m) => (
              <tr key={m.id} className="border-b hover:bg-muted/30">
                <td className="px-4 py-3 font-medium">{m.title}</td>
                <td className="px-4 py-3 text-muted-foreground">{m.course.title}</td>
                <td className="px-4 py-3">
                  <Badge variant="outline">{MATERIAL_TYPE_LABELS[m.type]}</Badge>
                </td>
                <td className="px-4 py-3 text-muted-foreground">{formatDate(m.updatedAt)}</td>
                <td className="px-4 py-3 text-right">
                  <MaterialRowActions
                    materialId={m.id}
                    courseSlug={m.course.slug}
                    materialSlug={m.slug}
                    hasReader={!!(m.slug && m.contentHtml)}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
