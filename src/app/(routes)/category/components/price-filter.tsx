"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useState, useEffect, useCallback, useTransition } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { DollarSign, X, Check, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";
import qs from "query-string";

const PriceFilter = () => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  const minPrice = searchParams.get("minPrice") || "";
  const maxPrice = searchParams.get("maxPrice") || "";

  const [localMinPrice, setLocalMinPrice] = useState(minPrice);
  const [localMaxPrice, setLocalMaxPrice] = useState(maxPrice);
  const [isActive, setIsActive] = useState(!!(minPrice || maxPrice));

  useEffect(() => {
    // Use requestAnimationFrame to defer setState
    requestAnimationFrame(() => {
      setLocalMinPrice(minPrice);
      setLocalMaxPrice(maxPrice);
      setIsActive(!!(minPrice || maxPrice));
    });
  }, [minPrice, maxPrice]);

  // Optimized filter update without page reload
  const updatePriceFilter = useCallback(
    (min: string, max: string) => {
      const current = qs.parse(searchParams.toString());

      const query: Record<string, string | undefined> = {
        ...current,
        minPrice: min || undefined,
        maxPrice: max || undefined,
      };

      // Remove keys if empty
      if (!min) delete query.minPrice;
      if (!max) delete query.maxPrice;

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

  const handleApply = useCallback(() => {
    updatePriceFilter(localMinPrice, localMaxPrice);
  }, [localMinPrice, localMaxPrice, updatePriceFilter]);

  const handleClear = useCallback(() => {
    setLocalMinPrice("");
    setLocalMaxPrice("");
    updatePriceFilter("", "");
  }, [updatePriceFilter]);

  const formatPrice = (value: string) => {
    if (!value) return "";
    const num = parseFloat(value);
    if (isNaN(num)) return value;
    return new Intl.NumberFormat("vi-VN").format(num);
  };

  const handleMinPriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, "");
    setLocalMinPrice(value);
  };

  const handleMaxPriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, "");
    setLocalMaxPrice(value);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="mb-8 pb-8 border-b border-gray-200 dark:border-gray-700 last:border-0"
    >
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-sm">
            <DollarSign className="w-4 h-4 text-black dark:text-white" />
          </div>
          <h3 className="text-sm font-light text-black dark:text-white uppercase tracking-wider">
            Khoảng giá
          </h3>
        </div>
        {isActive && (
          <motion.button
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            onClick={handleClear}
            disabled={isPending}
            className="text-xs text-gray-500 dark:text-gray-400 hover:text-black dark:hover:text-white transition-all duration-200 font-light uppercase tracking-wide flex items-center gap-1.5 group"
            aria-label="Xóa bộ lọc giá"
          >
            <X className="w-3.5 h-3.5 transition-transform group-hover:rotate-90" />
            <span>Xóa</span>
          </motion.button>
        )}
      </div>

      <div className="space-y-4">
        <div className="flex gap-3 items-end">
          <div className="flex-1">
            <label className="block text-xs font-light text-gray-600 dark:text-gray-400 uppercase tracking-wide mb-2">
              Từ (VNĐ)
            </label>
            <Input
              type="text"
              placeholder="0"
              value={formatPrice(localMinPrice)}
              onChange={handleMinPriceChange}
              disabled={isPending}
              className={cn(
                "w-full rounded-sm border-2 transition-all duration-200 bg-white dark:bg-gray-900 font-light text-sm h-11",
                "focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black dark:focus:ring-white",
                isActive && localMinPrice
                  ? "border-black dark:border-white"
                  : "border-gray-300 dark:border-gray-600 focus:border-gray-500 dark:focus:border-gray-400"
              )}
            />
          </div>
          <div className="flex items-center pb-7 px-2">
            <span className="text-gray-400 dark:text-gray-500 text-lg">—</span>
          </div>
          <div className="flex-1">
            <label className="block text-xs font-light text-gray-600 dark:text-gray-400 uppercase tracking-wide mb-2">
              Đến (VNĐ)
            </label>
            <Input
              type="text"
              placeholder="Không giới hạn"
              value={formatPrice(localMaxPrice)}
              onChange={handleMaxPriceChange}
              disabled={isPending}
              className={cn(
                "w-full rounded-sm border-2 transition-all duration-200 bg-white dark:bg-gray-900 font-light text-sm h-11",
                "focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black dark:focus:ring-white",
                isActive && localMaxPrice
                  ? "border-black dark:border-white"
                  : "border-gray-300 dark:border-gray-600 focus:border-gray-500 dark:focus:border-gray-400"
              )}
            />
          </div>
        </div>

        <div className="flex gap-2">
          <motion.div
            className="flex-1"
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.99 }}
          >
            <Button
              onClick={handleApply}
              disabled={isPending}
              className={cn(
                "w-full rounded-sm bg-gray-400 text-white hover:bg-gray-900 font-light text-xs uppercase tracking-wide h-11 transition-all duration-300 flex items-center justify-center gap-2",
                "hover:shadow-lg hover:shadow-gray-400/30",
                isPending && "opacity-50 cursor-not-allowed"
              )}
            >
              {isPending ? (
                <>
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{
                      duration: 1,
                      repeat: Infinity,
                      ease: "linear",
                    }}
                  >
                    <Sparkles className="w-4 h-4" />
                  </motion.div>
                  <span>Đang cập nhật...</span>
                </>
              ) : (
                <>
                  <Check className="w-4 h-4" />
                  <span>Áp dụng</span>
                </>
              )}
            </Button>
          </motion.div>
          <AnimatePresence>
            {isActive && (
              <motion.div
                initial={{ opacity: 0, width: 0 }}
                animate={{ opacity: 1, width: "auto" }}
                exit={{ opacity: 0, width: 0 }}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Button
                  onClick={handleClear}
                  variant="outline"
                  disabled={isPending}
                  className="rounded-sm border-2 border-gray-300 dark:border-gray-600 hover:border-black dark:hover:border-white hover:bg-gray-50 dark:hover:bg-gray-800 font-light text-xs uppercase tracking-wide h-11 px-4 transition-all duration-300"
                >
                  <X className="w-4 h-4 mr-1" />
                  Xóa
                </Button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Quick Price Ranges */}
        <div className="pt-4 border-t border-gray-200 dark:border-gray-700 mt-4">
          <p className="text-xs font-light text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-3">
            Khoảng giá nhanh
          </p>
          <div className="flex flex-wrap gap-2">
            {[
              { min: "0", max: "500000", label: "Dưới 500K" },
              { min: "500000", max: "1000000", label: "500K - 1M" },
              { min: "1000000", max: "2000000", label: "1M - 2M" },
              { min: "2000000", max: "", label: "Trên 2M" },
            ].map((range) => {
              const isSelected =
                localMinPrice === range.min && localMaxPrice === range.max;
              return (
                <motion.button
                  key={range.label}
                  onClick={() => {
                    setLocalMinPrice(range.min);
                    setLocalMaxPrice(range.max);
                  }}
                  disabled={isPending}
                  className={cn(
                    "px-4 py-2 border-2 rounded-sm font-light text-xs uppercase tracking-wide transition-all duration-300",
                    "focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black dark:focus:ring-white",
                    isSelected
                      ? "bg-black dark:bg-white text-white dark:text-black border-black dark:border-white shadow-md"
                      : "bg-white dark:bg-gray-900 text-black dark:text-white border-gray-300 dark:border-gray-600 hover:border-gray-500 dark:hover:border-gray-400 hover:shadow-sm"
                  )}
                  whileHover={{ scale: isPending ? 1 : 1.03 }}
                  whileTap={{ scale: isPending ? 1 : 0.97 }}
                >
                  {range.label}
                </motion.button>
              );
            })}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default PriceFilter;
