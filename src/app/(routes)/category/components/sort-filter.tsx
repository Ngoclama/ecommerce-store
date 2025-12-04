"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { motion } from "framer-motion";
import {
  ArrowUpDown,
  Sparkles,
  TrendingUp,
  TrendingDown,
  SortAsc,
  SortDesc,
} from "lucide-react";
import { useCallback, useTransition } from "react";
import qs from "query-string";
import { cn } from "@/lib/utils";

const SortFilter = () => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  const currentSort = searchParams.get("sort") || "newest";

  // Optimized sort update without page reload
  const updateSort = useCallback(
    (value: string) => {
      const current = qs.parse(searchParams.toString());

      const query: Record<string, string | undefined> = {
        ...current,
        sort: value === "newest" ? undefined : value,
      };

      // Remove sort if it's "newest" (default)
      if (value === "newest") {
        delete query.sort;
      }

      const url = qs.stringifyUrl(
        {
          url: pathname,
          query,
        },
        { skipNull: true, skipEmptyString: true }
      );

      startTransition(() => {
        router.replace(url, { scroll: false });
      });
    },
    [searchParams, pathname, router]
  );

  const onSortChange = useCallback(
    (value: string) => {
      updateSort(value);
    },
    [updateSort]
  );

  const sortOptions = [
    { value: "newest", label: "Mới nhất", icon: Sparkles },
    { value: "oldest", label: "Cũ nhất", icon: ArrowUpDown },
    { value: "price-asc", label: "Giá: Thấp → Cao", icon: TrendingUp },
    { value: "price-desc", label: "Giá: Cao → Thấp", icon: TrendingDown },
    { value: "name-asc", label: "Tên: A → Z", icon: SortAsc },
    { value: "name-desc", label: "Tên: Z → A", icon: SortDesc },
  ];

  const currentOption = sortOptions.find((opt) => opt.value === currentSort);

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="mb-8 pb-8 border-b border-gray-200 dark:border-gray-700 last:border-0"
    >
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-sm">
          <ArrowUpDown className="w-4 h-4 text-black dark:text-white" />
        </div>
        <h3 className="text-sm font-light text-black dark:text-white uppercase tracking-wider">
          Sắp xếp theo
        </h3>
        {isPending && (
          <motion.span
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-xs text-gray-500 dark:text-gray-400 font-light"
          >
            Đang cập nhật...
          </motion.span>
        )}
      </div>

      <Select
        value={currentSort}
        onValueChange={onSortChange}
        disabled={isPending}
      >
        <SelectTrigger className="w-full rounded-sm border-2 border-gray-300 dark:border-gray-600 focus:border-black dark:focus:border-white bg-white dark:bg-gray-900 hover:bg-gray-50 dark:hover:bg-gray-800 transition-all duration-200 h-11 font-light text-sm uppercase tracking-wide focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black dark:focus:ring-white">
          <div className="flex items-center gap-2">
            {currentOption && (
              <currentOption.icon className="w-4 h-4 text-black dark:text-white" />
            )}
            <SelectValue placeholder="Chọn cách sắp xếp" />
          </div>
        </SelectTrigger>
        <SelectContent className="rounded-sm border-2 border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900">
          {sortOptions.map((option) => {
            const Icon = option.icon;
            const isSelected = option.value === currentSort;
            return (
              <SelectItem
                key={option.value}
                value={option.value}
                className={cn(
                  "font-light text-sm uppercase tracking-wide cursor-pointer rounded-sm transition-colors",
                  "hover:bg-gray-50 dark:hover:bg-gray-800 focus:bg-gray-50 dark:focus:bg-gray-800",
                  isSelected && "bg-gray-100 dark:bg-gray-800"
                )}
              >
                <div className="flex items-center gap-2">
                  <Icon className="w-4 h-4 text-black dark:text-white" />
                  <span className="text-black dark:text-white">
                    {option.label}
                  </span>
                </div>
              </SelectItem>
            );
          })}
        </SelectContent>
      </Select>
    </motion.div>
  );
};

export default SortFilter;
