export default function Loading() {
  return (
    <div className="flex min-h-screen bg-gray-50">
      <div className="w-64 shrink-0 bg-[#0D0D0D]" />
      <div className="flex-1 ml-64">
        <div className="sticky top-0 z-30 h-16 border-b bg-white" />
        <main className="p-8">
          <div className="mb-8 h-8 w-48 rounded-lg bg-gray-200 animate-pulse" />
          <div className="mb-6 grid grid-cols-3 gap-4">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="rounded-xl border bg-white p-5 shadow-sm">
                <div className="mb-3 h-10 w-10 rounded-lg bg-gray-100 animate-pulse" />
                <div className="mb-2 h-7 w-16 rounded bg-gray-200 animate-pulse" />
                <div className="h-4 w-24 rounded bg-gray-100 animate-pulse" />
              </div>
            ))}
          </div>
          <div className="grid grid-cols-2 gap-6">
            {Array.from({ length: 2 }).map((_, i) => (
              <div key={i} className="rounded-xl border bg-white p-6 shadow-sm">
                <div className="mb-4 h-5 w-32 rounded bg-gray-200 animate-pulse" />
                <div className="h-48 rounded-lg bg-gray-100 animate-pulse" />
              </div>
            ))}
          </div>
        </main>
      </div>
    </div>
  );
}
