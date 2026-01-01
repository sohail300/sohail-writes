export default function BlogsLoading() {
  return (
    <main className="neo-container min-h-screen py-12">
      <div className="max-w-7xl mx-auto">
        {/* Header Skeleton */}
        <div className="mb-12 text-center">
          <div className="h-16 md:h-24 bg-neo-gray border-4 border-neo-black mb-4 mx-auto w-96 max-w-full" />
          <div className="h-8 bg-neo-gray border-4 border-neo-black mx-auto w-80 max-w-full" />
        </div>

        {/* Filters Skeleton */}
        <div className="mb-12">
          <div className="neo-card bg-neo-white">
            <div className="h-10 bg-neo-gray border-4 border-neo-black mb-6 w-48" />
            <div className="space-y-6">
              {/* Search skeleton */}
              <div className="h-12 bg-neo-gray border-4 border-neo-black w-full" />
              {/* Platform filters skeleton */}
              <div className="flex gap-3 flex-wrap">
                {[1, 2, 3, 4].map((i) => (
                  <div
                    key={i}
                    className="h-10 w-24 bg-neo-gray border-4 border-neo-black"
                  />
                ))}
              </div>
              {/* Tag filters skeleton */}
              <div className="flex gap-2 flex-wrap">
                {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
                  <div
                    key={i}
                    className="h-8 w-20 bg-neo-gray border-4 border-neo-black"
                  />
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Results count skeleton */}
        <div className="mb-8">
          <div className="h-6 bg-neo-gray border-4 border-neo-black w-48" />
        </div>

        {/* Blog Cards Skeleton */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="neo-card bg-neo-white animate-pulse">
              {/* Image skeleton */}
              <div className="w-full h-48 bg-neo-gray border-4 border-neo-black mb-4" />
              {/* Content skeleton */}
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <div className="h-8 w-24 bg-neo-gray border-4 border-neo-black" />
                  <div className="h-6 w-32 bg-neo-gray border-2 border-neo-black" />
                </div>
                <div className="h-8 bg-neo-gray border-2 border-neo-black w-full" />
                <div className="h-6 bg-neo-gray border-2 border-neo-black w-3/4" />
                <div className="flex gap-2">
                  {[1, 2, 3].map((j) => (
                    <div
                      key={j}
                      className="h-6 w-16 bg-neo-gray border-2 border-neo-black"
                    />
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
