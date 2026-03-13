export default function Loading() {
  return (
    <div className="flex min-h-screen bg-gray-50">
      <div className="w-64 shrink-0 bg-[#0D0D0D]" />
      <div className="flex-1 ml-64">
        <div className="sticky top-0 z-30 h-16 border-b bg-white" />
        <main className="p-8">
          <div className="mb-8 h-8 w-48 rounded-lg bg-gray-200 animate-pulse" />
          <div className="mb-6 grid grid-cols-4 gap-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="rounded-xl border bg-white p-5 shadow-sm">
                <div className="mb-3 h-10 w-10 rounded-lg bg-gray-100 animate-pulse" />
                <div className="mb-2 h-7 w-16 rounded bg-gray-200 animate-pulse" />
                <div className="h-4 w-24 rounded bg-gray-100 animate-pulse" />
              </div>
            ))}
          </div>
          <div className="rounded-xl border bg-white shadow-sm">
            <div className="border-b px-6 py-4">
              <div className="h-5 w-32 rounded bg-gray-200 animate-pulse" />
            </div>
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="flex items-center justify-between border-b px-6 py-4 last:border-0">
                <div className="flex items-center gap-4">
                  <div className="h-4 w-16 rounded bg-gray-100 animate-pulse" />
                  <div className="h-4 w-40 rounded bg-gray-200 animate-pulse" />
                </div>
                <div className="flex items-center gap-2">
                  <div className="h-6 w-16 rounded-full bg-gray-100 animate-pulse" />
                  <div className="h-6 w-20 rounded-full bg-gray-200 animate-pulse" />
                </div>
              </div>
            ))}
          </div>
        </main>
      </div>
    </div>
  );
}
