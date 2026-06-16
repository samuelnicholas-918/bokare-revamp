"use client";

import { useRouter } from "next/navigation";
import { FormEvent, useEffect, useState } from "react";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MATERIAL_TYPE_LABELS } from "@/lib/utils";

interface Course {
  id: string;
  title: string;
  slug: string;
}

export default function AdminUploadPage() {
  const router = useRouter();
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    fetch("/api/courses")
      .then((r) => r.json())
      .then(setCourses)
      .catch(console.error);
  }, []);

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess(false);

    const form = new FormData(e.currentTarget);
    const body = {
      courseId: form.get("courseId"),
      type: form.get("type"),
      title: form.get("title"),
      description: form.get("description") || undefined,
      fileUrl: form.get("fileUrl") || undefined,
      externalUrl: form.get("externalUrl") || undefined,
      order: parseInt(form.get("order") as string) || 0,
    };

    const res = await fetch("/api/materials", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    setLoading(false);

    if (!res.ok) {
      const data = await res.json();
      setError(data.error || "Failed to upload");
      return;
    }

    setSuccess(true);
    router.refresh();
  }

  return (
    <div className="container mx-auto max-w-2xl px-4 py-8">
      <h1 className="font-display mb-6 text-3xl font-bold">Upload Material</h1>

      <Card>
        <CardHeader>
          <CardTitle>New Course Material</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="mb-1 block text-sm font-medium">Course</label>
              <select
                name="courseId"
                required
                className="flex h-10 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm"
              >
                <option value="">Select a course</option>
                {courses.map((c) => (
                  <option key={c.id} value={c.id}>{c.title}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium">Material Type</label>
              <select
                name="type"
                required
                className="flex h-10 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm"
              >
                {Object.entries(MATERIAL_TYPE_LABELS).map(([key, label]) => (
                  <option key={key} value={key}>{label}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium">Title</label>
              <Input name="title" required placeholder="e.g. Unit 3 — Demand Analysis" />
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium">Description (optional)</label>
              <Input name="description" placeholder="Brief description" />
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium">File URL (PDF download)</label>
              <Input name="fileUrl" type="url" placeholder="https://..." />
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium">External URL (view online)</label>
              <Input name="externalUrl" type="url" placeholder="https://..." />
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium">Display Order</label>
              <Input name="order" type="number" defaultValue={0} min={0} />
            </div>

            {error && <p className="text-sm text-destructive">{error}</p>}
            {success && <p className="text-sm text-primary">Material uploaded successfully!</p>}

            <Button type="submit" disabled={loading}>
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Uploading...
                </>
              ) : (
                "Upload Material"
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
