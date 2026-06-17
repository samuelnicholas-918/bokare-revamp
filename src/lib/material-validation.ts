import { MaterialType } from "@prisma/client";

export interface MaterialPayload {
  courseId?: string;
  type?: string;
  title?: string;
  description?: string | null;
  fileUrl?: string | null;
  externalUrl?: string | null;
  contentHtml?: string | null;
  slug?: string | null;
  order?: number;
  fileSizeBytes?: number | null;
}

export function validateMaterialPayload(body: MaterialPayload): string | null {
  if (!body.courseId) return "Course is required";
  if (!body.type || !Object.values(MaterialType).includes(body.type as MaterialType)) {
    return "Valid material type is required";
  }
  if (!body.title?.trim()) return "Title is required";

  const hasFile = !!body.fileUrl?.trim();
  const hasExternal = !!body.externalUrl?.trim();
  const hasHtml = !!body.contentHtml?.trim();

  if (!hasFile && !hasExternal && !hasHtml) {
    return "Provide a PDF file/URL, external link, or HTML content for students to access";
  }

  if (hasHtml && !body.slug?.trim()) {
    return "URL slug is required when adding HTML reader content";
  }

  return null;
}

export function slugifyTitle(title: string): string {
  return title
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}
