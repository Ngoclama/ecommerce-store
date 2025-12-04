import Container from "@/components/ui/container";

export default function Loading() {
  return (
    <div className="bg-white dark:bg-gray-900 min-h-screen py-12">
      <Container>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header Skeleton */}
          <div className="mb-12">
            <div className="h-10 w-48 bg-gray-200 dark:bg-gray-800 animate-pulse rounded mb-2" />
            <div className="h-4 w-64 bg-gray-200 dark:bg-gray-800 animate-pulse rounded" />
          </div>

          {/* Orders List Skeleton */}
          <div className="space-y-6">
            {[...Array(3)].map((_, i) => (
              <div
                key={i}
                className="border border-gray-300 dark:border-gray-700 rounded-none p-6 space-y-4"
              >
                {/* Order Header */}
                <div className="flex justify-between items-center">
                  <div className="h-5 w-32 bg-gray-200 dark:bg-gray-800 animate-pulse rounded" />
                  <div className="h-5 w-24 bg-gray-200 dark:bg-gray-800 animate-pulse rounded" />
                </div>

                {/* Order Items */}
                <div className="space-y-3">
                  {[...Array(2)].map((_, j) => (
                    <div key={j} className="flex gap-4">
                      <div className="w-20 h-20 bg-gray-200 dark:bg-gray-800 animate-pulse rounded" />
                      <div className="flex-1 space-y-2">
                        <div className="h-4 w-3/4 bg-gray-200 dark:bg-gray-800 animate-pulse rounded" />
                        <div className="h-4 w-1/2 bg-gray-200 dark:bg-gray-800 animate-pulse rounded" />
                        <div className="h-4 w-24 bg-gray-200 dark:bg-gray-800 animate-pulse rounded" />
                      </div>
                    </div>
                  ))}
                </div>

                {/* Order Footer */}
                <div className="flex justify-between items-center pt-4 border-t border-gray-200 dark:border-gray-700">
                  <div className="h-4 w-32 bg-gray-200 dark:bg-gray-800 animate-pulse rounded" />
                  <div className="h-6 w-24 bg-gray-200 dark:bg-gray-800 animate-pulse rounded" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </Container>
    </div>
  );
}

