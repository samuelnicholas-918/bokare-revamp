import { type Course, type Material, MaterialType } from "@prisma/client";

export type CourseWithMaterials = Course & {
  materials?: Material[];
  _count?: { materials: number };
};

export type MaterialWithCourse = Material & {
  course: Pick<Course, "id" | "title" | "slug" | "semester">;
};

export const MATERIAL_TYPES: MaterialType[] = [
  "LECTURE_NOTES",
  "NUMERICAL_PROBLEMS",
  "QUESTION_BANK",
  "SELF_STUDY",
  "TECHNICAL_NOTES",
  "QUESTION_PAPERS",
  "PDF",
  "RESOURCES",
];

export interface SearchParams {
  q?: string;
  semester?: string;
  type?: string;
}
