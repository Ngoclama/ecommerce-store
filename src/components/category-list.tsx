"use client";

import { Category } from "@/types";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";

interface CategoryListProps {
  items: Category[];
  showNavigation?: boolean;
  itemsPerPage?: number;
}

const CategoryList: React.FC<CategoryListProps> = ({
  items,
  showNavigation = true,
  itemsPerPage = 5,
}) => {
  const [currentPage, setCurrentPage] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const totalPages = Math.ceil(items.length / itemsPerPage);

  if (process.env.NODE_ENV === "development") {
    console.log("[CategoryList] Total items:", items.length);
    console.log(
      "[CategoryList] Items data:",
      items.map((item) => ({
        id: item.id,
        name: item.name,
        imageUrl: item.imageUrl,
        hasBillboard: !!item.billboard,
        billboardImageUrl: item.billboard?.imageUrl,
        finalImage: item.imageUrl || item.billboard?.imageUrl,
      }))
    );
  }

  const displayedItems = showNavigation
    ? items.slice(currentPage * itemsPerPage, (currentPage + 1) * itemsPerPage)
    : items;

  const handlePrevious = () => {
    if (isTransitioning) return;
    setIsTransitioning(true);
    setCurrentPage((prev) => (prev > 0 ? prev - 1 : totalPages - 1));
    setTimeout(() => setIsTransitioning(false), 300);
  };

  const handleNext = () => {
    if (isTransitioning) return;
    setIsTransitioning(true);
    setCurrentPage((prev) => (prev < totalPages - 1 ? prev + 1 : 0));
    setTimeout(() => setIsTransitioning(false), 300);
  };

  if (items.length === 0) {
    return (
      <div className="text-center py-12 text-gray-500 dark:text-gray-400">
        Chưa có danh mục nào
      </div>
    );
  }

  return (
    <div className="relative">
      {/* Navigation Buttons */}
      {showNavigation && totalPages > 1 && (
        <>
          <Button
            variant="outline"
            size="icon"
            onClick={handlePrevious}
            disabled={isTransitioning}
            className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 z-10 h-10 w-10 rounded-md bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 shadow-md hover:shadow-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            aria-label="Previous categories"
          >
            <ChevronLeft className="h-5 w-5" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            onClick={handleNext}
            disabled={isTransitioning}
            className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 z-10 h-10 w-10 rounded-md bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 shadow-md hover:shadow-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            aria-label="Next categories"
          >
            <ChevronRight className="h-5 w-5" />
          </Button>
        </>
      )}

      {/* Categories Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 px-2">
        {displayedItems.map((item, index) => (
          <motion.div
            key={`${item.id}-${currentPage}`}
            initial={{ opacity: 0, x: 20, scale: 0.95 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: -20, scale: 0.95 }}
            transition={{
              duration: 0.4,
              delay: index * 0.08,
              ease: [0.25, 0.1, 0.25, 1],
            }}
          >
            <Link
              href={`/category/${item.id}`}
              className={cn(
                "group block bg-white dark:bg-gray-800 overflow-hidden border border-gray-200 dark:border-gray-700 rounded-lg",
                "hover:shadow-xl hover:border-gray-300 dark:hover:border-gray-600 transition-all duration-300 transform hover:-translate-y-1"
              )}
            >
              <div className="relative aspect-square bg-gray-100 dark:bg-gray-700 overflow-hidden">
                {item.imageUrl || item.billboard?.imageUrl ? (
                  <Image
                    src={item.imageUrl || item.billboard?.imageUrl || ""}
                    alt={item.name}
                    fill
                    sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 20vw"
                    className="object-cover transition-transform duration-700 group-hover:scale-110"
                    priority={index < 3}
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-400 dark:text-gray-500">
                    <svg
                      className="w-16 h-16 transition-transform duration-300 group-hover:scale-110"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={1.5}
                        d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                      />
                    </svg>
                  </div>
                )}
                {/* Overlay gradient */}
                <div className="absolute inset-0 bg-linear-to-t from-black/70 via-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              </div>
              <div className="p-4 text-center bg-white dark:bg-gray-800">
                <h3 className="text-sm font-medium text-black dark:text-white uppercase tracking-wider group-hover:text-gray-600 dark:group-hover:text-gray-300 transition-colors duration-300">
                  {item.name}
                </h3>
              </div>
            </Link>
          </motion.div>
        ))}
      </div>

      {/* Page Indicators */}
      {showNavigation && totalPages > 1 && (
        <div className="flex justify-center gap-2 mt-6">
          {Array.from({ length: totalPages }).map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentPage(index)}
              className={cn(
                "h-2 rounded-full transition-all duration-300",
                currentPage === index
                  ? "w-8 bg-black dark:bg-white"
                  : "w-2 bg-gray-300 dark:bg-gray-600 hover:bg-gray-400 dark:hover:bg-gray-500"
              )}
              aria-label={`Go to page ${index + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default CategoryList;
