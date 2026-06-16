"use client";

import { useEffect, useState } from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

interface Heading {
  id: string;
  text: string;
  level: number;
}

interface TableOfContentsProps {
  headings: Heading[];
}

export function TableOfContents({ headings }: TableOfContentsProps) {
  const [activeId, setActiveId] = useState("");
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id);
          }
        }
      },
      { rootMargin: "-100px 0px -70% 0px" }
    );

    headings.forEach(({ id }) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, [headings]);

  if (headings.length === 0) return null;

  const list = (
    <ul className="space-y-1 text-sm">
      {headings.map((h) => (
        <li key={h.id}>
          <a
            href={`#${h.id}`}
            className={cn(
              "block rounded-md py-2 touch-manipulation transition-colors md:py-1",
              h.level === 3 && "pl-3",
              h.level === 4 && "pl-6",
              activeId === h.id
                ? "font-medium text-teal dark:text-primary"
                : "text-muted-foreground active:text-foreground"
            )}
            onClick={(e) => {
              e.preventDefault();
              document.getElementById(h.id)?.scrollIntoView({ behavior: "smooth" });
              setMobileOpen(false);
            }}
          >
            {h.text}
          </a>
        </li>
      ))}
    </ul>
  );

  return (
    <>
      {/* Mobile: collapsible */}
      <div className="rounded-xl border bg-card lg:hidden">
        <button
          type="button"
          className="flex min-h-11 w-full items-center justify-between px-4 py-3 text-left text-sm font-semibold touch-manipulation"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-expanded={mobileOpen}
        >
          On this page
          <ChevronDown
            className={cn("h-4 w-4 transition-transform", mobileOpen && "rotate-180")}
          />
        </button>
        {mobileOpen && <div className="border-t px-4 pb-4">{list}</div>}
      </div>

      {/* Desktop: sticky sidebar */}
      <nav className="hidden rounded-xl border bg-card p-4 lg:block lg:sticky lg:top-24">
        <h3 className="mb-3 text-sm font-semibold uppercase tracking-wide text-muted-foreground">
          On this page
        </h3>
        {list}
      </nav>
    </>
  );
}
