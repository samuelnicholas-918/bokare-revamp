"use client";

import { usePathname } from "next/navigation";
import { Footer } from "@/components/Footer";
import { MobileBottomNav } from "@/components/MobileBottomNav";
import { Navbar } from "@/components/Navbar";
import { SearchKeyboardShortcut } from "@/components/SearchKeyboardShortcut";
import { SkipToContent } from "@/components/SkipToContent";
import { cn } from "@/lib/utils";

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isLearn = /\/learn\//.test(pathname);
  const isAdmin = pathname.startsWith("/admin");
  const showMobileNav = !isLearn && !isAdmin;

  return (
    <div className={cn("flex min-h-screen flex-col", showMobileNav && "pb-16 md:pb-0")}>
      <SkipToContent />
      <SearchKeyboardShortcut />
      {!isAdmin && <Navbar />}
      <main id="main-content" className="flex-1">
        {children}
      </main>
      {!isAdmin && <Footer />}
      {showMobileNav && <MobileBottomNav />}
    </div>
  );
}
