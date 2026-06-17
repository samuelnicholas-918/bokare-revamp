"use client";

import { FormEvent, useCallback, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { FileUp, Loader2, Link2, BookOpen } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MATERIAL_TYPE_LABELS, formatFileSize } from "@/lib/utils";
import { slugifyTitle } from "@/lib/material-validation";
import { cn } from "@/lib/utils";

interface Course {
  id: string;
  title: string;
  slug: string;
}

interface MaterialData {
  id: string;
  courseId: string;
  type: string;
  title: string;
  description: string | null;
  fileUrl: string | null;
  externalUrl: string | null;
  contentHtml: string | null;
  slug: string | null;
  order: number;
  fileSizeBytes: number | null;
}

type SourceTab = "file" | "link" | "html";

export function MaterialForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const editId = searchParams.get("edit");

  const [courses, setCourses] = useState<Course[]>([]);
  const [material, setMaterial] = useState<MaterialData | null>(null);
  const [loading, setLoading] = useState(false);
  const [loadingMaterial, setLoadingMaterial] = useState(!!editId);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [sourceTab, setSourceTab] = useState<SourceTab>("file");
  const [fileUrl, setFileUrl] = useState("");
  const [fileSizeBytes, setFileSizeBytes] = useState<number | null>(null);
  const [uploadedName, setUploadedName] = useState("");

  useEffect(() => {
    fetch("/api/courses")
      .then((r) => r.json())
      .then(setCourses)
      .catch(console.error);
  }, []);

  useEffect(() => {
    if (!editId) return;

    setLoadingMaterial(true);
    fetch(`/api/materials/${editId}`)
      .then((r) => {
        if (!r.ok) throw new Error("Material not found");
        return r.json();
      })
      .then((data: MaterialData) => {
        setMaterial(data);
        setFileUrl(data.fileUrl || "");
        setFileSizeBytes(data.fileSizeBytes);
        if (data.contentHtml) setSourceTab("html");
        else if (data.externalUrl) setSourceTab("link");
        else setSourceTab("file");
      })
      .catch(() => setError("Could not load material for editing"))
      .finally(() => setLoadingMaterial(false));
  }, [editId]);

  const handleFileUpload = useCallback(async (file: File) => {
    setUploading(true);
    setError("");

    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch("/api/admin/upload-file", { method: "POST", body: formData });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Upload failed");
        return;
      }
      setFileUrl(data.url);
      setFileSizeBytes(data.fileSizeBytes);
      setUploadedName(file.name);
      setSourceTab("file");
    } catch {
      setError("Upload failed — try again or paste a file URL");
    } finally {
      setUploading(false);
    }
  }, []);

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess(false);

    const form = new FormData(e.currentTarget);
    const title = (form.get("title") as string).trim();
    const contentHtml = (form.get("contentHtml") as string)?.trim() || undefined;
    const slugInput = (form.get("slug") as string)?.trim();
    const slug = slugInput || (contentHtml ? slugifyTitle(title) : undefined);

    const body: Record<string, unknown> = {
      courseId: form.get("courseId"),
      type: form.get("type"),
      title,
      description: (form.get("description") as string)?.trim() || null,
      order: parseInt(form.get("order") as string, 10) || 0,
    };

    if (sourceTab === "file") {
      body.fileUrl = fileUrl || null;
      body.externalUrl = null;
      body.contentHtml = null;
      body.slug = null;
      body.fileSizeBytes = fileSizeBytes;
    } else if (sourceTab === "link") {
      body.externalUrl = (form.get("externalUrl") as string)?.trim() || null;
      body.fileUrl = null;
      body.contentHtml = null;
      body.slug = null;
      body.fileSizeBytes = null;
    } else {
      body.contentHtml = contentHtml || null;
      body.slug = slug || null;
      body.fileUrl = null;
      body.externalUrl = null;
      body.fileSizeBytes = null;
    }

    const url = editId ? `/api/materials/${editId}` : "/api/materials";
    const method = editId ? "PUT" : "POST";

    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    setLoading(false);

    if (!res.ok) {
      const data = await res.json();
      setError(data.error || "Failed to save material");
      return;
    }

    setSuccess(true);
    if (!editId) {
      (e.target as HTMLFormElement).reset();
      setFileUrl("");
      setFileSizeBytes(null);
      setUploadedName("");
    }
    router.refresh();
  }

  if (loadingMaterial) {
    return (
      <div className="flex items-center justify-center py-16 text-muted-foreground">
        <Loader2 className="mr-2 h-5 w-5 animate-spin" />
        Loading material…
      </div>
    );
  }

  const tabs: { id: SourceTab; label: string; icon: typeof FileUp }[] = [
    { id: "file", label: "PDF / File", icon: FileUp },
    { id: "link", label: "Web Link", icon: Link2 },
    { id: "html", label: "Reader HTML", icon: BookOpen },
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle>{editId ? "Edit Material" : "New Course Material"}</CardTitle>
        <p className="text-sm text-muted-foreground">
          Upload a PDF, link to Google Drive, or paste HTML for the in-app reader.
        </p>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="sm:col-span-2">
              <label className="mb-1 block text-sm font-medium">Course</label>
              <select
                name="courseId"
                required
                defaultValue={material?.courseId ?? ""}
                className="flex h-10 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm"
              >
                <option value="">Select a course</option>
                {courses.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.title}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium">Material Type</label>
              <select
                name="type"
                required
                defaultValue={material?.type ?? "LECTURE_NOTES"}
                className="flex h-10 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm"
              >
                {Object.entries(MATERIAL_TYPE_LABELS).map(([key, label]) => (
                  <option key={key} value={key}>
                    {label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium">Display Order</label>
              <Input
                name="order"
                type="number"
                defaultValue={material?.order ?? 0}
                min={0}
              />
            </div>
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium">Title</label>
            <Input
              name="title"
              required
              defaultValue={material?.title ?? ""}
              placeholder="e.g. Unit 3 — Demand Analysis"
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium">Description (optional)</label>
            <Input
              name="description"
              defaultValue={material?.description ?? ""}
              placeholder="Brief description for students"
            />
          </div>

          <div>
            <p className="mb-2 text-sm font-medium">How students access this</p>
            <div className="flex flex-wrap gap-2">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    type="button"
                    onClick={() => setSourceTab(tab.id)}
                    className={cn(
                      "inline-flex items-center gap-1.5 rounded-lg border px-3 py-2 text-sm transition-colors",
                      sourceTab === tab.id
                        ? "border-primary bg-primary/10 text-primary"
                        : "hover:bg-muted"
                    )}
                  >
                    <Icon className="h-4 w-4" />
                    {tab.label}
                  </button>
                );
              })}
            </div>
          </div>

          {sourceTab === "file" && (
            <div className="space-y-3 rounded-xl border bg-muted/30 p-4">
              <label className="block">
                <span className="mb-2 block text-sm font-medium">Upload file</span>
                <input
                  type="file"
                  accept=".pdf,.doc,.docx,.ppt,.pptx,application/pdf"
                  disabled={uploading}
                  onChange={(ev) => {
                    const file = ev.target.files?.[0];
                    if (file) void handleFileUpload(file);
                  }}
                  className="block w-full text-sm file:mr-3 file:rounded-lg file:border-0 file:bg-primary file:px-4 file:py-2 file:text-sm file:font-medium file:text-primary-foreground"
                />
              </label>
              {uploading && (
                <p className="flex items-center text-sm text-muted-foreground">
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Uploading…
                </p>
              )}
              {uploadedName && fileUrl && (
                <p className="text-sm text-primary">
                  ✓ {uploadedName}
                  {fileSizeBytes ? ` (${formatFileSize(fileSizeBytes)})` : ""}
                </p>
              )}
              <div>
                <label className="mb-1 block text-sm text-muted-foreground">
                  Or paste a direct file URL (Google Drive, Dropbox, etc.)
                </label>
                <Input
                  type="url"
                  value={fileUrl}
                  onChange={(e) => setFileUrl(e.target.value)}
                  placeholder="https://..."
                />
              </div>
            </div>
          )}

          {sourceTab === "link" && (
            <div className="rounded-xl border bg-muted/30 p-4">
              <label className="mb-1 block text-sm font-medium">External URL</label>
              <Input
                name="externalUrl"
                type="url"
                defaultValue={material?.externalUrl ?? ""}
                placeholder="https://drive.google.com/..."
              />
              <p className="mt-2 text-xs text-muted-foreground">
                Opens in a new tab — good for Google Drive or YouTube links.
              </p>
            </div>
          )}

          {sourceTab === "html" && (
            <div className="space-y-3 rounded-xl border bg-muted/30 p-4">
              <div>
                <label className="mb-1 block text-sm font-medium">URL slug</label>
                <Input
                  name="slug"
                  defaultValue={material?.slug ?? ""}
                  placeholder="demand-analysis"
                  pattern="[a-z0-9-]+"
                />
                <p className="mt-1 text-xs text-muted-foreground">
                  Used in the reader URL: /courses/…/learn/<strong>your-slug</strong>
                </p>
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium">HTML content</label>
                <textarea
                  name="contentHtml"
                  rows={8}
                  defaultValue={material?.contentHtml ?? ""}
                  placeholder="<p>Chapter content…</p>"
                  className="w-full rounded-lg border border-input bg-background px-3 py-2 font-mono text-sm"
                />
              </div>
            </div>
          )}

          {error && <p className="text-sm text-destructive">{error}</p>}
          {success && (
            <p className="text-sm text-primary">
              {editId ? "Material updated successfully!" : "Material added successfully!"}
            </p>
          )}

          <div className="flex flex-wrap gap-3">
            <Button type="submit" disabled={loading || uploading}>
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Saving…
                </>
              ) : editId ? (
                "Save Changes"
              ) : (
                "Add Material"
              )}
            </Button>
            {editId && (
              <Button type="button" variant="outline" onClick={() => router.push("/admin/manage-content")}>
                Back to Manage
              </Button>
            )}
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
