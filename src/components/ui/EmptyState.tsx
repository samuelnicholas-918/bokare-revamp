import Link from "next/link";
import type { LucideIcon } from "lucide-react";
import {
  BookOpen,
  Ghost,
  PackageOpen,
  Search,
  SearchX,
  Sparkles,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  getEmptyStateContent,
  type EmptyStateVariant,
} from "@/lib/empty-states";

const VARIANT_ICONS: Record<EmptyStateVariant, LucideIcon> = {
  "not-found": Ghost,
  materials: PackageOpen,
  "search-prompt": Search,
  "search-empty": SearchX,
  "courses-filter": BookOpen,
  recent: Sparkles,
};

interface EmptyStateProps {
  variant: EmptyStateVariant;
  query?: string;
  action?: { label: string; href: string };
  secondaryAction?: { label: string; href: string };
  className?: string;
  compact?: boolean;
}

export function EmptyState({
  variant,
  query,
  action,
  secondaryAction,
  className,
  compact = false,
}: EmptyStateProps) {
  const content = getEmptyStateContent(variant, { query });
  const Icon = VARIANT_ICONS[variant];

  return (
    <div
      className={cn(
        "animate-fade-in rounded-2xl border border-dashed bg-muted/20 text-center dark:border-primary/15 dark:bg-card/50",
        compact ? "p-8" : "p-10 md:p-12",
        className
      )}
    >
      <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-primary/10 dark:bg-primary/20 dark:shadow-[0_0_24px_-4px_hsl(var(--glow-primary)/0.4)]">
        <Icon className="h-7 w-7 text-primary" aria-hidden />
      </div>
      <h3 className="font-display text-lg font-semibold md:text-xl">{content.title}</h3>
      <p className="mx-auto mt-2 max-w-md text-sm text-muted-foreground md:text-base">
        {content.message}
      </p>
      {content.hint && (
        <p className="mx-auto mt-3 max-w-md text-xs text-muted-foreground/80 md:text-sm">
          {content.hint}
        </p>
      )}
      {(action || secondaryAction) && (
        <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
          {action && (
            <Button asChild>
              <Link href={action.href}>{action.label}</Link>
            </Button>
          )}
          {secondaryAction && (
            <Button variant="outline" asChild>
              <Link href={secondaryAction.href}>{secondaryAction.label}</Link>
            </Button>
          )}
        </div>
      )}
    </div>
  );
}
