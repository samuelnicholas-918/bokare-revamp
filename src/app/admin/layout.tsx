import Link from "next/link";
import { BarChart3, LayoutDashboard, LogOut, Plus } from "lucide-react";
import { requireAdmin } from "@/lib/auth";
import { cn } from "@/lib/utils";

const adminLinks = [
  { href: "/admin/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/upload", label: "Upload", icon: Plus },
  { href: "/admin/analytics", label: "Analytics", icon: BarChart3 },
];

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await requireAdmin();

  // Allow login page without auth
  if (!session) {
    return <>{children}</>;
  }

  return (
    <div>
      <div className="border-b bg-muted/30">
        <div className="container mx-auto flex items-center gap-4 px-4 py-3">
          <span className="text-sm font-semibold text-primary">Admin</span>
          <nav className="flex gap-1">
            {adminLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm transition-colors hover:bg-accent"
                )}
              >
                <link.icon className="h-4 w-4" />
                {link.label}
              </Link>
            ))}
          </nav>
          <Link
            href="/api/auth/signout"
            className="ml-auto flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
          >
            <LogOut className="h-4 w-4" />
            Sign Out
          </Link>
        </div>
      </div>
      {children}
    </div>
  );
}
