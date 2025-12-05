import Container from "@/components/ui/container";
import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <div className="bg-gradient-to-br from-neutral-50 via-white to-neutral-50 dark:from-neutral-950 dark:via-gray-900 dark:to-neutral-950 min-h-screen py-12 md:py-16 lg:py-20">
      <Container>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Back Button Skeleton */}
          <div className="mb-8">
            <Skeleton className="h-10 w-48" />
          </div>

          {/* Order Header Skeleton */}
          <div className="bg-white dark:bg-gray-900 rounded-sm border-2 border-neutral-200 dark:border-neutral-800 shadow-xl p-6 md:p-8 mb-6">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
              <div className="space-y-2">
                <Skeleton className="h-8 w-64" />
                <Skeleton className="h-4 w-48" />
              </div>
              <div className="text-right space-y-2">
                <Skeleton className="h-8 w-32 ml-auto" />
                <Skeleton className="h-6 w-24 ml-auto" />
                <Skeleton className="h-4 w-20 ml-auto" />
              </div>
            </div>
          </div>

          {/* Order Items Skeleton */}
          <div className="bg-white dark:bg-gray-900 rounded-sm border-2 border-neutral-200 dark:border-neutral-800 shadow-xl p-6 md:p-8 mb-6">
            <Skeleton className="h-6 w-48 mb-6" />
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="flex gap-4 pb-4 border-b border-neutral-100 dark:border-neutral-800 last:border-0 last:pb-0"
                >
                  <Skeleton className="w-24 h-24 md:w-32 md:h-32 shrink-0" />
                  <div className="flex-1 space-y-2">
                    <Skeleton className="h-5 w-3/4" />
                    <div className="flex gap-2">
                      <Skeleton className="h-3 w-16" />
                      <Skeleton className="h-3 w-16" />
                    </div>
                    <div className="flex items-center justify-between">
                      <Skeleton className="h-4 w-20" />
                      <Skeleton className="h-5 w-24" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Information Grid Skeleton */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            {[1, 2].map((i) => (
              <div
                key={i}
                className="bg-white dark:bg-gray-900 rounded-sm border-2 border-neutral-200 dark:border-neutral-800 shadow-xl p-6 md:p-8"
              >
                <Skeleton className="h-6 w-48 mb-4" />
                <div className="space-y-3">
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-3/4" />
                  <Skeleton className="h-4 w-2/3" />
                </div>
              </div>
            ))}
          </div>

          {/* Order Summary Skeleton */}
          <div className="bg-white dark:bg-gray-900 rounded-sm border-2 border-neutral-200 dark:border-neutral-800 shadow-xl p-6 md:p-8">
            <Skeleton className="h-6 w-48 mb-6" />
            <div className="space-y-3">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-full" />
              <div className="pt-3 border-t border-neutral-200 dark:border-neutral-800">
                <Skeleton className="h-8 w-32 ml-auto" />
              </div>
            </div>
          </div>
        </div>
      </Container>
    </div>
  );
}
