export default function SearchLoading() {
  return (
    <div className="container mx-auto animate-pulse px-4 py-8">
      <div className="mx-auto max-w-2xl space-y-3">
        <div className="h-9 w-48 rounded-lg bg-muted" />
        <div className="h-5 w-full rounded-lg bg-muted" />
        <div className="mt-6 h-12 rounded-lg bg-muted" />
      </div>
      <div className="mt-8 space-y-3">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="h-20 rounded-lg bg-muted" />
        ))}
      </div>
    </div>
  );
}
