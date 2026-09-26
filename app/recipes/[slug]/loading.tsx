/**
 * Route-level fallback for /recipes/[slug]. Mirrors the recipe spread: the
 * header on paper (back link, eyebrow, title, italic attribution, the ruled
 * facts row, the lede), then the raised sheet with Ingredients | Method from
 * md (the hero plate tops the Method page). Server-safe, no client code.
 */
export default function RecipeLoading() {
  return (
    <div className="min-h-screen bg-parchment">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* ── Back link ── */}
        <div className="mb-6">
          <div className="h-5 w-24 bg-brown-light/20 rounded-full animate-pulse" />
        </div>

        {/* ── Header on paper ── */}
        <div className="h-3 w-40 bg-brown-light/20 rounded-full animate-pulse" />
        <div className="mt-3 h-11 sm:h-14 w-3/4 max-w-xl bg-brown-light/20 rounded-md animate-pulse" />
        <div className="mt-3 h-5 w-1/2 max-w-sm bg-brown-light/15 rounded-full animate-pulse" />

        {/* ── Facts row: teal rule above, hairline below ── */}
        <div className="mt-6 mb-7 flex flex-wrap items-center gap-6 border-t border-b border-t-teal border-b-line py-3">
          {[0, 1, 2].map(i => (
            <div key={i} className="space-y-1.5">
              <div className="h-5 w-16 bg-brown-light/20 rounded-full animate-pulse" />
              <div className="h-3 w-10 bg-brown-light/15 rounded-full animate-pulse" />
            </div>
          ))}
        </div>

        {/* ── Phone plate (from md it tops the Method page) ── */}
        <div className="md:hidden aspect-[3/2] rounded-[3px] bg-brown-light/20 animate-pulse mb-8" />

        {/* ── Lede ── */}
        <div className="space-y-2 mb-10 max-w-3xl">
          <div className="h-4 bg-brown-light/15 rounded-full w-full animate-pulse" />
          <div className="h-4 bg-brown-light/15 rounded-full w-11/12 animate-pulse" />
          <div className="h-4 bg-brown-light/15 rounded-full w-2/3 animate-pulse" />
        </div>

        {/* ── Raised sheet: Ingredients | Method ── */}
        <div className="grid md:grid-cols-2 rounded-[3px] bg-surface ring-1 ring-line">
          <div className="p-5 sm:p-8 lg:p-14">
            <div className="h-7 w-32 bg-brown-light/20 rounded-full mb-4 animate-pulse" />
            {[0, 1, 2, 3, 4, 5].map(i => (
              <div key={i} className="flex justify-between py-2.5 border-b border-line">
                <div className="h-4 w-28 bg-brown-light/10 rounded-full animate-pulse" />
                <div className="h-4 w-14 bg-brown-light/10 rounded-full animate-pulse" />
              </div>
            ))}
          </div>
          <div className="p-5 sm:p-8 lg:p-14 border-t border-line md:border-t-0 md:border-l">
            <div className="hidden md:block aspect-[3/2] rounded-[3px] bg-brown-light/20 animate-pulse mb-8" />
            <div className="h-7 w-24 bg-brown-light/20 rounded-full mb-4 animate-pulse" />
            {[0, 1, 2, 3].map(i => (
              <div key={i} className="flex gap-3 py-3 border-b border-line">
                <div className="shrink-0 w-7 h-6 bg-brown-light/20 rounded animate-pulse" />
                <div className="flex-1 space-y-2 pt-1">
                  <div className="h-4 bg-brown-light/10 rounded-full w-full animate-pulse" />
                  <div className="h-4 bg-brown-light/10 rounded-full w-3/4 animate-pulse" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
