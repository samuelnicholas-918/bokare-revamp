"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { BookOpen, Menu, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/ThemeToggle";

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/courses", label: "Courses" },
  { href: "/search", label: "Search" },
];

export function Navbar() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header className="glass-nav sticky top-0 z-50 border-b bg-background/95 backdrop-blur-md supports-[backdrop-filter]:bg-background/70">
      <div className="container mx-auto flex h-14 items-center justify-between px-4 md:h-16">
        <Link
          href="/"
          className="flex min-h-11 items-center gap-2 font-semibold text-primary touch-manipulation"
        >
          <BookOpen className="h-6 w-6 shrink-0" />
          <span className="text-sm font-bold md:text-base">bokare.in</span>
        </Link>

        <nav className="hidden items-center gap-1 md:flex" aria-label="Main navigation">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                "rounded-lg px-3 py-2.5 text-sm font-medium transition-colors min-h-11 flex items-center",
                pathname === link.href || (link.href !== "/" && pathname.startsWith(link.href))
                  ? "bg-accent text-accent-foreground"
                  : "text-muted-foreground hover:bg-accent"
              )}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-1">
          <ThemeToggle />
          <Button
            variant="ghost"
            size="icon"
            className="h-11 w-11 touch-manipulation md:hidden"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-expanded={mobileOpen}
            aria-label="Toggle menu"
          >
            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </div>
      </div>

      {mobileOpen && (
        <nav
          className="border-t px-4 py-3 md:hidden"
          aria-label="Mobile menu"
        >
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setMobileOpen(false)}
              className={cn(
                "flex min-h-11 items-center rounded-lg px-3 text-sm font-medium touch-manipulation",
                pathname === link.href || (link.href !== "/" && pathname.startsWith(link.href))
                  ? "bg-accent text-accent-foreground"
                  : "text-muted-foreground active:bg-muted"
              )}
            >
              {link.label}
            </Link>
          ))}
          <Link
            href="/admin/login"
            onClick={() => setMobileOpen(false)}
            className="mt-1 flex min-h-11 items-center rounded-lg px-3 text-sm font-medium text-muted-foreground active:bg-muted"
          >
            Admin Login
          </Link>
        </nav>
      )}
    </header>
  );
}
