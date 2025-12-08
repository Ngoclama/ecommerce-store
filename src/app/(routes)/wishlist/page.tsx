"use client";

import { useEffect, useState, useRef } from "react";
import Container from "@/components/ui/container";
import ProductList from "@/components/product-list";
import useCart from "@/hooks/use-cart";
import { Product } from "@/types";
import {
  Loader2,
  Heart,
  Sparkles,
  Grid3x3,
  List,
  ArrowUpDown,
  SortAsc,
  SortDesc,
  TrendingUp,
  Crown,
  Gem,
  ChevronRight,
} from "lucide-react";
import getProducts from "@/actions/get-products";
import { motion, AnimatePresence, useInView } from "framer-motion";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { useWishlist } from "@/hooks/use-wishlist";
import ProductCard from "@/components/ui/product-card";
import { useWishlist as useWishlistHook } from "@/hooks/use-wishlist";

const WishlistPage = () => {
  const {
    wishlistItems,
    setWishlist,
    isItemInWishlist: isItemInWishlistCart,
  } = useCart();
  const { getAllWishlistItems, isSignedIn, toggleWishlist } = useWishlistHook();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [sortBy, setSortBy] = useState<"name" | "price" | "newest">("newest");
  const wishlistItemsRef = useRef<string[]>([]);
  const headerRef = useRef<HTMLDivElement>(null);
  const isHeaderInView = useInView(headerRef, { once: true, margin: "-100px" });

  // Cập nhật ref khi wishlistItems thay đổi
  useEffect(() => {
    wishlistItemsRef.current = wishlistItems;
  }, [wishlistItems]);

  useEffect(() => {
    let isMounted = true;

    const fetchWishlistProducts = async () => {
      setLoading(true);
      try {
        // Sync với server nếu user đã đăng nhập
        let serverWishlistItems: string[] = [];
        if (isSignedIn) {
          try {
            console.log("[WISHLIST_PAGE] Fetching from server...");
            serverWishlistItems = await getAllWishlistItems();
            console.log(
              "[WISHLIST_PAGE] Server wishlist items:",
              serverWishlistItems
            );
            if (isMounted) {
              const currentWishlistKey = wishlistItemsRef.current
                .sort()
                .join(",");
              const serverWishlistKey = serverWishlistItems.sort().join(",");

              console.log(
                "[WISHLIST_PAGE] Current local items:",
                wishlistItemsRef.current
              );
              console.log("[WISHLIST_PAGE] Comparing:", {
                currentWishlistKey,
                serverWishlistKey,
              });

              if (currentWishlistKey !== serverWishlistKey) {
                if (serverWishlistItems.length > 0) {
                  console.log(
                    "[WISHLIST_PAGE] Updating local wishlist with server data"
                  );
                  setWishlist(serverWishlistItems);
                } else {
                  console.log("[WISHLIST_PAGE] Clearing local wishlist");
                  setWishlist([]);
                }
              }
            }
          } catch (error) {
            console.error("Error syncing wishlist from server:", error);
          }
        } else {
          console.log(
            "[WISHLIST_PAGE] User not signed in, using local items:",
            wishlistItemsRef.current
          );
        }

        if (!isMounted) return;

        const finalWishlistItems =
          isSignedIn && serverWishlistItems.length > 0
            ? serverWishlistItems
            : wishlistItemsRef.current;

        console.log(
          "[WISHLIST_PAGE] Final wishlist items to fetch:",
          finalWishlistItems
        );

        if (finalWishlistItems.length === 0) {
          console.log("[WISHLIST_PAGE] No wishlist items, showing empty state");
          setProducts([]);
          setLoading(false);
          return;
        }

        const allProductsResult = await getProducts({});

        const allProducts = Array.isArray(allProductsResult)
          ? allProductsResult
          : allProductsResult?.products || [];

        console.log(
          "[WISHLIST_PAGE] Total products fetched:",
          allProducts.length
        );

        if (!isMounted) return;

        const wishlistProducts = allProducts.filter((product: Product) =>
          finalWishlistItems.includes(product.id)
        );

        console.log(
          "[WISHLIST_PAGE] Filtered wishlist products:",
          wishlistProducts.length
        );
        console.log(
          "[WISHLIST_PAGE] Product IDs:",
          wishlistProducts.map((p) => p.id)
        );

        // Sort products
        const sortedProducts = [...wishlistProducts];
        switch (sortBy) {
          case "name":
            sortedProducts.sort((a, b) => a.name.localeCompare(b.name));
            break;
          case "price":
            sortedProducts.sort((a, b) => a.price - b.price);
            break;
          case "newest":
            sortedProducts.sort(
              (a, b) =>
                new Date((b as any).createdAt || 0).getTime() -
                new Date((a as any).createdAt || 0).getTime()
            );
            break;
        }

        setProducts(sortedProducts);
      } catch (error) {
        console.error("Error fetching wishlist products:", error);
        if (isMounted) {
          setProducts([]);
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchWishlistProducts();

    return () => {
      isMounted = false;
    };
  }, [sortBy, isSignedIn, getAllWishlistItems, setWishlist]);

  const handleToggleFavorite = async (productId: string) => {
    try {
      const newStatus = await toggleWishlist(productId);
      if (newStatus) {
        if (!wishlistItems.includes(productId)) {
          setWishlist([...wishlistItems, productId]);
        }
      } else {
        setWishlist(wishlistItems.filter((id) => id !== productId));
        setProducts(products.filter((p) => p.id !== productId));
      }
    } catch (error) {
      console.error("Error toggling wishlist:", error);
    }
  };

  if (loading) {
    return (
      <div className="bg-linear-to-br from-neutral-50 via-white to-neutral-50 dark:from-neutral-950 dark:via-gray-900 dark:to-neutral-950 min-h-screen">
        <Container>
          <div className="px-4 py-32 sm:px-6 lg:px-8 flex flex-col items-center justify-center gap-6">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            >
              <Loader2 className="w-12 h-12 text-neutral-400 dark:text-neutral-600" />
            </motion.div>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="text-sm text-neutral-600 dark:text-neutral-400 font-light tracking-wide uppercase"
            >
              Đang tải danh sách yêu thích...
            </motion.p>
          </div>
        </Container>
      </div>
    );
  }

  return (
    <div className="bg-linear-to-br from-neutral-50 via-white to-neutral-50 dark:from-neutral-950 dark:via-gray-900 dark:to-neutral-950 min-h-screen">
      <Container>
        <div>
          {/* Luxury Header Section */}
          <motion.div
            ref={headerRef}
            initial={{ opacity: 0, y: 30 }}
            animate={
              isHeaderInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }
            }
            transition={{ duration: 0.8 }}
            className="mb-8 md:mb-10"
          >
            <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 md:gap-6 mb-6">
              <div className="space-y-3 md:space-y-4">
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={
                    isHeaderInView
                      ? { opacity: 1, scale: 1 }
                      : { opacity: 0, scale: 0.8 }
                  }
                  transition={{ duration: 0.6, delay: 0.2, type: "spring" }}
                  className="inline-flex items-center gap-3 px-5 py-3 bg-linear-to-br from-red-50 to-pink-50 dark:from-red-950/20 dark:to-pink-950/20 border-2 border-red-200 dark:border-red-800 rounded-sm"
                >
                  <motion.div
                    animate={{ scale: [1, 1.1, 1] }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      ease: "easeInOut",
                    }}
                  >
                    <Heart className="w-6 h-6 text-red-500 dark:text-red-400 fill-red-500 dark:fill-red-400" />
                  </motion.div>
                  <span className="text-xs font-light text-red-700 dark:text-red-300 uppercase tracking-[0.2em]">
                    Danh sách yêu thích
                  </span>
                </motion.div>

                <motion.h1
                  initial={{ opacity: 0, y: 20 }}
                  animate={
                    isHeaderInView
                      ? { opacity: 1, y: 0 }
                      : { opacity: 0, y: 20 }
                  }
                  transition={{ duration: 0.8, delay: 0.3 }}
                  className="text-3xl md:text-4xl lg:text-5xl font-light text-neutral-900 dark:text-neutral-100 leading-[1.1] tracking-tight uppercase"
                >
                  Sản phẩm yêu thích
                </motion.h1>

                <motion.div
                  initial={{ opacity: 0, width: 0 }}
                  animate={
                    isHeaderInView
                      ? { opacity: 1, width: "100%" }
                      : { opacity: 0, width: 0 }
                  }
                  transition={{ duration: 1, delay: 0.4 }}
                  className="h-px bg-linear-to-r from-neutral-900 via-neutral-400 to-transparent dark:from-neutral-100 dark:via-neutral-600"
                />

                <motion.p
                  initial={{ opacity: 0, y: 10 }}
                  animate={
                    isHeaderInView
                      ? { opacity: 1, y: 0 }
                      : { opacity: 0, y: 10 }
                  }
                  transition={{ duration: 0.8, delay: 0.5 }}
                  className="text-sm md:text-base text-neutral-600 dark:text-neutral-400 font-light tracking-wide"
                >
                  {products.length > 0
                    ? `${products.length} sản phẩm trong danh sách yêu thích của bạn`
                    : "Chưa có sản phẩm yêu thích"}
                </motion.p>
              </div>

              {/* View Mode & Sort Controls - Luxury Style */}
              {products.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={
                    isHeaderInView
                      ? { opacity: 1, x: 0 }
                      : { opacity: 0, x: 20 }
                  }
                  transition={{ duration: 0.8, delay: 0.4 }}
                  className="flex flex-col sm:flex-row items-start sm:items-center gap-4"
                >
                  {/* Sort Dropdown */}
                  <div className="relative">
                    <div className="flex items-center gap-2 border-2 border-neutral-200 dark:border-neutral-800 rounded-sm bg-white dark:bg-gray-900 hover:border-neutral-400 dark:hover:border-neutral-600 transition-all duration-300">
                      <ArrowUpDown className="w-4 h-4 text-neutral-600 dark:text-neutral-400 ml-3" />
                      <select
                        value={sortBy}
                        onChange={(e) =>
                          setSortBy(
                            e.target.value as "name" | "price" | "newest"
                          )
                        }
                        className="appearance-none bg-transparent border-0 py-3 pr-8 pl-2 text-xs font-light text-neutral-900 dark:text-neutral-100 uppercase tracking-wide focus:outline-none cursor-pointer"
                      >
                        <option value="newest">Mới nhất</option>
                        <option value="name">Tên A-Z</option>
                        <option value="price">Giá tăng dần</option>
                      </select>
                    </div>
                  </div>

                  {/* View Mode Toggle */}
                  <div className="flex items-center border-2 border-neutral-200 dark:border-neutral-800 rounded-sm overflow-hidden bg-white dark:bg-gray-900">
                    <motion.button
                      onClick={() => setViewMode("grid")}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className={cn(
                        "p-3 transition-all duration-300",
                        viewMode === "grid"
                          ? "bg-neutral-900 dark:bg-neutral-100 text-white dark:text-neutral-900"
                          : "bg-white dark:bg-gray-900 text-neutral-600 dark:text-neutral-400 hover:bg-neutral-50 dark:hover:bg-gray-800"
                      )}
                      aria-label="Xem dạng lưới"
                    >
                      <Grid3x3 className="w-4 h-4" />
                    </motion.button>
                    <motion.button
                      onClick={() => setViewMode("list")}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className={cn(
                        "p-3 transition-all duration-300",
                        viewMode === "list"
                          ? "bg-neutral-900 dark:bg-neutral-100 text-white dark:text-neutral-900"
                          : "bg-white dark:bg-gray-900 text-neutral-600 dark:text-neutral-400 hover:bg-neutral-50 dark:hover:bg-gray-800"
                      )}
                      aria-label="Xem dạng danh sách"
                    >
                      <List className="w-4 h-4" />
                    </motion.button>
                  </div>
                </motion.div>
              )}
            </div>
          </motion.div>

          {/* Products Section */}
          <AnimatePresence mode="wait">
            {products.length === 0 ? (
              <LuxuryEmptyState />
            ) : (
              <motion.div
                key="products"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.5 }}
              >
                {viewMode === "grid" ? (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.5 }}
                    className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 sm:gap-6"
                  >
                    {products.map((product, index) => (
                      <motion.div
                        key={product.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.4, delay: index * 0.05 }}
                        whileHover={{ y: -5 }}
                      >
                        <ProductCard
                          data={product}
                          isWishlistActive={isItemInWishlistCart(product.id)}
                          onToggleFavorite={handleToggleFavorite}
                        />
                      </motion.div>
                    ))}
                  </motion.div>
                ) : (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.5 }}
                    className="space-y-4"
                  >
                    {products.map((product, index) => (
                      <motion.div
                        key={product.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.4, delay: index * 0.03 }}
                      >
                        <ProductCard
                          data={product}
                          isWishlistActive={isItemInWishlistCart(product.id)}
                          onToggleFavorite={handleToggleFavorite}
                        />
                      </motion.div>
                    ))}
                  </motion.div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </Container>
    </div>
  );
};

