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
          </div>

          {/* Categories Grid Skeleton */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {[...Array(6)].map((_, i) => (
              <div
                key={i}
                className="relative aspect-[4/3] bg-gray-200 dark:bg-gray-800 animate-pulse rounded overflow-hidden"
              >
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="h-8 w-32 bg-gray-300 dark:bg-gray-700 animate-pulse rounded" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </Container>
    </div>
  );
}

