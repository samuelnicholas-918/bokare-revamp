"use client";

import { useEffect } from "react";
import { trackEvent } from "@/lib/analytics";

export function CourseViewTracker({
  courseId,
  slug,
  title,
}: {
  courseId: string;
  slug: string;
  title: string;
}) {
  useEffect(() => {
    trackEvent("course_viewed", { slug, title }, { courseId });
  }, [courseId, slug, title]);

  return null;
}
