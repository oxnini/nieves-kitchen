export default function RecipeLoading() {
  return (
    <div className="min-h-screen bg-parchment">
      <div className="max-w-2xl mx-auto px-4 py-6">
        <div className="flex items-center justify-between mb-6">
          <div className="h-5 w-24 bg-brown-light/20 rounded-full animate-pulse" />
          <div className="w-9 h-9 bg-brown-light/20 rounded-full animate-pulse" />
        </div>

        <div className="bg-parchment rounded-3xl overflow-hidden">
          {/* Hero image skeleton */}
          <div className="h-56 sm:h-72 rounded-2xl bg-brown-light/20 animate-pulse mb-6" />

          <div className="space-y-6">
            {/* Quote skeleton */}
            <div className="px-8 py-2 space-y-2">
              <div className="h-4 bg-brown-light/15 rounded-full w-3/4 mx-auto animate-pulse" />
              <div className="h-4 bg-brown-light/15 rounded-full w-1/2 mx-auto animate-pulse" />
            </div>

            {/* Meta pills skeleton */}
            <div className="flex gap-3">
              <div className="h-8 w-24 bg-brown-light/15 rounded-full animate-pulse" />
              <div className="h-8 w-24 bg-brown-light/15 rounded-full animate-pulse" />
              <div className="h-8 w-20 bg-brown-light/15 rounded-full animate-pulse" />
            </div>

            {/* Tags skeleton */}
            <div className="flex gap-2">
              <div className="h-6 w-16 bg-brown-light/10 rounded-full animate-pulse" />
              <div className="h-6 w-20 bg-brown-light/10 rounded-full animate-pulse" />
              <div className="h-6 w-14 bg-brown-light/10 rounded-full animate-pulse" />
            </div>

            {/* Nutrition skeleton */}
            <div className="grid grid-cols-4 border-y border-brown-light/25 py-4">
              {[0, 1, 2, 3].map(i => (
                <div key={i} className={`text-center ${i > 0 ? 'border-l border-brown-light/20' : ''}`}>
                  <div className="h-3 w-10 bg-brown-light/15 rounded-full mx-auto mb-2 animate-pulse" />
                  <div className="h-6 w-12 bg-brown-light/20 rounded-full mx-auto animate-pulse" />
                </div>
              ))}
            </div>

            {/* Ingredients skeleton */}
            <div>
              <div className="h-5 w-28 bg-brown-light/20 rounded-full mb-3 animate-pulse" />
              <div className="bg-white rounded-xl p-4 shadow-sm space-y-3">
                {[0, 1, 2, 3, 4].map(i => (
                  <div key={i} className="flex justify-between py-1">
                    <div className="h-4 w-28 bg-brown-light/10 rounded-full animate-pulse" />
                    <div className="h-4 w-16 bg-brown-light/10 rounded-full animate-pulse" />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
