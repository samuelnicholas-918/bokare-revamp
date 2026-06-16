"use client";

import { useEffect } from "react";
import { trackEvent } from "@/lib/analytics";

export function MaterialViewTracker({
  materialId,
  courseId,
  title,
}: {
  materialId: string;
  courseId: string;
  title: string;
}) {
  useEffect(() => {
    trackEvent("material_viewed", { title }, { materialId, courseId });
  }, [materialId, courseId, title]);

  return null;
}
