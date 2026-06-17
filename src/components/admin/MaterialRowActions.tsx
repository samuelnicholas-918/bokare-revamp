"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import Link from "next/link";
import { ExternalLink, Pencil, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";

interface MaterialRowActionsProps {
  materialId: string;
  courseSlug: string;
  materialSlug: string | null;
  hasReader: boolean;
}

export function MaterialRowActions({
  materialId,
  courseSlug,
  materialSlug,
  hasReader,
}: MaterialRowActionsProps) {
  const router = useRouter();
  const [deleting, setDeleting] = useState(false);

  async function handleDelete() {
    if (!window.confirm("Delete this material? This cannot be undone.")) return;

    setDeleting(true);
    try {
      const res = await fetch(`/api/materials/${materialId}`, { method: "DELETE" });
      if (!res.ok) {
        alert("Failed to delete material");
        return;
      }
      router.refresh();
    } finally {
      setDeleting(false);
    }
  }

  return (
    <div className="flex justify-end gap-1">
      {hasReader && materialSlug && (
        <Button variant="ghost" size="sm" asChild>
          <Link href={`/courses/${courseSlug}/learn/${materialSlug}`} target="_blank">
            <ExternalLink className="h-4 w-4" />
            <span className="sr-only">View</span>
          </Link>
        </Button>
      )}
      <Button variant="outline" size="sm" asChild>
        <Link href={`/admin/upload?edit=${materialId}`}>
          <Pencil className="h-4 w-4" />
          <span className="sr-only">Edit</span>
        </Link>
      </Button>
      <Button
        variant="ghost"
        size="sm"
        className="text-destructive hover:text-destructive"
        disabled={deleting}
        onClick={() => void handleDelete()}
      >
        <Trash2 className="h-4 w-4" />
        <span className="sr-only">Delete</span>
      </Button>
    </div>
  );
}
