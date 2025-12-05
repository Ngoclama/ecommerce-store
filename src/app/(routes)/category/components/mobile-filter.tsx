"use client";

import { useState, useEffect } from "react";
import { Color, Size } from "@/types";
import { Filter, X } from "lucide-react";
import { Dialog } from "@headlessui/react";
import { motion, AnimatePresence } from "framer-motion";
import FilterComponent from "./filter";
import SortFilter from "./sort-filter";
import PriceFilter from "./price-filter";
import { Button } from "@/components/ui/button";
import { useSearchParams } from "next/navigation";

interface MobileFiltersProps {
  sizes: Size[];
  colors: Color[];
}

const MobileFilters: React.FC<MobileFiltersProps> = ({ sizes, colors }) => {
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const searchParams = useSearchParams();

  useEffect(() => {
    // Use requestAnimationFrame to defer setState
    requestAnimationFrame(() => {
      setMounted(true);
    });
  }, []);

  const onOpen = () => setOpen(true);
  const onClose = () => setOpen(false);

  // Count active filters
  const activeFiltersCount = [
    searchParams.get("colorId"),
    searchParams.get("sizeId"),
    searchParams.get("minPrice"),
    searchParams.get("maxPrice"),
    searchParams.get("sort") && searchParams.get("sort") !== "newest",
  ].filter(Boolean).length;

  if (!mounted) {
    return (
      <Button
        variant="outline"
        className="flex items-center gap-x-2 lg:hidden rounded-sm border-2 border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 hover:bg-gray-50 dark:hover:bg-gray-800 font-light text-xs uppercase tracking-wide h-11 transition-all duration-200"
        disabled
      >
        <Filter className="w-4 h-4" />
        Bộ lọc
      </Button>
    );
  }

  return (
    <>
      <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
        <Button
          variant="outline"
          className="flex items-center gap-x-2 lg:hidden rounded-sm border-2 border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 hover:bg-gray-50 dark:hover:bg-gray-800 font-light text-xs uppercase tracking-wide h-11 transition-all duration-200 relative"
          onClick={onOpen}
        >
          <Filter className="w-4 h-4" />
          <span>Bộ lọc</span>
          {activeFiltersCount > 0 && (
            <motion.span
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="absolute -top-2 -right-2 w-5 h-5 bg-black dark:bg-white text-white dark:text-black rounded-full flex items-center justify-center text-xs font-medium"
            >
              {activeFiltersCount}
            </motion.span>
          )}
        </Button>
      </motion.div>

      <AnimatePresence>
        {open && (
          <Dialog
            open={open}
            as="div"
            className="relative z-40 lg:hidden"
            onClose={onClose}
          >
            {/* Background Overlay */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black bg-opacity-50 dark:bg-opacity-70"
              onClick={onClose}
            />

            {/* Dialog Panel */}
            <div className="fixed inset-0 z-40 flex pointer-events-none">
              <Dialog.Panel
                as={motion.div}
                initial={{ x: "100%" }}
                animate={{ x: 0 }}
                exit={{ x: "100%" }}
                transition={
                  { type: "spring", damping: 25, stiffness: 200 } as any
                }
                className="relative flex flex-col w-full h-full max-w-sm ml-auto overflow-y-auto bg-white dark:bg-gray-900 border-l-2 border-gray-200 dark:border-gray-700 shadow-2xl pointer-events-auto"
              >
                {/* Header */}
                <div className="sticky top-0 z-10 flex items-center justify-between px-6 py-4 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700">
                  <h2 className="text-lg font-light text-black dark:text-white uppercase tracking-wider">
                    Bộ lọc
                  </h2>
                  <motion.button
                    whileHover={{ rotate: 90 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={onClose}
                    className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-sm transition-colors"
                    aria-label="Đóng bộ lọc"
                  >
                    <X className="w-5 h-5 text-black dark:text-white" />
                  </motion.button>
                </div>

                {/* Filters Content */}
                <div className="flex-1 px-6 py-4 space-y-6">
                  <SortFilter />
                  <PriceFilter />
                  <FilterComponent
                    valueKey="sizeId"
                    name="Kích thước"
                    data={sizes}
                  />
                  <FilterComponent
                    valueKey="colorId"
                    name="Màu sắc"
                    data={colors}
                  />
                </div>

                {/* Footer Actions */}
                <div className="sticky bottom-0 px-6 py-4 bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700">
                  <Button
                    onClick={onClose}
                    className="w-full rounded-sm bg-gray-400 text-white hover:bg-gray-900 font-light text-xs uppercase tracking-wide h-11 transition-all duration-300 hover:shadow-lg hover:shadow-gray-400/30"
                  >
                    Áp dụng bộ lọc
                  </Button>
                </div>
              </Dialog.Panel>
            </div>
          </Dialog>
        )}
      </AnimatePresence>
    </>
  );
};

export default MobileFilters;
