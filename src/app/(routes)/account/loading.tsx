import Container from "@/components/ui/container";

export default function Loading() {
  return (
    <div className="bg-white dark:bg-gray-900 min-h-screen py-12">
      <Container>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header Skeleton */}
          <div className="mb-12">
            <div className="h-10 w-64 bg-gray-200 dark:bg-gray-800 animate-pulse rounded mb-2" />
            <div className="h-4 w-96 bg-gray-200 dark:bg-gray-800 animate-pulse rounded" />
          </div>

          {/* Menu Grid Skeleton */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[...Array(6)].map((_, i) => (
              <div
                key={i}
                className="bg-white dark:bg-gray-900 rounded-none p-6 border border-gray-300 dark:border-gray-700"
              >
                <div className="flex items-start gap-4">
                  <div className="p-3 border border-gray-300 dark:border-gray-700">
                    <div className="w-6 h-6 bg-gray-200 dark:bg-gray-800 animate-pulse rounded" />
                  </div>
                  <div className="flex-1 space-y-2">
                    <div className="h-5 w-3/4 bg-gray-200 dark:bg-gray-800 animate-pulse rounded" />
                    <div className="h-4 w-full bg-gray-200 dark:bg-gray-800 animate-pulse rounded" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </Container>
    </div>
  );
}