// Luxury Empty State Component
const LuxuryEmptyState = () => {
  const emptyStateRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(emptyStateRef, { once: true, margin: "-100px" });

  return (
    <motion.div
      ref={emptyStateRef}
      initial={{ opacity: 0, y: 30 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
      transition={{ duration: 0.8 }}
      className="py-16 md:py-20 text-center"
    >
      <div className="max-w-lg mx-auto space-y-8">
        <motion.div
          initial={{ scale: 0 }}
          animate={isInView ? { scale: 1 } : { scale: 0 }}
          transition={{ duration: 0.6, delay: 0.2, type: "spring" }}
          className="flex justify-center"
        >
          <div className="relative">
            <div className="absolute inset-0 bg-linear-to-br from-red-100 to-pink-100 dark:from-red-950/30 dark:to-pink-950/30 rounded-full blur-2xl opacity-50" />
            <div className="relative p-8 bg-white dark:bg-gray-900 border-2 border-neutral-200 dark:border-neutral-800 rounded-full">
              <motion.div
                animate={{ scale: [1, 1.1, 1] }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              >
                <Heart className="w-20 h-20 text-neutral-300 dark:text-neutral-700" />
              </motion.div>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="space-y-4"
        >
          <h2 className="text-3xl md:text-4xl font-light text-neutral-900 dark:text-neutral-100 uppercase tracking-tight">
            Danh sách yêu thích trống
          </h2>
          <motion.div
            initial={{ opacity: 0, width: 0 }}
            animate={
              isInView
                ? { opacity: 1, width: "120px" }
                : { opacity: 0, width: 0 }
            }
            transition={{ duration: 1, delay: 0.4 }}
            className="h-px bg-linear-to-r from-transparent via-neutral-400 to-transparent dark:via-neutral-600 mx-auto"
          />
          <p className="text-sm md:text-base text-neutral-600 dark:text-neutral-400 font-light leading-relaxed max-w-md mx-auto">
            Bạn chưa có sản phẩm nào trong danh sách yêu thích.
            <br />
            Hãy khám phá và thêm những sản phẩm bạn yêu thích!
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.8, delay: 0.5 }}
          className="pt-6"
        >
          <Link href="/">
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button className="bg-neutral-900 dark:bg-neutral-100 text-white dark:text-neutral-900 hover:bg-neutral-800 dark:hover:bg-neutral-200 rounded-sm px-10 py-4 text-xs font-light uppercase tracking-[0.2em] transition-all duration-300 shadow-lg hover:shadow-xl">
                <Sparkles className="w-4 h-4 mr-2" />
                Khám phá sản phẩm
                <ChevronRight className="w-4 h-4 ml-2" />
              </Button>
            </motion.div>
          </Link>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default WishlistPage;
