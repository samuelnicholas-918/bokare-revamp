export default function Loading() {
  return (
    <div className="container mx-auto animate-pulse px-4 py-10">
      <div className="mx-auto max-w-3xl rounded-2xl border bg-muted/40 p-10">
        <div className="mx-auto h-6 w-40 rounded-full bg-muted" />
        <div className="mx-auto mt-4 h-10 w-3/4 rounded-lg bg-muted" />
        <div className="mx-auto mt-3 h-5 w-full rounded-lg bg-muted" />
        <div className="mx-auto mt-8 h-12 rounded-lg bg-muted" />
      </div>
      <div className="mt-12 grid gap-4 md:grid-cols-3">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="h-44 rounded-xl border bg-muted/30" />
        ))}
      </div>
    </div>
  );
}
