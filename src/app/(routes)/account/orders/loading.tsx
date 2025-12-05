import Container from "@/components/ui/container";
import { Skeleton, SkeletonOrderList } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <div className="bg-gradient-to-br from-neutral-50 via-white to-neutral-50 dark:from-neutral-950 dark:via-gray-900 dark:to-neutral-950 min-h-screen py-12 md:py-16 lg:py-20">
      <Container>
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header Skeleton */}
          <div className="mb-12 md:mb-16">
            <div className="inline-flex items-center gap-3 px-5 py-3 bg-gradient-to-br from-neutral-900 to-neutral-800 dark:from-neutral-100 dark:to-neutral-200 border-2 border-neutral-900 dark:border-neutral-100 rounded-sm mb-6">
              <Skeleton className="w-5 h-5" />
              <Skeleton className="h-4 w-24" />
            </div>
            <Skeleton className="h-12 md:h-16 w-64 mb-6" />
            <Skeleton className="h-px w-full mb-4" />
            <Skeleton className="h-5 w-80" />
          </div>

          {/* Search and Filter Skeleton */}
          <div className="bg-white dark:bg-gray-900 rounded-sm p-4 md:p-6 mb-6 md:mb-8 border-2 border-neutral-200 dark:border-neutral-800 shadow-lg space-y-4">
            <Skeleton className="h-12 w-full" />
            <div className="flex flex-wrap items-center gap-2">
              <Skeleton className="h-8 w-16" />
              <Skeleton className="h-8 w-24" />
              <Skeleton className="h-8 w-24" />
              <Skeleton className="h-8 w-24" />
              <Skeleton className="h-8 w-24" />
            </div>
          </div>

          {/* Orders List Skeleton */}
          <SkeletonOrderList count={3} />
        </div>
      </Container>
    </div>
  );
}
