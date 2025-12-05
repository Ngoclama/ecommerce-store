"use client";

import { useState, useEffect, useCallback } from "react";
import { useSearchParams } from "next/navigation";
import { Category, Size, Color, Product } from "@/types";
import ProductList from "@/components/product-list";
import NoResult from "@/components/ui/result";
import {
  Loader2,
  ChevronDown,
  X,
  SlidersHorizontal,
  Check,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";

interface SearchContentProps {
  categories: Category[];
  sizes: Size[];
  colors: Color[];
}

export default function SearchContent({
  categories,
  sizes,
  colors,
}: SearchContentProps) {
  const searchParams = useSearchParams();
  const query = searchParams.get("q") || "";

  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [selectedSize, setSelectedSize] = useState<string>("");
  const [selectedColor, setSelectedColor] = useState<string>("");
  const [expandedFilter, setExpandedFilter] = useState<string | null>(
    "category"
  );

  // Fetch products with filters
  const fetchProducts = useCallback(async () => {
    if (!query.trim()) {
      setProducts([]);
      return;
    }

    setIsLoading(true);
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL;
      if (!apiUrl) {
        console.error("[SEARCH] NEXT_PUBLIC_API_URL is not configured");
        setProducts([]);
        setIsLoading(false);
        return;
      }

      const baseUrl = apiUrl.replace(/\/$/, "");
      const params = new URLSearchParams({ q: query, limit: "100" });

      // Add filters independently - each is optional
      if (selectedCategory) params.append("categoryId", selectedCategory);
      if (selectedSize) params.append("sizeId", selectedSize);
      if (selectedColor) params.append("colorId", selectedColor);

      const searchUrl = `${baseUrl}/api/products?${params.toString()}`;
      const res = await fetch(searchUrl, { cache: "no-store" });

      if (!res.ok) {
        console.error("Failed to search products:", res.status, res.statusText);
        setProducts([]);
        return;
      }

      const data = await res.json();
      const productsData = Array.isArray(data) ? data : data.products || [];
      setProducts(productsData);
    } catch (error) {
      console.error("Search error:", error);
      setProducts([]);
    } finally {
      setIsLoading(false);
    }
  }, [query, selectedCategory, selectedSize, selectedColor]);

  // Fetch when filters change
  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const toggleCategory = (categoryId: string) => {
    setSelectedCategory(categoryId === selectedCategory ? "" : categoryId);
  };

  const toggleSize = (sizeId: string) => {
    // Check if category is selected
    if (!selectedCategory) {
      toast.error("Vui lòng chọn danh mục trước khi chọn kích thước");
      return;
    }
    setSelectedSize(sizeId === selectedSize ? "" : sizeId);
  };

  const toggleColor = (colorId: string) => {
    // Check if category is selected
    if (!selectedCategory) {
      toast.error("Vui lòng chọn danh mục trước khi chọn màu sắc");
      return;
    }
    setSelectedColor(colorId === selectedColor ? "" : colorId);
  };

  const clearAllFilters = () => {
    setSelectedCategory("");
    setSelectedSize("");
    setSelectedColor("");
  };

  const activeFilters = [selectedCategory, selectedSize, selectedColor].filter(
    Boolean
  ).length;
  const parentCategories = categories.filter((cat) => !cat.parentId);

  return (
    <div className="min-h-screen bg-white dark:bg-gray-950">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header Section */}
        <div className="mb-10">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-3">
            Tìm kiếm
          </h1>
          {query && (
            <p className="text-gray-600 dark:text-gray-400">
              {isLoading ? (
                <span className="flex items-center gap-2">
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Đang tìm kiếm...
                </span>
              ) : (
                <>
                  <span className="font-medium text-gray-900 dark:text-white">
                    {products.length}
                  </span>{" "}
                  kết quả cho{" "}
                  <span className="font-medium text-gray-900 dark:text-white">
                    &quot;{query}&quot;
                  </span>
                </>
              )}
            </p>
          )}
        </div>

        {!query ? (
          <div className="text-center py-32">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 dark:bg-gray-800 mb-4">
              <SlidersHorizontal className="w-8 h-8 text-gray-400" />
            </div>
            <p className="text-gray-500 dark:text-gray-400">
              Nhập từ khóa để tìm kiếm sản phẩm
            </p>
          </div>
        ) : (
          <div className="flex flex-col lg:flex-row gap-6">
            {/* Filter Sidebar - Minimalist Design */}
            <motion.aside
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="lg:w-72 shrink-0"
            >
              <div className="sticky top-20 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-lg overflow-hidden">
                {/* Filter Header - Clean & Simple */}
                <div className="border-b border-gray-200 dark:border-gray-800 p-4">
                  <div className="flex items-center justify-between">
                    <h2 className="text-base font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                      <SlidersHorizontal className="w-4 h-4" />
                      Bộ lọc
                      {activeFilters > 0 && (
                        <span className="inline-flex items-center justify-center w-5 h-5 text-xs font-medium bg-black dark:bg-white text-white dark:text-black rounded-full">
                          {activeFilters}
                        </span>
                      )}
                    </h2>
                    {activeFilters > 0 && (
                      <button
                        onClick={clearAllFilters}
                        className="text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
                      >
                        Xóa
                      </button>
                    )}
                  </div>
                </div>

                <div className="divide-y divide-gray-200 dark:divide-gray-800">
                  {/* Categories - Radio Style */}
                  {parentCategories.length > 0 && (
                    <div className="p-4">
                      <h3 className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-3">
                        Danh mục
                      </h3>
                      <div className="space-y-1.5">
                        {parentCategories.map((category) => (
                          <button
                            key={category.id}
                            onClick={() => toggleCategory(category.id)}
                            className={`w-full text-left px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${
                              selectedCategory === category.id
                                ? "bg-gray-900 dark:bg-white text-white dark:text-gray-900"
                                : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
                            }`}
                          >
                            {category.name}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Sizes - Minimal Pills */}
                  {sizes.length > 0 && (
                    <div className="p-4">
                      <h3 className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-3">
                        Kích thước
                      </h3>
                      <div className="flex flex-wrap gap-2">
                        {sizes.map((size) => (
                          <button
                            key={size.id}
                            onClick={() => toggleSize(size.id)}
                            className={`px-3.5 py-2 text-sm font-medium rounded-lg transition-all ${
                              selectedSize === size.id
                                ? "bg-gray-900 dark:bg-white text-white dark:text-gray-900 shadow-sm"
                                : "bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700"
                            }`}
                          >
                            {size.name || size.value}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Colors - Simple Swatches */}
                  {colors.length > 0 && (
                    <div className="p-4">
                      <h3 className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-3">
                        Màu sắc
                      </h3>
                      <div className="flex flex-wrap gap-2.5">
                        {colors.map((color) => (
                          <button
                            key={color.id}
                            onClick={() => toggleColor(color.id)}
                            className="relative group"
                            title={color.name}
                          >
                            <div
                              className={`w-10 h-10 rounded-lg transition-all ${
                                selectedColor === color.id
                                  ? "ring-2 ring-gray-900 dark:ring-white ring-offset-2 ring-offset-white dark:ring-offset-gray-900 scale-110"
                                  : "ring-1 ring-gray-300 dark:ring-gray-700 hover:ring-2 hover:ring-gray-400 dark:hover:ring-gray-600"
                              }`}
                              style={{ backgroundColor: color.value || "#ccc" }}
                            />
                            {selectedColor === color.id && (
                              <div className="absolute inset-0 flex items-center justify-center">
                                <Check
                                  className="w-5 h-5 text-white drop-shadow-md"
                                  strokeWidth={2.5}
                                />
                              </div>
                            )}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </motion.aside>

            {/* Products Grid */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex-1 min-w-0"
            >
              {isLoading ? (
                <div className="flex flex-col items-center justify-center py-32">
                  <Loader2 className="w-10 h-10 animate-spin text-gray-400 mb-4" />
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Đang tải sản phẩm...
                  </p>
                </div>
              ) : products.length === 0 ? (
                <NoResult />
              ) : (
                <ProductList title="" items={products} />
              )}
            </motion.div>
          </div>
        )}
      </div>
    </div>
  );
}
