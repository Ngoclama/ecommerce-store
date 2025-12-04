import Container from "@/components/ui/container";

export default function Loading() {
  return (
    <div className="bg-white dark:bg-gray-900 min-h-screen">
      <Container>
        <div className="px-4 py-16 sm:px-6 lg:px-8">
          {/* Header Skeleton */}
          <div className="mb-12 md:mb-16">
            <div className="h-12 md:h-14 lg:h-16 w-64 md:w-96 bg-gray-200 dark:bg-gray-800 animate-pulse rounded mb-3" />
            <div className="w-20 md:w-24 h-px bg-gray-200 dark:bg-gray-800 animate-pulse mb-6" />
            <div className="h-4 w-full max-w-2xl bg-gray-200 dark:bg-gray-800 animate-pulse rounded" />
            <div className="h-4 w-3/4 max-w-xl bg-gray-200 dark:bg-gray-800 animate-pulse rounded mt-2" />
          </div>

          {/* Categories Grid Skeleton */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="space-y-3">
                <div className="aspect-square bg-gray-200 dark:bg-gray-800 animate-pulse rounded" />
                <div className="h-4 bg-gray-200 dark:bg-gray-800 animate-pulse rounded w-3/4" />
              </div>
            ))}
          </div>
        </div>
      </Container>
    </div>
  );
}
