'use client';

import PaperTexture from '@/components/passport/PaperTexture';
import JournalScroll from '@/components/journal/JournalScroll';

/**
 * `/journal` — Cook's Journal (phase 3a). A thin route shell: mounts
 * `PaperTexture` once (the `#stamp-ink` filter every stamp-bearing surface
 * inside `JournalScroll` depends on), then hands off to the self-fetching
 * `JournalScroll`, which owns the loading / nascent / populated states and
 * the `StampedRecipesModal` wiring.
 *
 * Loading is covered by two boundaries that actually fire: the route-level
 * `app/journal/loading.tsx` (during the RSC/navigation transition) and
 * `JournalScrollView`'s own `isLoading` skeleton (during the client data
 * fetch). A page-level `<Suspense>` would be inert here — `JournalScroll` is
 * a plain client component on ordinary (non-suspense) TanStack Query hooks,
 * nothing in its subtree throws a promise — so it is deliberately omitted.
 *
 * The wrapper itself is a normal theme-aware parchment/sepia surface — only
 * the stamp tiles inside `JournalStamps` / `JournalDishMark` / `TravelIdentity`
 * are locked to `passport-light`, per the phase 3a plan.
 */
export default function JournalPage() {
  return (
    <div className="min-h-screen bg-parchment">
      <PaperTexture />
      <JournalScroll />
    </div>
  );
}
