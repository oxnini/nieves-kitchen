/**
 * Route-level fallback for `/journal`, shown while the page segment's code
 * loads. Mirrors `JournalScrollView`'s own `isLoading` skeleton exactly
 * (masthead + log rows) so this and the in-page Suspense fallback in
 * `app/journal/page.tsx` read as the same moment. Fixed dimensions — zero
 * layout shift once the real content mounts.
 */
export default function JournalLoading() {
  return (
    <div className="min-h-screen bg-parchment">
      <div
        aria-busy="true"
        role="status"
        aria-label="Loading your journal"
        className="max-w-2xl mx-auto px-6 py-16 sm:py-24 flex flex-col gap-16"
      >
        <div>
          <div className="h-3 w-28 bg-parchment-dark rounded animate-pulse" />
          <div className="mt-3 h-10 w-3/4 bg-parchment-dark rounded animate-pulse" />
          <div className="mt-8 flex items-center gap-8 sm:gap-12">
            <div className="h-12 w-14 bg-parchment-dark rounded animate-pulse" />
            <div className="h-12 w-14 bg-parchment-dark rounded animate-pulse" />
            <div className="h-12 w-14 bg-parchment-dark rounded animate-pulse" />
          </div>
        </div>

        <div className="flex flex-col gap-5">
          <div className="h-3 w-32 bg-parchment-dark rounded animate-pulse" />
          {[0, 1, 2].map((i) => (
            <div key={i} className="flex items-center gap-4">
              <div className="h-3 w-16 shrink-0 bg-parchment-dark rounded animate-pulse" />
              <div className="h-3 flex-1 bg-parchment-dark rounded animate-pulse" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
