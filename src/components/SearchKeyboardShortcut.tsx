"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export function SearchKeyboardShortcut() {
  const router = useRouter();

  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      if (e.key !== "/" || e.metaKey || e.ctrlKey || e.altKey) return;
      const tag = (e.target as HTMLElement)?.tagName;
      if (tag === "INPUT" || tag === "TEXTAREA" || tag === "SELECT") return;
      e.preventDefault();
      const input = document.getElementById("site-search") as HTMLInputElement | null;
      if (input) {
        input.focus();
        return;
      }
      router.push("/search");
    }

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [router]);

  return null;
}
