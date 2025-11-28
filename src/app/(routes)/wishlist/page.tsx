"use client";

import { useEffect, useState } from "react";
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
} from "lucide-react";
import getProducts from "@/actions/get-products";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import Link from "next/link";

const WishlistPage = () => {
  const { wishlistItems, setWishlist } = useCart();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [sortBy, setSortBy] = useState<"name" | "price" | "newest">("newest");

  useEffect(() => {
    const fetchWishlistProducts = async () => {
      if (wishlistItems.length === 0) {
        setLoading(false);
        setProducts([]);
        return;
      }

      try {
        const allProducts = await getProducts({});

        // Filter products that are in wishlist
        const wishlistProducts = allProducts.filter((product: Product) =>
          wishlistItems.includes(product.id)
        );

        // Sort products
        let sortedProducts = [...wishlistProducts];
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
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchWishlistProducts();
  }, [wishlistItems, sortBy]);

  if (loading) {
    return (
      <div className="bg-white min-h-screen">
        <Container>
          <div className="px-4 py-24 sm:px-6 lg:px-8 flex flex-col items-center justify-center gap-4">
            <Loader2 className="w-8 h-8 animate-spin text-black" />
            <p className="text-sm text-gray-600 font-light">
              Đang tải danh sách yêu thích...
            </p>
          </div>
        </Container>
      </div>
    );
  }

  return (
    <div className="bg-white min-h-screen">
      <Container>
        <div className="px-4 py-12 sm:px-6 lg:px-8">
          {/* Header Section - Modern 2025 Style */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mb-12"
          >
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6 mb-8">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-gray-50 border border-gray-200 rounded-none">
                  <Heart className="w-6 h-6 text-red-500 fill-red-500" />
                </div>
                <div>
                  <h1 className="text-3xl md:text-4xl lg:text-5xl font-light text-black uppercase tracking-tight leading-tight">
                    Sản phẩm yêu thích
                  </h1>
                  <p className="text-sm text-gray-500 font-light mt-2">
                    {products.length > 0
                      ? `${products.length} sản phẩm trong danh sách yêu thích`
                      : "Chưa có sản phẩm yêu thích"}
                  </p>
                </div>
              </div>

              {/* View Mode & Sort Controls */}
              {products.length > 0 && (
                <div className="flex items-center gap-3">
                  {/* Sort Dropdown */}
                  <div className="flex items-center gap-2 border border-gray-300 rounded-none bg-white">
                    <ArrowUpDown className="w-4 h-4 text-gray-600 ml-3" />
                    <select
                      value={sortBy}
                      onChange={(e) =>
                        setSortBy(e.target.value as "name" | "price" | "newest")
                      }
                      className="appearance-none bg-transparent border-0 py-2 pr-4 pl-2 text-sm font-light text-black focus:outline-none cursor-pointer"
                    >
                      <option value="newest">Mới nhất</option>
                      <option value="name">Tên A-Z</option>
                      <option value="price">Giá tăng dần</option>
                    </select>
                  </div>

                  {/* View Mode Toggle */}
                  <div className="flex items-center border border-gray-300 rounded-none bg-white overflow-hidden">
                    <button
                      onClick={() => setViewMode("grid")}
                      className={cn(
                        "p-2 transition-colors",
                        viewMode === "grid"
                          ? "bg-black text-white"
                          : "bg-white text-black hover:bg-gray-50"
                      )}
                      aria-label="Xem dạng lưới"
                    >
                      <Grid3x3 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => setViewMode("list")}
                      className={cn(
                        "p-2 transition-colors",
                        viewMode === "list"
                          ? "bg-black text-white"
                          : "bg-white text-black hover:bg-gray-50"
                      )}
                      aria-label="Xem dạng danh sách"
                    >
                      <List className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )}
            </div>
          </motion.div>

          {/* Products Section */}
          <AnimatePresence mode="wait">
            {products.length === 0 ? (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.5 }}
                className="py-24 text-center"
              >
                <div className="max-w-md mx-auto space-y-6">
                  <div className="flex justify-center">
                    <div className="p-6 bg-gray-50 border border-gray-200 rounded-none">
                      <Heart className="w-16 h-16 text-gray-300" />
                    </div>
                  </div>
                  <div className="space-y-3">
                    <h2 className="text-2xl font-light text-black uppercase tracking-wider">
                      Danh sách yêu thích trống
                    </h2>
                    <p className="text-gray-600 font-light leading-relaxed">
                      Bạn chưa có sản phẩm nào trong danh sách yêu thích.
                      <br />
                      Hãy khám phá và thêm những sản phẩm bạn yêu thích!
                    </p>
                  </div>
                  <div className="pt-4">
                    <Link href="/">
                      <Button className="bg-black text-white hover:bg-gray-900 rounded-none px-8 py-3 text-sm font-light uppercase tracking-wider transition-all duration-300">
                        <Sparkles className="w-4 h-4 mr-2" />
                        Khám phá sản phẩm
                      </Button>
                    </Link>
                  </div>
                </div>
              </motion.div>
            ) : (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.5 }}
              >
                <ProductList title="" items={products} />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </Container>
    </div>
  );
};

export default WishlistPage;
