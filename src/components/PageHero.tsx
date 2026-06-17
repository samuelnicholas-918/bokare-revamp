import { cn } from "@/lib/utils";

interface PageHeroProps {
  eyebrow?: string;
  title: string;
  description?: string;
  children?: React.ReactNode;
  className?: string;
  compact?: boolean;
}

export function PageHero({
  eyebrow,
  title,
  description,
  children,
  className,
  compact = false,
}: PageHeroProps) {
  return (
    <section
      className={cn(
        "page-hero relative overflow-hidden rounded-2xl border bg-gradient-to-br from-primary/10 via-card to-[hsl(var(--accent-electric)/0.08)]",
        compact ? "px-5 py-8 md:px-8" : "px-6 py-10 md:px-10 md:py-12",
        className
      )}
    >
      <div className="pointer-events-none absolute -right-20 -top-20 h-56 w-56 rounded-full bg-primary/10 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-16 -left-16 h-40 w-40 rounded-full bg-[hsl(var(--accent-electric)/0.12)] blur-3xl" />
      <div className="relative">
        {eyebrow && (
          <p className="mb-2 text-xs font-semibold uppercase tracking-widest text-primary md:text-sm">
            {eyebrow}
          </p>
        )}
        <h1 className="font-display text-2xl font-bold tracking-tight md:text-4xl">{title}</h1>
        {description && (
          <p className="mt-3 max-w-2xl text-base text-muted-foreground md:text-lg">{description}</p>
        )}
        {children && <div className="mt-5">{children}</div>}
      </div>
    </section>
  );
}
