import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatFileSize(bytes?: number | null): string {
  if (!bytes) return "";
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export function formatDate(date: Date | string): string {
  return new Intl.DateTimeFormat("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(new Date(date));
}

export function getAcademicYear(semester: number): string | null {
  if (semester === 1 || semester === 2) return "First Year";
  if (semester === 3 || semester === 4) return "Second Year";
  if (semester === 5 || semester === 6) return "Third Year";
  return null;
}

export const MATERIAL_TYPE_LABELS: Record<string, string> = {
  LECTURE_NOTES: "Lecture Notes",
  NUMERICAL_PROBLEMS: "Numerical Problems",
  QUESTION_BANK: "Question Bank",
  SELF_STUDY: "Self-Study Exercises",
  TECHNICAL_NOTES: "Technical Notes",
  QUESTION_PAPERS: "Question Papers",
  PDF: "PDF Resources",
  RESOURCES: "Additional Resources",
};
