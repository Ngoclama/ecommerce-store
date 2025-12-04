import Container from "@/components/ui/container";

export default function Loading() {
  return (
    <div className="bg-white min-h-screen py-12 md:py-16">
      <Container>
        <div className="px-4 sm:px-6 lg:px-8">
          {/* Header Skeleton */}
          <div className="h-10 w-32 bg-gray-200 dark:bg-gray-800 animate-pulse rounded mb-8 md:mb-12" />

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Cart Items Skeleton */}
            <div className="lg:col-span-2 space-y-4">
              {[...Array(3)].map((_, i) => (
                <div
                  key={i}
                  className="flex gap-4 p-4 border border-gray-200 dark:border-gray-700 rounded"
                >
                  <div className="w-24 h-24 bg-gray-200 dark:bg-gray-800 animate-pulse rounded" />
                  <div className="flex-1 space-y-3">
                    <div className="h-5 w-3/4 bg-gray-200 dark:bg-gray-800 animate-pulse rounded" />
                    <div className="h-4 w-1/2 bg-gray-200 dark:bg-gray-800 animate-pulse rounded" />
                    <div className="h-8 w-24 bg-gray-200 dark:bg-gray-800 animate-pulse rounded" />
                    <div className="h-5 w-20 bg-gray-200 dark:bg-gray-800 animate-pulse rounded" />
                  </div>
                </div>
              ))}
            </div>

            {/* Summary Skeleton */}
            <div className="lg:col-span-1">
              <div className="bg-white dark:bg-gray-900 p-6 border border-gray-300 dark:border-gray-700 sticky top-4 rounded">
                <div className="h-6 w-32 bg-gray-200 dark:bg-gray-800 animate-pulse rounded mb-6" />
                <div className="space-y-4">
                  <div className="h-4 w-full bg-gray-200 dark:bg-gray-800 animate-pulse rounded" />
                  <div className="h-4 w-3/4 bg-gray-200 dark:bg-gray-800 animate-pulse rounded" />
                  <div className="h-px bg-gray-200 dark:bg-gray-800 my-4" />
                  <div className="h-6 w-full bg-gray-200 dark:bg-gray-800 animate-pulse rounded" />
                </div>
                <div className="h-12 w-full bg-gray-200 dark:bg-gray-800 animate-pulse rounded mt-6" />
              </div>
            </div>
          </div>
        </div>
      </Container>
    </div>
  );
}

