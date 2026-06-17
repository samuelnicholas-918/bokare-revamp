/** Resolve the best public URL for a material (reader, download, or external). */
export function getMaterialHref(material: {
  id: string;
  slug?: string | null;
  contentHtml?: string | null;
  fileUrl?: string | null;
  externalUrl?: string | null;
  course: { slug: string };
}): string {
  if (material.slug && material.contentHtml) {
    return `/courses/${material.course.slug}/learn/${material.slug}`;
  }
  if (material.fileUrl) {
    return `/api/materials/${material.id}/download`;
  }
  if (material.externalUrl) {
    return material.externalUrl;
  }
  return `/courses/${material.course.slug}`;
}

export function isExternalMaterialHref(href: string): boolean {
  return href.startsWith("http://") || href.startsWith("https://");
}
