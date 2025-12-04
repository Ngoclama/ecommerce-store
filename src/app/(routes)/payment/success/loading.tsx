export default function PaymentSuccessLoading() {
  return (
    <div className="bg-gradient-to-br from-neutral-50 via-white to-neutral-50 dark:from-neutral-950 dark:via-gray-900 dark:to-neutral-950 min-h-screen py-12 md:py-16 lg:py-20">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-center mb-8">
          <div className="w-32 h-32 md:w-40 md:h-40 rounded-full bg-neutral-200 dark:bg-neutral-800 animate-pulse" />
        </div>
        <div className="text-center mb-12">
          <div className="h-8 md:h-10 lg:h-12 w-64 md:w-80 lg:w-96 bg-neutral-200 dark:bg-neutral-800 rounded-sm mx-auto mb-6 animate-pulse" />
          <div className="h-px w-full max-w-2xl mx-auto mb-6 bg-neutral-200 dark:bg-neutral-800" />
          <div className="h-6 md:h-8 w-full max-w-2xl mx-auto bg-neutral-200 dark:bg-neutral-800 rounded-sm animate-pulse" />
        </div>
        <div className="bg-white dark:bg-gray-900 rounded-sm p-6 md:p-8 lg:p-10 border-2 border-neutral-200 dark:border-neutral-800 mb-8">
          <div className="h-8 w-48 bg-neutral-200 dark:bg-neutral-800 rounded-sm mb-6 animate-pulse" />
          <div className="space-y-4">
            <div className="h-16 bg-neutral-100 dark:bg-neutral-900 rounded-sm animate-pulse" />
            <div className="h-16 bg-neutral-100 dark:bg-neutral-900 rounded-sm animate-pulse" />
          </div>
        </div>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <div className="h-12 w-full sm:w-48 bg-neutral-200 dark:bg-neutral-800 rounded-sm animate-pulse" />
          <div className="h-12 w-full sm:w-48 bg-neutral-200 dark:bg-neutral-800 rounded-sm animate-pulse" />
        </div>
      </div>
    </div>
  );
}

