"use client";

import { Category } from "@/types";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  ChevronRight,
  ChevronLeft,
  Menu,
  Grid3x3,
  Sparkles,
} from "lucide-react";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface CategorySidebarLeftProps {
  categories: Category[];
}

export default function CategorySidebarLeft({
  categories,
}: CategorySidebarLeftProps) {
  const pathname = usePathname();
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(
    new Set()
  );

  const [isOpen, setIsOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    requestAnimationFrame(() => {
      setMounted(true);
      const saved = localStorage.getItem("sidebarOpen");
      if (saved === "true") {
        setIsOpen(true);
      }
    });
  }, []);

  useEffect(() => {
    if (!mounted) return;

    localStorage.setItem("sidebarOpen", String(isOpen));
    window.dispatchEvent(
      new CustomEvent("sidebar-toggle", {
        detail: { isOpen },
      })
    );
  }, [isOpen, mounted]);

  const categoryTree = categories.reduce((acc, category) => {
    if (!category.parentId) {
      if (!acc[category.id]) {
        acc[category.id] = {
          ...category,
          children: [],
        };
      }
    } else {
      if (!acc[category.parentId]) {
        acc[category.parentId] = {
          ...categories.find((c) => c.id === category.parentId)!,
          children: [],
        };
      }
      acc[category.parentId].children.push(category);
    }
    return acc;
  }, {} as Record<string, Category & { children: Category[] }>);

  const parentCategories = Object.values(categoryTree);

  const toggleCategory = (categoryId: string) => {
    setExpandedCategories((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(categoryId)) {
        newSet.delete(categoryId);
      } else {
        newSet.add(categoryId);
      }
      return newSet;
    });
  };

  
  if (!mounted) {
    return (
      <>
        <div className="hidden lg:flex fixed left-0 top-[120px] w-8 h-14 bg-linear-to-br from-white to-neutral-50 dark:from-gray-900 dark:to-neutral-950 border-2 border-r-0 border-neutral-200 dark:border-neutral-800 z-40 items-center justify-center rounded-r-sm" />
        <div className="hidden lg:block fixed left-0 top-[120px] bottom-0 w-0 bg-linear-to-br from-white via-neutral-50 to-white dark:from-gray-900 dark:via-neutral-950 dark:to-gray-900 border-r-2 border-neutral-200 dark:border-neutral-800 z-40" />
      </>
    );
  }

  return (
    <>
      {}
      <AnimatePresence mode="wait">
        <motion.button
          key={isOpen ? "open" : "closed"}
          onClick={() => setIsOpen(!isOpen)}
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -10 }}
          whileHover={{ scale: 1.05, x: isOpen ? 0 : 4 }}
          whileTap={{ scale: 0.95 }}
          transition={{ duration: 0.3 }}
          className={cn(
            "hidden lg:flex fixed left-0 top-[120px] w-8 h-14 bg-linear-to-br from-white to-neutral-50 dark:from-gray-900 dark:to-neutral-950 border-2 border-r-0 border-neutral-200 dark:border-neutral-800 z-40 items-center justify-center hover:border-neutral-400 dark:hover:border-neutral-600 transition-all duration-300 shadow-lg hover:shadow-xl rounded-r-sm",
            isOpen && "left-[280px]"
          )}
          aria-label={isOpen ? "Đóng menu" : "Mở menu"}
        >
          <motion.div
            animate={{ rotate: isOpen ? 0 : 180 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
          >
            {isOpen ? (
              <ChevronLeft className="w-5 h-5 text-neutral-700 dark:text-neutral-300" />
            ) : (
              <Menu className="w-5 h-5 text-neutral-700 dark:text-neutral-300" />
            )}
          </motion.div>
        </motion.button>
      </AnimatePresence>

      {/* Sidebar - Luxury Style */}
      <AnimatePresence>
        {isOpen && (
          <motion.aside
            initial={{ width: 0, opacity: 0 }}
            animate={{ width: 280, opacity: 1 }}
            exit={{ width: 0, opacity: 0 }}
            transition={{
              type: "spring",
              stiffness: 300,
              damping: 30,
              opacity: { duration: 0.2 },
            }}
            className={cn(
              "hidden lg:block fixed left-0 top-[120px] bottom-0 bg-linear-to-br from-white via-neutral-50 to-white dark:from-gray-900 dark:via-neutral-950 dark:to-gray-900 border-r-2 border-neutral-200 dark:border-neutral-800 overflow-hidden z-40 shadow-xl"
            )}
          >
            <div className="h-full flex flex-col w-[280px]">
              {/* Header */}
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.4, delay: 0.1 }}
                className="p-6 border-b-2 border-neutral-200 dark:border-neutral-800"
              >
                <div className="flex items-center gap-3 mb-2">
                  <motion.div
                    animate={{ rotate: [0, 10, -10, 0] }}
                    transition={{
                      duration: 3,
                      repeat: Infinity,
                      ease: "easeInOut",
                    }}
                    className="p-2 rounded-sm bg-linear-to-br from-neutral-900 to-neutral-800 dark:from-neutral-100 dark:to-neutral-200 border-2 border-neutral-900 dark:border-neutral-100"
                  >
                    <Grid3x3 className="w-4 h-4 text-white dark:text-neutral-900" />
                  </motion.div>
                  <h2 className="text-sm font-light uppercase tracking-[0.2em] text-neutral-900 dark:text-neutral-100">
                    Danh mục
                  </h2>
                </div>
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: "100%" }}
                  exit={{ width: 0 }}
                  transition={{ duration: 0.6, delay: 0.2 }}
                  className="h-px bg-linear-to-r from-neutral-900 via-neutral-400 to-transparent dark:from-neutral-100 dark:via-neutral-600"
                />
              </motion.div>

              {/* Navigation */}
              <div className="flex-1 overflow-y-auto p-4">
                <nav className="space-y-2">
                  {parentCategories.map((category, index) => {
                    const isExpanded = expandedCategories.has(category.id);
                    const hasChildren =
                      category.children && category.children.length > 0;
                    const isActive = pathname === `/category/${category.id}`;

                    return (
                      <motion.div
                        key={category.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        transition={{
                          duration: 0.4,
                          delay: 0.2 + index * 0.05,
                        }}
                      >
                        <div className="flex items-center gap-1">
                          <Link
                            href={`/category/${category.id}`}
                            prefetch={true}
                            className={cn(
                              "flex-1 px-4 py-3 text-xs font-light uppercase tracking-[0.15em] transition-all duration-300 rounded-sm border-2",
                              isActive
                                ? "bg-linear-to-r from-neutral-900 to-neutral-800 dark:from-neutral-100 dark:to-neutral-200 text-white dark:text-neutral-900 border-neutral-900 dark:border-neutral-100 shadow-lg"
                                : "text-neutral-700 dark:text-neutral-300 border-transparent hover:border-neutral-300 dark:hover:border-neutral-700 hover:bg-neutral-50 dark:hover:bg-neutral-900/50"
                            )}
                          >
                            {category.name}
                          </Link>
                          {hasChildren && (
                            <motion.button
                              onClick={() => toggleCategory(category.id)}
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.9 }}
                              className={cn(
                                "p-2 rounded-sm border-2 transition-all duration-300",
                                isExpanded
                                  ? "bg-neutral-900 dark:bg-neutral-100 text-white dark:text-neutral-900 border-neutral-900 dark:border-neutral-100"
                                  : "bg-white dark:bg-gray-900 text-neutral-600 dark:text-neutral-400 border-neutral-200 dark:border-neutral-800 hover:border-neutral-400 dark:hover:border-neutral-600"
                              )}
                              aria-label={isExpanded ? "Thu gọn" : "Mở rộng"}
                            >
                              <motion.div
                                animate={{ rotate: isExpanded ? 90 : 0 }}
                                transition={{
                                  type: "spring",
                                  stiffness: 300,
                                  damping: 25,
                                }}
                              >
                                <ChevronRight className="w-4 h-4" />
                              </motion.div>
                            </motion.button>
                          )}
                        </div>
                        <AnimatePresence>
                          {hasChildren && isExpanded && (
                            <motion.div
                              initial={{ height: 0, opacity: 0 }}
                              animate={{ height: "auto", opacity: 1 }}
                              exit={{ height: 0, opacity: 0 }}
                              transition={{
                                duration: 0.3,
                                ease: "easeInOut",
                              }}
                              className="ml-6 mt-2 space-y-1 border-l-2 border-neutral-200 dark:border-neutral-800 pl-4 overflow-hidden"
                            >
                              {category.children.map((child, childIndex) => {
                                const isChildActive =
                                  pathname === `/category/${child.id}`;
                                return (
                                  <motion.div
                                    key={child.id}
                                    initial={{ x: -10, opacity: 0 }}
                                    animate={{ x: 0, opacity: 1 }}
                                    exit={{ x: -10, opacity: 0 }}
                                    transition={{
                                      delay: childIndex * 0.05,
                                      duration: 0.2,
                                    }}
                                  >
                                    <Link
                                      href={`/category/${child.id}`}
                                      prefetch={true}
                                      className={cn(
                                        "block px-3 py-2 text-xs font-light uppercase tracking-[0.15em] transition-all duration-300 rounded-sm border-2",
                                        isChildActive
                                          ? "bg-linear-to-r from-neutral-900 to-neutral-800 dark:from-neutral-100 dark:to-neutral-200 text-white dark:text-neutral-900 border-neutral-900 dark:border-neutral-100 shadow-md"
                                          : "text-neutral-600 dark:text-neutral-400 border-transparent hover:border-neutral-300 dark:hover:border-neutral-700 hover:bg-neutral-50 dark:hover:bg-neutral-900/50 hover:text-neutral-900 dark:hover:text-neutral-100"
                                      )}
                                    >
                                      {child.name}
                                    </Link>
                                  </motion.div>
                                );
                              })}
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </motion.div>
                    );
                  })}
                </nav>
              </div>

              {/* Footer */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.4, delay: 0.3 }}
                className="p-4 border-t-2 border-neutral-200 dark:border-neutral-800"
              >
                <div className="flex items-center gap-2 text-xs font-light text-neutral-500 dark:text-neutral-400 uppercase tracking-[0.15em]">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>{parentCategories.length} danh mục</span>
                </div>
              </motion.div>
            </div>
          </motion.aside>
        )}
      </AnimatePresence>
    </>
  );
}
