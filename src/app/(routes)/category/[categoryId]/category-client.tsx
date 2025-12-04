"use client";

import { Product, Size, Color, Category } from "@/types";
import Billboard from "@/components/billboard";
import Container from "@/components/ui/container";
import ProductCard from "@/components/ui/product-card";
import Filter from "../components/filter";
import MobileFilters from "../components/mobile-filter";
import SortFilter from "../components/sort-filter";
import PriceFilter from "../components/price-filter";
import NoResult from "@/components/ui/result";
import { useMemo, useState } from "react";
import useCart from "@/hooks/use-cart";
import { motion, AnimatePresence } from "framer-motion";
import { X, SlidersHorizontal, Grid3x3, List, ChevronRight } from "lucide-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import qs from "query-string";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface CategoryClientProps {
  products: Product[];
  sizes: Size[];
  colors: Color[];
  category: Category | null;
  searchParams: {
    colorId?: string;
    sizeId?: string;
    sort?: string;
    minPrice?: string;
    maxPrice?: string;
  };
}

const CategoryClient: React.FC<CategoryClientProps> = ({
  products,
  sizes,
  colors,
  category,
  searchParams,
}) => {
  const { isItemInWishlist, toggleWishlist } = useCart();
  const router = useRouter();
  const pathname = usePathname();
  const urlSearchParams = useSearchParams();
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  // Filter and sort products
  const filteredAndSortedProducts = useMemo(() => {
    let result = [...products];

    // Color filter
    if (searchParams.colorId) {
      result = result.filter((p) => {
        // Check if product has variant with matching colorId
        return p.variants?.some((v) => v.color?.id === searchParams.colorId);
      });
    }

    // Size filter
    if (searchParams.sizeId) {
      result = result.filter((p) => {
        // Check if product has variant with matching sizeId
        return p.variants?.some((v) => v.size?.id === searchParams.sizeId);
      });
    }

    // Price filter
    if (searchParams.minPrice) {
      const min = parseFloat(searchParams.minPrice);
      result = result.filter((p) => p.price >= min);
    }
    if (searchParams.maxPrice) {
      const max = parseFloat(searchParams.maxPrice);
      result = result.filter((p) => p.price <= max);
    }

    // Sort
    switch (searchParams.sort) {
      case "price-asc":
        result.sort((a, b) => a.price - b.price);
        break;
      case "price-desc":
        result.sort((a, b) => b.price - a.price);
        break;
      case "name-asc":
        result.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case "name-desc":
        result.sort((a, b) => b.name.localeCompare(a.name));
        break;
      case "oldest":
        result.sort((a, b) => {
          const aDate = (a as any).createdAt
            ? new Date((a as any).createdAt).getTime()
            : 0;
          const bDate = (b as any).createdAt
            ? new Date((b as any).createdAt).getTime()
            : 0;
          return aDate - bDate;
        });
        break;
      default: // newest
        result.sort((a, b) => {
          const aDate = (a as any).createdAt
            ? new Date((a as any).createdAt).getTime()
            : 0;
          const bDate = (b as any).createdAt
            ? new Date((b as any).createdAt).getTime()
            : 0;
          return bDate - aDate;
        });
    }

    return result;
  }, [products, searchParams]);

  // Get active filters for display
  const activeFilters = useMemo(() => {
    const filters: Array<{ key: string; label: string; value: string }> = [];
    
    const colorId = urlSearchParams.get("colorId");
    const sizeId = urlSearchParams.get("sizeId");
    const minPrice = urlSearchParams.get("minPrice");
    const maxPrice = urlSearchParams.get("maxPrice");
    const sort = urlSearchParams.get("sort");

    if (colorId) {
      const color = colors.find((c) => c.id === colorId);
      if (color) filters.push({ key: "colorId", label: "Màu", value: color.name });
    }
    if (sizeId) {
      const size = sizes.find((s) => s.id === sizeId);
      if (size) filters.push({ key: "sizeId", label: "Size", value: size.name });
    }
    if (minPrice || maxPrice) {
      const min = minPrice ? parseInt(minPrice).toLocaleString("vi-VN") : "0";
      const max = maxPrice ? parseInt(maxPrice).toLocaleString("vi-VN") : "∞";
      filters.push({ key: "price", label: "Giá", value: `${min}₫ - ${max}₫` });
    }
    if (sort && sort !== "newest") {
      const sortLabels: Record<string, string> = {
        oldest: "Cũ nhất",
        "price-asc": "Giá: Thấp → Cao",
        "price-desc": "Giá: Cao → Thấp",
        "name-asc": "Tên: A → Z",
        "name-desc": "Tên: Z → A",
      };
      filters.push({ key: "sort", label: "Sắp xếp", value: sortLabels[sort] || sort });
    }

    return filters;
  }, [urlSearchParams, colors, sizes]);

  // Remove filter function
  const removeFilter = (key: string) => {
    const current = qs.parse(urlSearchParams.toString());
    
    if (key === "price") {
      delete current.minPrice;
      delete current.maxPrice;
    } else {
      delete current[key];
    }

    const url = qs.stringifyUrl(
      {
        url: pathname,
        query: current,
      },
      { skipNull: true, skipEmptyString: true }
    );

    router.replace(url, { scroll: false });
  };

  // Clear all filters
  const clearAllFilters = () => {
    router.replace(pathname, { scroll: false });
  };

  return (
    <div className="bg-white dark:bg-gray-900 min-h-screen relative overflow-hidden">

      {/* Billboard Section with enhanced effects */}
      {category?.billboard && (
        <motion.div
          className="mb-12 relative z-10"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          <Billboard data={category.billboard} />
        </motion.div>
      )}

      <Container>
        <div className="px-4 sm:px-6 lg:px-8 py-8 lg:py-12 relative z-10">
          {/* Page Header */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mb-8"
          >
            {/* Breadcrumb */}
            <nav className="flex items-center gap-2 text-xs font-light text-gray-500 dark:text-gray-400 mb-4 uppercase tracking-wide">
              <a href="/" className="hover:text-black dark:hover:text-white transition-colors">
                Trang chủ
              </a>
              <ChevronRight className="w-3 h-3" />
              <a href="/categories" className="hover:text-black dark:hover:text-white transition-colors">
                Danh mục
              </a>
              <ChevronRight className="w-3 h-3" />
              <span className="text-black dark:text-white">{category?.name || "Sản phẩm"}</span>
            </nav>

            {/* Title and Count */}
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
              <div>
                <h1 className="text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-light text-black dark:text-white uppercase tracking-tight mb-3">
                  {category?.name || "Sản phẩm"}
                </h1>
              </div>
              <div className="flex items-center gap-4">
                <div className="text-right p-4 bg-gray-50 dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700">
                  <p className="text-sm font-light text-gray-600 dark:text-gray-400">
                    Hiển thị{" "}
                    <span className="text-black dark:text-white font-medium text-lg">
                      {filteredAndSortedProducts.length}
                    </span>{" "}
                    trong tổng số{" "}
                    <span className="text-black dark:text-white font-medium text-lg">
                      {products.length}
                    </span>{" "}
                    sản phẩm
                  </p>
                </div>
              </div>
            </div>

            {/* Enhanced Active Filters with stagger animations */}
            {activeFilters.length > 0 && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.4 }}
                className="flex flex-wrap items-center gap-2 mb-6 pb-6 border-b border-gray-200 dark:border-gray-700"
              >
                <span className="text-xs font-light text-gray-500 dark:text-gray-400 uppercase tracking-wide">
                  Bộ lọc đang áp dụng:
                </span>
                {activeFilters.map((filter, index) => (
                  <motion.button
                    key={filter.key}
                    initial={{ opacity: 0, scale: 0.5, rotate: -180 }}
                    animate={{ opacity: 1, scale: 1, rotate: 0 }}
                    transition={{
                      duration: 0.5,
                      delay: index * 0.1,
                      type: "spring",
                      stiffness: 200,
                    }}
                    whileHover={{ scale: 1.1, rotate: 5, y: -2 }}
                    whileTap={{ scale: 0.9, rotate: -5 }}
                    onClick={() => removeFilter(filter.key)}
                    className="group relative flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-gray-100 to-gray-50 dark:from-gray-800 dark:to-gray-700 border-2 border-gray-300 dark:border-gray-600 rounded-full text-xs font-light text-black dark:text-white hover:border-gray-400 dark:hover:border-gray-500 transition-all duration-300 shadow-sm hover:shadow-md overflow-hidden"
                  >
                    <motion.div
                      className="absolute inset-0 bg-gradient-to-r from-yellow-400/20 to-transparent opacity-0 group-hover:opacity-100"
                      transition={{ duration: 0.3 }}
                    />
                    <span className="relative z-10 text-gray-500 dark:text-gray-400 font-medium">
                      {filter.label}:
                    </span>
                    <span className="relative z-10 font-medium">{filter.value}</span>
                    <motion.div
                      whileHover={{ rotate: 90 }}
                      transition={{ duration: 0.2 }}
                    >
                      <X className="w-3.5 h-3.5 text-gray-400 group-hover:text-red-500 dark:group-hover:text-red-400 transition-colors relative z-10" />
                    </motion.div>
                  </motion.button>
                ))}
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={clearAllFilters}
                  className="px-3 py-1.5 text-xs font-light text-gray-500 dark:text-gray-400 hover:text-black dark:hover:text-white uppercase tracking-wide transition-colors"
                >
                  Xóa tất cả
                </motion.button>
              </motion.div>
            )}
          </motion.div>

          <div className="lg:grid lg:grid-cols-12 lg:gap-8">
            {/* Mobile Filters */}
            <div className="lg:hidden mb-6">
              <MobileFilters sizes={sizes} colors={colors} />
            </div>

            {/* Desktop Filters Sidebar */}
            <aside className="hidden lg:block lg:col-span-3">
              <div className="sticky top-8 space-y-6 max-h-[calc(100vh-4rem)] overflow-y-auto pr-2">
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: 0.1 }}
                >
                  <SortFilter />
                </motion.div>
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                >
                  <PriceFilter />
                </motion.div>
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: 0.3 }}
                >
                  <Filter valueKey="sizeId" name="Kích thước" data={sizes} />
                </motion.div>
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: 0.4 }}
                >
                  <Filter valueKey="colorId" name="Màu sắc" data={colors} />
                </motion.div>
              </div>
            </aside>

            {/* Products Section */}
            <main className="lg:col-span-9">
              {/* Toolbar */}
              <div className="flex items-center justify-between mb-6 pb-4 border-b border-gray-200 dark:border-gray-700">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-light text-gray-500 dark:text-gray-400 uppercase tracking-wide">
                    Chế độ xem:
                  </span>
                  <div className="flex items-center border border-gray-300 dark:border-gray-600 rounded-sm overflow-hidden">
                    <button
                      onClick={() => setViewMode("grid")}
                      className={cn(
                        "p-2 transition-all duration-200",
                        viewMode === "grid"
                          ? "bg-black dark:bg-white text-white dark:text-black"
                          : "bg-white dark:bg-gray-900 text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800"
                      )}
                      aria-label="Xem dạng lưới"
                    >
                      <Grid3x3 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => setViewMode("list")}
                      className={cn(
                        "p-2 transition-all duration-200",
                        viewMode === "list"
                          ? "bg-black dark:bg-white text-white dark:text-black"
                          : "bg-white dark:bg-gray-900 text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800"
                      )}
                      aria-label="Xem dạng danh sách"
                    >
                      <List className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>

              {/* Products Grid/List */}
              {filteredAndSortedProducts.length === 0 ? (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                >
                  <NoResult />
                </motion.div>
              ) : (
                <AnimatePresence mode="wait">
                  {viewMode === "grid" ? (
                    <motion.div
                      key="grid"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.3 }}
                      className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6"
                    >
                      {filteredAndSortedProducts.map((item, index) => (
                        <motion.div
                          key={item.id}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.4, delay: index * 0.05 }}
                          whileHover={{ y: -5, transition: { duration: 0.2 } }}
                        >
                          <ProductCard
                            data={item}
                            isWishlistActive={isItemInWishlist(item.id)}
                            onToggleFavorite={toggleWishlist}
                          />
                        </motion.div>
                      ))}
                    </motion.div>
                  ) : (
                    <motion.div
                      key="list"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.3 }}
                      className="space-y-4"
                    >
                      {filteredAndSortedProducts.map((item, index) => (
                        <motion.div
                          key={item.id}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ duration: 0.4, delay: index * 0.03 }}
                          whileHover={{ x: 5, transition: { duration: 0.2 } }}
                        >
                          <ProductCard
                            data={item}
                            isWishlistActive={isItemInWishlist(item.id)}
                            onToggleFavorite={toggleWishlist}
                          />
                        </motion.div>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              )}
            </main>
          </div>
        </div>
      </Container>
    </div>
  );
};

export default CategoryClient;
