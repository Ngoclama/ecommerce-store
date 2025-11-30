"use client";

import { Category } from "@/types";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { ChevronRight, ChevronLeft, Menu, X } from "lucide-react";
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
  const [isOpen, setIsOpen] = useState(true);

  // Store state in localStorage for persistence
  useEffect(() => {
    const saved = localStorage.getItem("sidebarOpen");
    if (saved !== null) {
      setIsOpen(saved === "true");
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("sidebarOpen", String(isOpen));
    // Dispatch event for layout to update margin
    window.dispatchEvent(
      new CustomEvent("sidebar-toggle", {
        detail: { isOpen },
      })
    );
  }, [isOpen]);

  // Build category tree
  const categoryTree = categories.reduce((acc, category) => {
    if (!category.parentId) {
      // Parent category
      if (!acc[category.id]) {
        acc[category.id] = {
          ...category,
          children: [],
        };
      }
    } else {
      // Child category
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

  return (
    <>
      {/* Toggle Button - Always visible */}
      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className={cn(
          "hidden lg:flex fixed left-0 top-20 w-6 h-12 bg-white dark:bg-gray-900 border-r border-t border-b border-gray-200 dark:border-gray-800 z-50 items-center justify-center hover:bg-gray-50 dark:hover:bg-gray-800 transition-all duration-200 shadow-sm",
          isOpen && "left-64"
        )}
        aria-label={isOpen ? "Đóng menu" : "Mở menu"}
      >
        <motion.div
          animate={{ rotate: isOpen ? 0 : 180 }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
        >
          {isOpen ? (
            <ChevronLeft className="w-4 h-4 text-black dark:text-white" />
          ) : (
            <Menu className="w-4 h-4 text-black dark:text-white" />
          )}
        </motion.div>
      </motion.button>

      {/* Sidebar */}
      <motion.aside
        initial={false}
        animate={{
          width: isOpen ? 256 : 0,
        }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
        className={cn(
          "hidden lg:block fixed left-0 top-20 bottom-0 bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800 overflow-hidden z-40"
        )}
      >
        <div className="p-4">
          <h2 className="text-sm font-light uppercase tracking-wider text-black dark:text-white mb-4">
            Danh mục
          </h2>
          <nav className="space-y-1">
            {parentCategories.map((category) => {
              const isExpanded = expandedCategories.has(category.id);
              const hasChildren =
                category.children && category.children.length > 0;
              const isActive = pathname === `/category/${category.id}`;

              return (
                <div key={category.id}>
                  <div className="flex items-center">
                    <Link
                      href={`/category/${category.id}`}
                      prefetch={true}
                      className={cn(
                        "flex-1 px-3 py-2 text-sm font-light uppercase tracking-wide transition-colors duration-200",
                        isActive
                          ? "bg-black dark:bg-white text-white dark:text-black"
                          : "text-black dark:text-white hover:bg-gray-50 dark:hover:bg-gray-800"
                      )}
                    >
                      {category.name}
                    </Link>
                    {hasChildren && (
                      <motion.button
                        onClick={() => toggleCategory(category.id)}
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        className="p-2 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors rounded"
                      >
                        <motion.div
                          animate={{ rotate: isExpanded ? 90 : 0 }}
                          transition={{
                            type: "spring",
                            stiffness: 300,
                            damping: 25,
                          }}
                        >
                          <ChevronRight className="w-4 h-4 text-gray-400 dark:text-gray-500" />
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
                        transition={{ duration: 0.2, ease: "easeInOut" }}
                        className="ml-4 mt-1 space-y-1 border-l border-gray-200 dark:border-gray-800 pl-4 overflow-hidden"
                      >
                        {category.children.map((child, index) => {
                          const isChildActive =
                            pathname === `/category/${child.id}`;
                          return (
                            <motion.div
                              key={child.id}
                              initial={{ x: -10, opacity: 0 }}
                              animate={{ x: 0, opacity: 1 }}
                              transition={{ delay: index * 0.05 }}
                            >
                              <Link
                                href={`/category/${child.id}`}
                                prefetch={true}
                                className={cn(
                                  "block px-3 py-2 text-xs font-light uppercase tracking-wide transition-colors duration-200",
                                  isChildActive
                                    ? "bg-black dark:bg-white text-white dark:text-black"
                                    : "text-gray-600 dark:text-gray-400 hover:text-black dark:hover:text-white hover:bg-gray-50 dark:hover:bg-gray-800"
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
                </div>
              );
            })}
          </nav>
        </div>
      </motion.aside>
    </>
  );
}
