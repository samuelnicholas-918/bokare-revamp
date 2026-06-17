"use client";

import { useRouter } from "next/navigation";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { FormEvent, useState, useTransition } from "react";
import { cn } from "@/lib/utils";

interface SearchBarProps {
  defaultValue?: string;
  placeholder?: string;
  size?: "default" | "lg";
}

export function SearchBar({
  defaultValue = "",
  placeholder = "Search courses, lecture notes, PDFs...",
  size = "default",
}: SearchBarProps) {
  const router = useRouter();
  const [query, setQuery] = useState(defaultValue);
  const [isPending, startTransition] = useTransition();

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    const trimmed = query.trim();
    if (!trimmed) return;

    startTransition(() => {
      router.push(`/search?q=${encodeURIComponent(trimmed)}`);
    });
  }

  return (
    <form onSubmit={handleSubmit} className="flex w-full gap-2">
      <div className="relative flex-1">
        <Search
          className={cn(
            "absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground transition-opacity",
            isPending && "opacity-40"
          )}
        />
        <Input
          id="site-search"
          type="search"
          placeholder={placeholder}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          disabled={isPending}
          className={cn(
            "pl-10 text-base transition-[border-color,box-shadow] duration-200 focus-visible:ring-primary/30",
            size === "lg" ? "min-h-12 md:text-base" : "min-h-11 md:text-sm"
          )}
          aria-keyshortcuts="/"
        />
      </div>
      <Button
        type="submit"
        size={size === "lg" ? "lg" : "default"}
        disabled={isPending || !query.trim()}
        className="transition-opacity duration-200"
      >
        {isPending ? "Searching…" : "Search"}
      </Button>
    </form>
  );
}
