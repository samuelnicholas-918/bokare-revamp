"use client";

import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { Monitor, Moon, Sun } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type ThemeChoice = "light" | "dark" | "system";

const THEMES: { value: ThemeChoice; label: string; icon: typeof Sun }[] = [
  { value: "light", label: "Light", icon: Sun },
  { value: "dark", label: "Dark", icon: Moon },
  { value: "system", label: "System", icon: Monitor },
];

interface ThemeToggleProps {
  className?: string;
}

export function ThemeToggle({ className }: ThemeToggleProps) {
  const { theme, setTheme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => setMounted(true), []);

  if (!mounted) {
    return (
      <Button
        variant="ghost"
        size="icon"
        className={cn("h-11 w-11", className)}
        aria-label="Theme"
        disabled
      />
    );
  }

  const active = (theme as ThemeChoice) || "system";
  const ActiveIcon =
    active === "dark" || (active === "system" && resolvedTheme === "dark") ? Moon : Sun;

  return (
    <div className={cn("relative", className)}>
      <Button
        variant="ghost"
        size="icon"
        className={cn(
          "h-11 w-11 touch-manipulation",
          "dark:hover:bg-primary/10 dark:hover:text-primary",
          resolvedTheme === "dark" && "dark:ring-1 dark:ring-primary/20"
        )}
        onClick={() => setOpen((v) => !v)}
        aria-label="Choose theme"
        aria-expanded={open}
      >
        <ActiveIcon className="h-5 w-5" />
      </Button>

      {open && (
        <>
          <button
            type="button"
            className="fixed inset-0 z-40 cursor-default"
            aria-label="Close theme menu"
            onClick={() => setOpen(false)}
          />
          <div
            className={cn(
              "absolute right-0 top-full z-50 mt-2 min-w-[9.5rem] overflow-hidden rounded-xl border p-1 shadow-lg",
              "bg-card text-foreground",
              "dark:border-primary/15 dark:bg-card dark:shadow-[0_8px_32px_-4px_hsl(222_40%_2%/0.8),0_0_0_1px_hsl(var(--primary)/0.1)]"
            )}
            role="menu"
          >
            {THEMES.map(({ value, label, icon: Icon }) => (
              <button
                key={value}
                type="button"
                role="menuitem"
                className={cn(
                  "flex w-full items-center gap-2 rounded-lg px-3 py-2.5 text-sm transition-colors",
                  active === value
                    ? "bg-primary/10 font-medium text-primary"
                    : "text-muted-foreground hover:bg-accent hover:text-foreground"
                )}
                onClick={() => {
                  setTheme(value);
                  setOpen(false);
                }}
              >
                <Icon className="h-4 w-4 shrink-0" />
                {label}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
