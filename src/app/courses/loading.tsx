export default function CoursesLoading() {
  return (
    <div className="container mx-auto animate-pulse px-4 py-8">
      <div className="mb-8 rounded-2xl border bg-muted/30 p-10">
        <div className="h-4 w-24 rounded bg-muted" />
        <div className="mt-3 h-9 w-64 rounded-lg bg-muted" />
        <div className="mt-2 h-5 w-96 max-w-full rounded-lg bg-muted" />
      </div>
      <div className="mb-8 flex flex-wrap gap-2">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="h-8 w-24 rounded-full bg-muted" />
        ))}
      </div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="h-52 rounded-xl border bg-muted/30">
            <div className="h-1 bg-muted" />
            <div className="p-6 space-y-3">
              <div className="h-10 w-10 rounded-xl bg-muted" />
              <div className="h-5 w-3/4 rounded bg-muted" />
              <div className="h-4 w-full rounded bg-muted" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
