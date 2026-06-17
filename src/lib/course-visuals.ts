import type { CourseCategory } from "@prisma/client";
import type { LucideIcon } from "lucide-react";
import { BarChart3, Briefcase, BookOpen, Landmark, Sparkles, TrendingUp } from "lucide-react";

export const CATEGORY_ACCENT: Record<CourseCategory, string> = {
  CORE: "from-primary to-[hsl(var(--accent-electric))]",
  ELECTIVE: "from-purple to-[hsl(var(--accent-purple))]",
  PROFESSIONAL: "from-gold to-[hsl(var(--accent-gold))]",
};

export function getCourseIcon(slug: string, category: CourseCategory): LucideIcon {
  if (slug.includes("banking")) return Landmark;
  if (slug.includes("macro") || slug.includes("international")) return BarChart3;
  if (slug.includes("consumer") || slug.includes("production")) return TrendingUp;
  if (category === "ELECTIVE") return Sparkles;
  if (category === "PROFESSIONAL") return Briefcase;
  return BookOpen;
}
