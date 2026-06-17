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

const ROMAN_SEMESTERS = ["", "I", "II", "III", "IV", "V", "VI"] as const;

/** Official B.Com semester label — corrects wrong labels in legacy HTML (e.g. Sem IV shown as Sem III). */
export function formatBComSemesterLabel(semester: number): string {
  if (semester < 1 || semester > 6) return "";
  const year = semester <= 2 ? "FY" : semester <= 4 ? "SY" : "TY";
  return `${year} B Com Semester ${ROMAN_SEMESTERS[semester]}`;
}

export const ACADEMIC_YEARS = [
  {
    id: "first-year",
    label: "First Year",
    description: "Semesters 1 & 2",
    semesters: [1, 2],
  },
  {
    id: "second-year",
    label: "Second Year",
    description: "Semesters 3 & 4",
    semesters: [3, 4],
  },
  {
    id: "third-year",
    label: "Third Year",
    description: "Semesters 5 & 6",
    semesters: [5, 6],
  },
] as const;

export type AcademicYearId = (typeof ACADEMIC_YEARS)[number]["id"];

export function courseBelongsToYear(
  semester: number,
  category: string,
  yearId: AcademicYearId
): boolean {
  const year = ACADEMIC_YEARS.find((entry) => entry.id === yearId);
  if (!year) return false;

  if (category === "ELECTIVE") {
    return yearId === "third-year" && (semester === 5 || semester === 6);
  }

  if (category === "CORE") {
    return (year.semesters as readonly number[]).includes(semester);
  }

  return false;
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
