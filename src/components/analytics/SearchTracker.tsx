"use client";

import { useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { trackEvent } from "@/lib/analytics";

export function SearchTracker({ resultCount }: { resultCount: number }) {
  const searchParams = useSearchParams();
  const q = searchParams.get("q")?.trim();

  useEffect(() => {
    if (!q) return;
    trackEvent("search_performed", { query: q, resultCount });
  }, [q, resultCount]);

  return null;
}
