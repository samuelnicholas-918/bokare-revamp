"use client";

import { Suspense } from "react";
import { MaterialForm } from "@/components/admin/MaterialForm";
import { Loader2 } from "lucide-react";

function FormFallback() {
  return (
    <div className="flex items-center justify-center py-16 text-muted-foreground">
      <Loader2 className="mr-2 h-5 w-5 animate-spin" />
      Loading…
    </div>
  );
}

export default function AdminUploadPage() {
  return (
    <div className="container mx-auto max-w-2xl px-4 py-8">
      <h1 className="font-display mb-2 text-3xl font-bold">Upload Material</h1>
      <p className="mb-6 text-muted-foreground">
        Add PDFs, links, or reader content for your students — no coding required.
      </p>
      <Suspense fallback={<FormFallback />}>
        <MaterialForm />
      </Suspense>
    </div>
  );
}
