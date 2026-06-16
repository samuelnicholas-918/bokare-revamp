import nextDynamic from "next/dynamic";
import { redirect } from "next/navigation";
import { requireAdmin } from "@/lib/auth";

const AnalyticsDashboard = nextDynamic(
  () =>
    import("@/components/admin/AnalyticsDashboard").then((mod) => mod.AnalyticsDashboard),
  {
    ssr: false,
    loading: () => <p className="text-muted-foreground">Loading analytics...</p>,
  }
);

export const metadata = { title: "Analytics Dashboard" };
export const dynamic = "force-dynamic";

export default async function AdminAnalyticsPage() {
  const session = await requireAdmin();
  if (!session) redirect("/admin/login");

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="font-display mb-2 text-3xl font-bold">Analytics Dashboard</h1>
      <p className="mb-8 text-muted-foreground">Last 30 days · anonymous, privacy-first</p>
      <AnalyticsDashboard />
    </div>
  );
}
