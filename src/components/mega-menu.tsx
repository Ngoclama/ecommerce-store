"use client";

import { cn } from "@/lib/utils";
import { Category } from "@/types";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { ChevronDown } from "lucide-react";
import Image from "next/image";

interface MegaMenuProps {
  categories: Category[];
}

const MegaMenu: React.FC<MegaMenuProps> = ({ categories }) => {
  const pathname = usePathname();
  const [hoveredCategory, setHoveredCategory] = useState<string | null>(null);

  // Debug log
  if (process.env.NODE_ENV === "development") {
    console.log("[MegaMenu] Categories received:", categories.length);
    console.log(
      "[MegaMenu] Categories with children:",
      categories.filter((cat) => cat.children && cat.children.length > 0).length
    );
    console.log(
      "[MegaMenu] Categories data:",
      categories.map((cat) => ({
        id: cat.id,
        name: cat.name,
        childrenCount: cat.children?.length || 0,
      }))
    );
  }

  // Hiển thị tất cả categories, ưu tiên những có children
  const displayCategories = categories.slice(0, 6);

  if (displayCategories.length === 0) return null;

  return (
    <nav className="hidden lg:block bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-center h-12 gap-8">
          {displayCategories.map((category) => {
            const isActive = pathname === `/category/${category.id}`;
            const isHovered = hoveredCategory === category.id;
            const hasChildren =
              category.children && category.children.length > 0;

            return (
              <div
                key={category.id}
                className="relative"
                onMouseEnter={() => setHoveredCategory(category.id)}
                onMouseLeave={() => setHoveredCategory(null)}
              >
                {/* Parent Category Link */}
                <Link
                  href={`/category/${category.id}`}
                  className={cn(
                    "flex items-center gap-1 text-sm font-medium uppercase tracking-wide transition-colors duration-200",
                    "hover:text-black dark:hover:text-white",
                    isActive || isHovered
                      ? "text-black dark:text-white"
                      : "text-gray-600 dark:text-gray-400"
                  )}
                >
                  {category.name}
                  {hasChildren && (
                    <ChevronDown
                      className={cn(
                        "w-4 h-4 transition-transform duration-300",
                        isHovered && "rotate-180"
                      )}
                    />
                  )}
                </Link>

                {/* Dropdown Mega Menu - Only show if has children */}
                <AnimatePresence>
                  {isHovered && hasChildren && category.children && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{
                        duration: 0.2,
                        ease: [0.25, 0.1, 0.25, 1],
                      }}
                      className="absolute left-1/2 -translate-x-1/2 top-full pt-2 z-50"
                    >
                      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-2xl border border-gray-200 dark:border-gray-700 overflow-hidden min-w-[240px]">
                        {/* Parent Category Header with Image */}
                        <div className="bg-gray-50 dark:bg-gray-900 p-4 border-b border-gray-200 dark:border-gray-700">
                          <Link
                            href={`/category/${category.id}`}
                            className="flex items-center gap-3 group"
                          >
                            {category.imageUrl && (
                              <div className="relative w-12 h-12 rounded-md overflow-hidden flex-shrink-0">
                                <Image
                                  src={category.imageUrl}
                                  alt={category.name}
                                  fill
                                  className="object-cover group-hover:scale-110 transition-transform duration-300"
                                />
                              </div>
                            )}
                            <div>
                              <p className="text-sm font-semibold text-black dark:text-white uppercase tracking-wide">
                                {category.name}
                              </p>
                              <p className="text-xs text-gray-500 dark:text-gray-400">
                                Xem tất cả →
                              </p>
                            </div>
                          </Link>
                        </div>

                        {/* Children Categories */}
                        <div className="p-2 max-h-[400px] overflow-y-auto">
                          {category.children.map((child, index) => (
                            <motion.div
                              key={child.id}
                              initial={{ opacity: 0, x: -10 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{
                                duration: 0.2,
                                delay: index * 0.03,
                              }}
                            >
                              <Link
                                href={`/category/${child.id}`}
                                className={cn(
                                  "flex items-center gap-3 px-3 py-2.5 rounded-md transition-all duration-200",
                                  "hover:bg-gray-100 dark:hover:bg-gray-700 group",
                                  pathname === `/category/${child.id}` &&
                                    "bg-gray-100 dark:bg-gray-700"
                                )}
                              >
                                {child.imageUrl && (
                                  <div className="relative w-10 h-10 rounded overflow-hidden flex-shrink-0">
                                    <Image
                                      src={child.imageUrl}
                                      alt={child.name}
                                      fill
                                      className="object-cover group-hover:scale-110 transition-transform duration-300"
                                    />
                                  </div>
                                )}
                                <span
                                  className={cn(
                                    "text-sm font-light group-hover:font-medium transition-all",
                                    pathname === `/category/${child.id}`
                                      ? "text-black dark:text-white font-medium"
                                      : "text-gray-700 dark:text-gray-300"
                                  )}
                                >
                                  {child.name}
                                </span>
                              </Link>
                            </motion.div>
                          ))}
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
      </div>
    </nav>
  );
};

export default MegaMenu;
