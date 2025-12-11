"use client";

import { Color, Size } from "@/types";
import { useSearchParams, usePathname, useRouter } from "next/navigation";
import qs from "query-string";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import { X, Check } from "lucide-react";
import { useCallback, useTransition } from "react";

interface FilterProps {
  data: (Size | Color)[];
  name: string;
  valueKey: string;
}

const Filter = ({ data, name, valueKey }: FilterProps) => {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const selectedValue = searchParams.get(valueKey);
  const isColorFilter = valueKey === "colorId";

  // Optimized filter update without page reload
  const updateFilter = useCallback(
    (id: string | null) => {
      const current = qs.parse(searchParams.toString());

      const query = {
        ...current,
        [valueKey]: id || undefined,
      };

      // Remove the key if value is null/undefined
      if (!id) {
        delete query[valueKey];
      }

      const url = qs.stringifyUrl(
        {
          url: pathname,
          query,
        },
        { skipNull: true, skipEmptyString: true }
      );

      // Use startTransition for smooth updates without blocking UI
      startTransition(() => {
        router.replace(url, { scroll: false });
      });
    },
    [searchParams, pathname, router, valueKey]
  );

  const handleFilterClick = useCallback(
    (id: string) => {
      if (selectedValue === id) {
        // Deselect if already selected
        updateFilter(null);
      } else {
        // Select new filter
        updateFilter(id);
      }
    },
    [selectedValue, updateFilter]
  );

  const handleClearFilter = useCallback(() => {
    updateFilter(null);
  }, [updateFilter]);

  // Count available options (for better UX)
  const availableCount = data.length;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="mb-8 pb-8 border-b border-gray-200 dark:border-gray-700 last:border-0"
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <h3 className="text-sm font-light text-black dark:text-white uppercase tracking-wider">
            {name}
          </h3>
          <span className="text-xs text-gray-500 dark:text-gray-400 font-light">
            ({availableCount})
          </span>
        </div>
        {selectedValue && (
          <motion.button
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            onClick={handleClearFilter}
            className="text-xs text-gray-500 dark:text-gray-400 hover:text-black dark:hover:text-white transition-all duration-200 font-light uppercase tracking-wide flex items-center gap-1.5 group"
            aria-label="Xóa bộ lọc"
            disabled={isPending}
          >
            <X className="w-3.5 h-3.5 transition-transform group-hover:rotate-90" />
            <span>Xóa</span>
          </motion.button>
        )}
      </div>

      {/* Filter Options */}
      <div className="flex flex-wrap gap-2.5">
        <AnimatePresence>
          {data.map((filter) => {
            const isSelected = selectedValue === filter.id;

            if (isColorFilter && "value" in filter) {
              // Color filter with enhanced preview
              return (
                <motion.button
                  key={filter.id}
                  onClick={() => handleFilterClick(filter.id)}
                  disabled={isPending}
                  className={cn(
                    "relative group flex items-center gap-2.5 px-4 py-2.5 border-2 transition-all duration-300 font-light text-xs uppercase tracking-wide rounded-sm",
                    "focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black dark:focus:ring-white",
                    isSelected
                      ? "bg-black dark:bg-white text-white dark:text-black border-black dark:border-white shadow-md"
                      : "bg-white dark:bg-gray-900 text-black dark:text-white border-gray-300 dark:border-gray-600 hover:border-gray-500 dark:hover:border-gray-400 hover:shadow-sm"
                  )}
                  whileHover={{ scale: isPending ? 1 : 1.03 }}
                  whileTap={{ scale: isPending ? 1 : 0.97 }}
                  aria-label={`Chọn màu ${filter.name}`}
                  aria-pressed={isSelected}
                >
                  {/* Color Preview */}
                  <div
                    className={cn(
                      "w-5 h-5 rounded-sm border-2 transition-all duration-200 shadow-sm",
                      isSelected
                        ? "border-white dark:border-black"
                        : "border-gray-300 dark:border-gray-600 group-hover:border-gray-500 dark:group-hover:border-gray-400"
                    )}
                    style={{ backgroundColor: filter.value }}
                  />

                  {/* Color Name */}
                  <span className="whitespace-nowrap">{filter.name}</span>

                  {/* Selected Indicator */}
                  {isSelected && (
                    <motion.div
                      initial={{ scale: 0, rotate: -180 }}
                      animate={{ scale: 1, rotate: 0 }}
                      exit={{ scale: 0, rotate: 180 }}
                      className="absolute -top-1.5 -right-1.5 w-4 h-4 bg-white dark:bg-black rounded-full border-2 border-black dark:border-white flex items-center justify-center shadow-md"
                    >
                      <Check className="w-2.5 h-2.5 text-black dark:text-white" />
                    </motion.div>
                  )}
                </motion.button>
              );
            }

            // Size or other filter with enhanced design
            return (
              <motion.button
                key={filter.id}
                onClick={() => handleFilterClick(filter.id)}
                disabled={isPending}
                className={cn(
                  "relative px-5 py-2.5 border-2 transition-all duration-300 font-light text-xs uppercase tracking-wide whitespace-nowrap rounded-sm",
                  "focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black dark:focus:ring-white",
                  isSelected
                    ? "bg-black dark:bg-white text-white dark:text-black border-black dark:border-white shadow-md"
                    : "bg-white dark:bg-gray-900 text-black dark:text-white border-gray-300 dark:border-gray-600 hover:border-gray-500 dark:hover:border-gray-400 hover:shadow-sm"
                )}
                whileHover={{ scale: isPending ? 1 : 1.03 }}
                whileTap={{ scale: isPending ? 1 : 0.97 }}
                aria-label={`Chọn ${filter.name}`}
                aria-pressed={isSelected}
              >
                <span className="relative z-10">{filter.name}</span>

                {/* Selected Indicator */}
                {isSelected && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    exit={{ scale: 0 }}
                    className="absolute inset-0 bg-black dark:bg-white rounded-sm"
                    style={{ zIndex: 0 }}
                  />
                )}
              </motion.button>
            );
          })}
        </AnimatePresence>
      </div>

      {/* Loading Indicator */}
      {isPending && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="mt-3 text-xs text-gray-500 dark:text-gray-400 font-light"
        >
          Đang cập nhật...
        </motion.div>
      )}
    </motion.div>
  );
};

export default Filter;
