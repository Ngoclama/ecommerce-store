import Container from "@/components/ui/container";

export default function Loading() {
  return (
    <div className="bg-white dark:bg-gray-900 min-h-screen">
      <Container>
        <div className="px-4 py-10 sm:px-6 lg:px-8">
          <div className="lg:grid lg:grid-cols-2 lg:items-start lg:gap-x-8">
            {/* Gallery Skeleton */}
            <div className="space-y-4">
              <div className="aspect-square bg-gray-200 dark:bg-gray-800 animate-pulse rounded" />
              <div className="grid grid-cols-4 gap-4">
                {[...Array(4)].map((_, i) => (
                  <div
                    key={i}
                    className="aspect-square bg-gray-200 dark:bg-gray-800 animate-pulse rounded"
                  />
                ))}
              </div>
            </div>

            {/* Info Skeleton */}
            <div className="px-4 mt-0 sm:mt-16 sm:px-0 lg:mt-0 space-y-6">
              <div className="h-8 w-3/4 bg-gray-200 dark:bg-gray-800 animate-pulse rounded" />
              <div className="h-6 w-1/2 bg-gray-200 dark:bg-gray-800 animate-pulse rounded" />
              <div className="h-4 w-full bg-gray-200 dark:bg-gray-800 animate-pulse rounded" />
              <div className="h-4 w-5/6 bg-gray-200 dark:bg-gray-800 animate-pulse rounded" />
              <div className="h-12 w-full bg-gray-200 dark:bg-gray-800 animate-pulse rounded" />
              <div className="h-12 w-full bg-gray-200 dark:bg-gray-800 animate-pulse rounded" />
            </div>
          </div>

          {/* Reviews Skeleton */}
          <div className="mt-12 px-4 sm:px-6 lg:px-8">
            <div className="h-8 w-48 bg-gray-200 dark:bg-gray-800 animate-pulse rounded mb-6" />
            <div className="space-y-4">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="p-4 border border-gray-200 dark:border-gray-700 rounded">
                  <div className="flex items-center gap-4 mb-3">
                    <div className="w-10 h-10 bg-gray-200 dark:bg-gray-800 animate-pulse rounded-full" />
                    <div className="h-4 w-32 bg-gray-200 dark:bg-gray-800 animate-pulse rounded" />
                  </div>
                  <div className="h-4 w-full bg-gray-200 dark:bg-gray-800 animate-pulse rounded mb-2" />
                  <div className="h-4 w-3/4 bg-gray-200 dark:bg-gray-800 animate-pulse rounded" />
                </div>
              ))}
            </div>
          </div>

          {/* Related Products Skeleton */}
          <div className="mt-16 px-4 sm:px-6 lg:px-8">
            <div className="h-8 w-48 bg-gray-200 dark:bg-gray-800 animate-pulse rounded mb-10" />
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="space-y-3">
                  <div className="aspect-square bg-gray-200 dark:bg-gray-800 animate-pulse rounded" />
                  <div className="h-4 bg-gray-200 dark:bg-gray-800 animate-pulse rounded w-3/4" />
                  <div className="h-4 bg-gray-200 dark:bg-gray-800 animate-pulse rounded w-1/2" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </Container>
    </div>
  );
}

