'use client';

import { Suspense } from 'react';
import PaperTexture from '@/components/passport/PaperTexture';
import JournalScroll from '@/components/journal/JournalScroll';

/**
 * Calm parchment skeleton mirroring `JournalScrollView`'s own `isLoading`
 * shape (masthead + log rows) so a Suspense trip and a query-in-flight read
 * as the same "loading your journal" moment. Fixed dimensions, matching the
 * real content's container exactly, so nothing shifts when it swaps in.
 */
function JournalSkeleton() {
  return (
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
  );
}

/**
 * `/journal` — Cook's Journal (phase 3a). A thin route shell: mounts
 * `PaperTexture` once (the `#stamp-ink` filter every stamp-bearing surface
 * inside `JournalScroll` depends on), then hands off to the self-fetching
 * `JournalScroll`, which owns the loading / nascent / populated states and
 * the `StampedRecipesModal` wiring.
 *
 * The wrapper itself is a normal theme-aware parchment/sepia surface — only
 * the stamp tiles inside `JournalStamps` / `JournalDishMark` / `TravelIdentity`
 * are locked to `passport-light`, per the phase 3a plan.
 */
export default function JournalPage() {
  return (
    <div className="min-h-screen bg-parchment">
      <PaperTexture />
      <Suspense fallback={<JournalSkeleton />}>
        <JournalScroll />
      </Suspense>
    </div>
  );
}
