import Container from "@/components/ui/container";

export default function Loading() {
  return (
    <div className="bg-white dark:bg-gray-900 min-h-screen">
      <Container>
        <div className="px-4 sm:px-6 lg:px-8 py-16">
          {/* Header Skeleton */}
          <div className="text-center mb-16">
            <div className="h-10 md:h-12 w-32 bg-gray-200 dark:bg-gray-800 animate-pulse rounded mx-auto mb-4" />
            <div className="w-20 md:w-24 h-px bg-gray-200 dark:bg-gray-800 animate-pulse mx-auto mb-6" />
            <div className="h-4 w-full max-w-2xl bg-gray-200 dark:bg-gray-800 animate-pulse rounded mx-auto" />
          </div>

          {/* Blog Grid Skeleton */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[...Array(6)].map((_, i) => (
              <div
                key={i}
                className="flex flex-col bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 overflow-hidden"
              >
                <div className="relative aspect-video bg-gray-200 dark:bg-gray-800 animate-pulse" />
                <div className="p-6 flex flex-col flex-1 space-y-3">
                  <div className="h-3 w-20 bg-gray-200 dark:bg-gray-800 animate-pulse rounded" />
                  <div className="h-6 w-full bg-gray-200 dark:bg-gray-800 animate-pulse rounded" />
                  <div className="h-4 w-full bg-gray-200 dark:bg-gray-800 animate-pulse rounded" />
                  <div className="h-4 w-3/4 bg-gray-200 dark:bg-gray-800 animate-pulse rounded" />
                  <div className="h-3 w-24 bg-gray-200 dark:bg-gray-800 animate-pulse rounded mt-auto" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </Container>
    </div>
  );
}

