"use client";

import { useRouter } from "next/navigation";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { FormEvent, useState } from "react";

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

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (query.trim()) {
      router.push(`/search?q=${encodeURIComponent(query.trim())}`);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex w-full gap-2">
      <div className="relative flex-1">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          type="search"
          placeholder={placeholder}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className={size === "lg" ? "min-h-12 pl-10 text-base md:text-base" : "min-h-11 pl-10 text-base md:text-sm"}
        />
      </div>
      <Button type="submit" size={size === "lg" ? "lg" : "default"}>
        Search
      </Button>
    </form>
  );
}
