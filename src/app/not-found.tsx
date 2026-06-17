import { EmptyState } from "@/components/ui/EmptyState";

export default function NotFound() {
  return (
    <div className="container mx-auto flex min-h-[55vh] items-center justify-center px-4 py-12">
      <EmptyState
        variant="not-found"
        action={{ label: "Back to Home", href: "/" }}
        secondaryAction={{ label: "Browse Courses", href: "/courses" }}
        className="w-full max-w-lg"
      />
    </div>
  );
}
