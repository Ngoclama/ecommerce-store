import Container from "@/components/ui/container";

export default function Loading() {
  return (
    <div className="bg-white dark:bg-gray-900 min-h-screen">
      <Container>
        <div className="px-4 py-12 sm:px-6 lg:px-8">
          {/* Header Skeleton */}
          <div className="mb-12">
            <div className="h-10 md:h-12 w-64 bg-gray-200 dark:bg-gray-800 animate-pulse rounded mb-4" />
            <div className="h-4 w-96 bg-gray-200 dark:bg-gray-800 animate-pulse rounded" />
          </div>

          {/* Products Grid Skeleton */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="space-y-3">
                <div className="aspect-square bg-gray-200 dark:bg-gray-800 animate-pulse rounded" />
                <div className="h-4 bg-gray-200 dark:bg-gray-800 animate-pulse rounded w-3/4" />
                <div className="h-4 bg-gray-200 dark:bg-gray-800 animate-pulse rounded w-1/2" />
              </div>
            ))}
          </div>
        </div>
      </Container>
    </div>
  );
}

