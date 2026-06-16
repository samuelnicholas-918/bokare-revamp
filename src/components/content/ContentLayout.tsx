import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { ReadingProgress } from "./ReadingProgress";

interface ContentLayoutProps {
  breadcrumbs: { label: string; href?: string }[];
  children: React.ReactNode;
  sidebar: React.ReactNode;
}

export function ContentLayout({ breadcrumbs, children, sidebar }: ContentLayoutProps) {
  return (
    <>
      <ReadingProgress />
      <div className="container mx-auto px-4 py-4 md:py-8">
        <nav
          className="mb-4 flex flex-wrap items-center gap-1 text-xs text-muted-foreground md:mb-6 md:text-sm"
          aria-label="Breadcrumb"
        >
          {breadcrumbs.map((crumb, i) => (
            <span key={i} className="flex max-w-full items-center gap-1">
              {i > 0 && <ChevronRight className="h-3 w-3 shrink-0" />}
              {crumb.href ? (
                <Link href={crumb.href} className="truncate hover:text-teal dark:hover:text-primary">
                  {crumb.label}
                </Link>
              ) : (
                <span className="truncate text-foreground">{crumb.label}</span>
              )}
            </span>
          ))}
        </nav>

        {/* Mobile-first: content first, sidebar below; desktop: side-by-side */}
        <div className="flex flex-col gap-6 lg:grid lg:grid-cols-[1fr_280px] lg:gap-8 xl:grid-cols-[1fr_320px]">
          <div className="order-1 min-w-0 space-y-6 md:space-y-8">{children}</div>
          <div className="order-2 lg:order-2">{sidebar}</div>
        </div>
      </div>
    </>
  );
}
