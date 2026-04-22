export default function RecipeLoading() {
  return (
    <div className="min-h-screen bg-parchment">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* ── Header bar ── */}
        <div className="flex items-center justify-between mb-6">
          <div className="h-5 w-24 bg-brown-light/20 rounded-full animate-pulse" />
          <div className="flex items-center gap-2">
            <div className="h-8 w-28 bg-brown-light/20 rounded-full animate-pulse" />
            <div className="w-9 h-9 bg-brown-light/20 rounded-full animate-pulse" />
          </div>
        </div>

        {/* ── Hero image skeleton ── */}
        <div className="relative h-[320px] rounded-2xl bg-brown-light/20 animate-pulse mb-3" />

        {/* ── Quote skeleton ── */}
        <div className="space-y-1.5 mb-8">
          <div className="h-4 bg-brown-light/15 rounded-full w-2/3 animate-pulse" />
          <div className="h-4 bg-brown-light/15 rounded-full w-1/3 animate-pulse" />
        </div>

        {/* ── Two-column layout ── */}
        <div className="flex flex-col md:flex-row gap-8 lg:gap-12">
          {/* ── Left: Sidebar skeleton ── */}
          <aside className="w-full md:w-[340px] md:shrink-0">
            <div className="bg-surface rounded-2xl p-5 space-y-6 border border-brown-light/10">
              {/* Quick stats pills */}
              <div className="flex flex-wrap gap-2">
                <div className="h-8 w-24 bg-parchment rounded-full animate-pulse" />
                <div className="h-8 w-24 bg-parchment rounded-full animate-pulse" />
                <div className="h-8 w-20 bg-parchment rounded-full animate-pulse" />
              </div>

              {/* Nutrition 2x2 grid */}
              <div>
                <div className="h-4 w-20 bg-brown-light/20 rounded-full mb-2 animate-pulse" />
                <div className="grid grid-cols-2 gap-3">
                  {[0, 1, 2, 3].map(i => (
                    <div key={i} className="bg-parchment rounded-lg px-3 py-2 text-center space-y-1">
                      <div className="h-3 w-12 bg-brown-light/15 rounded-full mx-auto animate-pulse" />
                      <div className="h-6 w-14 bg-brown-light/20 rounded-full mx-auto animate-pulse" />
                    </div>
                  ))}
                </div>
              </div>

              {/* Tags */}
              <div className="flex flex-wrap gap-2">
                <div className="h-6 w-16 bg-parchment rounded-full animate-pulse" />
                <div className="h-6 w-20 bg-parchment rounded-full animate-pulse" />
                <div className="h-6 w-14 bg-parchment rounded-full animate-pulse" />
              </div>

              {/* Flavor Profile */}
              <div>
                <div className="h-4 w-28 bg-brown-light/20 rounded-full mb-2 animate-pulse" />
                <div className="h-32 bg-parchment rounded-lg animate-pulse" />
              </div>

              {/* I Cooked This */}
              <div className="pt-2 border-t border-brown-light/10">
                <div className="h-10 w-full bg-brown-light/15 rounded-xl animate-pulse" />
              </div>
            </div>
          </aside>

          {/* ── Right: Main content skeleton ── */}
          <main className="flex-1 min-w-0 space-y-10">
            {/* Ingredients */}
            <section>
              <div className="flex items-center justify-between mb-3">
                <div className="h-6 w-28 bg-brown-light/20 rounded-full animate-pulse" />
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 bg-brown-light/15 rounded-full animate-pulse" />
                  <div className="w-6 h-5 bg-brown-light/20 rounded animate-pulse" />
                  <div className="w-8 h-8 bg-brown-light/15 rounded-full animate-pulse" />
                </div>
              </div>
              <div className="bg-surface rounded-xl p-4 border border-brown-light/10 space-y-0">
                {[0, 1, 2, 3, 4, 5].map(i => (
                  <div key={i} className="flex justify-between py-2 border-b border-brown-light/10 last:border-0">
                    <div className="h-4 w-28 bg-brown-light/10 rounded-full animate-pulse" />
                    <div className="h-4 w-16 bg-brown-light/10 rounded-full animate-pulse" />
                  </div>
                ))}
              </div>
            </section>

            {/* Instructions */}
            <section>
              <div className="h-6 w-28 bg-brown-light/20 rounded-full mb-6 animate-pulse" />
              <div className="space-y-5">
                {[0, 1, 2, 3].map(i => (
                  <div key={i} className="flex gap-4">
                    <div className="shrink-0 w-8 h-8 rounded-full bg-brown-light/20 animate-pulse" />
                    <div className="flex-1 space-y-2 pt-1">
                      <div className="h-4 bg-brown-light/10 rounded-full w-full animate-pulse" />
                      <div className="h-4 bg-brown-light/10 rounded-full w-3/4 animate-pulse" />
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* Tips */}
            <section className="bg-surface rounded-2xl p-5">
              <div className="h-5 w-16 bg-brown-light/20 rounded-full mb-4 animate-pulse" />
              <div className="space-y-0">
                {[0, 1].map(i => (
                  <div key={i} className="py-3 border-b border-brown-light/15 last:border-0">
                    <div className="h-4 bg-brown-light/10 rounded-full w-full animate-pulse mb-1.5" />
                    <div className="h-4 bg-brown-light/10 rounded-full w-2/3 animate-pulse" />
                  </div>
                ))}
              </div>
            </section>
          </main>
        </div>
      </div>
    </div>
  );
}
