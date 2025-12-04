import Container from "@/components/ui/container";

export default function Loading() {
  return (
    <div className="bg-white dark:bg-gray-900 min-h-screen">
      <Container>
        <div className="px-4 sm:px-6 lg:px-8 py-16">
          {/* Back Button Skeleton */}
          <div className="h-6 w-32 bg-gray-200 dark:bg-gray-800 animate-pulse rounded mb-8" />

          {/* Article Skeleton */}
          <article className="max-w-4xl mx-auto">
            {/* Header Skeleton */}
            <header className="mb-8">
              <div className="h-4 w-24 bg-gray-200 dark:bg-gray-800 animate-pulse rounded mb-4" />
              <div className="h-10 md:h-12 w-full bg-gray-200 dark:bg-gray-800 animate-pulse rounded mb-6" />
              <div className="flex gap-6">
                <div className="h-4 w-32 bg-gray-200 dark:bg-gray-800 animate-pulse rounded" />
                <div className="h-4 w-24 bg-gray-200 dark:bg-gray-800 animate-pulse rounded" />
              </div>
            </header>

            {/* Featured Image Skeleton */}
            <div className="relative aspect-video mb-12 bg-gray-200 dark:bg-gray-800 animate-pulse rounded" />

            {/* Content Skeleton */}
            <div className="space-y-4 mb-12">
              {[...Array(8)].map((_, i) => (
                <div key={i} className="space-y-2">
                  <div className="h-4 w-full bg-gray-200 dark:bg-gray-800 animate-pulse rounded" />
                  <div className="h-4 w-5/6 bg-gray-200 dark:bg-gray-800 animate-pulse rounded" />
                </div>
              ))}
            </div>

            {/* Footer Skeleton */}
            <footer className="border-t border-gray-200 dark:border-gray-800 pt-8 mt-12">
              <div className="h-6 w-40 bg-gray-200 dark:bg-gray-800 animate-pulse rounded" />
            </footer>
          </article>

          {/* Related Blogs Skeleton */}
          <section className="mt-20">
            <div className="h-8 w-48 bg-gray-200 dark:bg-gray-800 animate-pulse rounded mb-8" />
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[...Array(3)].map((_, i) => (
                <div
                  key={i}
                  className="flex flex-col bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 overflow-hidden"
                >
                  <div className="relative aspect-video bg-gray-200 dark:bg-gray-800 animate-pulse" />
                  <div className="p-6 flex flex-col flex-1 space-y-3">
                    <div className="h-3 w-20 bg-gray-200 dark:bg-gray-800 animate-pulse rounded" />
                    <div className="h-5 w-full bg-gray-200 dark:bg-gray-800 animate-pulse rounded" />
                    <div className="h-4 w-3/4 bg-gray-200 dark:bg-gray-800 animate-pulse rounded" />
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>
      </Container>
    </div>
  );
}

