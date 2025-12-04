import Container from "@/components/ui/container";

export default function Loading() {
  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      <Container>
        {/* Hero Skeleton */}
        <div className="relative h-[500px] bg-gray-200 dark:bg-gray-800 animate-pulse rounded-lg mb-12" />

        {/* Featured Products Skeleton */}
        <div className="mb-16">
          <div className="h-8 w-48 bg-gray-200 dark:bg-gray-800 animate-pulse rounded mb-8" />
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="space-y-3">
                <div className="aspect-square bg-gray-200 dark:bg-gray-800 animate-pulse rounded" />
                <div className="h-4 bg-gray-200 dark:bg-gray-800 animate-pulse rounded w-3/4" />
                <div className="h-4 bg-gray-200 dark:bg-gray-800 animate-pulse rounded w-1/2" />
              </div>
            ))}
          </div>
        </div>

        {/* Categories Skeleton */}
        <div className="mb-16">
          <div className="h-8 w-48 bg-gray-200 dark:bg-gray-800 animate-pulse rounded mb-8" />
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[...Array(4)].map((_, i) => (
              <div
                key={i}
                className="h-40 bg-gray-200 dark:bg-gray-800 animate-pulse rounded"
              />
            ))}
          </div>
        </div>
      </Container>
    </div>
  );
}
