import type { LucideIcon } from "lucide-react";
import { BookOpen, GraduationCap, TrendingUp } from "lucide-react";
import type { AcademicYearId } from "@/lib/utils";

export interface YearVisual {
  icon: LucideIcon;
  accent: string;
  roman: string;
  shortLabel: string;
}

export const YEAR_VISUALS: Record<AcademicYearId, YearVisual> = {
  "first-year": {
    icon: BookOpen,
    accent: "from-primary to-[hsl(var(--accent-electric))]",
    roman: "I",
    shortLabel: "FY",
  },
  "second-year": {
    icon: TrendingUp,
    accent: "from-[hsl(var(--accent-electric))] to-[hsl(var(--accent-purple)/0.85)]",
    roman: "II",
    shortLabel: "SY",
  },
  "third-year": {
    icon: GraduationCap,
    accent: "from-[hsl(var(--accent-purple))] to-primary",
    roman: "III",
    shortLabel: "TY",
  },
};

export function getYearVisual(id: AcademicYearId): YearVisual {
  return YEAR_VISUALS[id];
}
