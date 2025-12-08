"use client";

import { Search, X, Loader2 } from "lucide-react";
import { useState, useEffect, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { useDebounce } from "@/hooks/use-debounce";
import Currency from "./ui/currency";

interface Product {
  id: string;
  name: string;
  slug: string;
  price: number;
  images: { url: string }[];
  category?: { name: string };
}

export const SearchDropdown = () => {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [products, setProducts] = useState<Product[]>([]);
  const searchRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const debouncedQuery = useDebounce(query, 300);

  
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        searchRef.current &&
        !searchRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  
  useEffect(() => {
    const fetchProducts = async () => {
      if (!debouncedQuery.trim()) {
        setProducts([]);
        setIsLoading(false);
        return;
      }

      setIsLoading(true);
      try {
        const apiUrl = process.env.NEXT_PUBLIC_API_URL;
        if (!apiUrl) {
          console.error("[SEARCH] NEXT_PUBLIC_API_URL is not configured");
          return;
        }

        const baseUrl = apiUrl.replace(/\/$/, "");
        const searchUrl = `${baseUrl}/api/products?q=${encodeURIComponent(
          debouncedQuery.trim()
        )}&limit=8`;

        const res = await fetch(searchUrl, {
          cache: "no-store",
        });

        if (!res.ok) {
          console.error("Failed to search products:", res.status);
          setProducts([]);
          return;
        }

        const data = await res.json();
        
        const productsData = Array.isArray(data) ? data : data.products || [];
        setProducts(productsData);
        setIsOpen(true);
      } catch (error) {
        console.error("Search error:", error);
        setProducts([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProducts();
  }, [debouncedQuery]);

  const handleClear = () => {
    setQuery("");
    setProducts([]);
    setIsOpen(false);
    inputRef.current?.focus();
  };

  const handleProductClick = (productSlug: string) => {
    setIsOpen(false);
    setQuery("");
    router.push(`/product/${productSlug}`);
  };

  const handleViewAll = () => {
    if (query.trim()) {
      setIsOpen(false);
      router.push(`/search?q=${encodeURIComponent(query.trim())}`);
    }
  };

  return (
    <div ref={searchRef} className="relative w-full">
      {}
      <div className="relative flex items-center border-b border-black dark:border-white pb-1">
        <Search className="w-4 h-4 text-black dark:text-white shrink-0" />
        <input
          ref={inputRef}
          type="text"
          placeholder="SEARCH"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => {
            if (products.length > 0) setIsOpen(true);
          }}
          className="border-0 outline-none bg-transparent text-sm font-light uppercase tracking-wider placeholder:text-gray-400 focus:ring-0 w-24 md:w-32 px-2 text-black dark:text-white"
        />
        {isLoading && (
          <Loader2 className="w-4 h-4 text-gray-400 animate-spin shrink-0" />
        )}
        {query && !isLoading && (
          <button
            onClick={handleClear}
            className="text-gray-400 hover:text-black dark:hover:text-white transition-colors"
            aria-label="Clear search"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Dropdown Results */}
      <AnimatePresence>
        {isOpen && products.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="absolute top-full right-0 mt-2 w-[90vw] md:w-[500px] bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 shadow-2xl z-50 max-h-[80vh] overflow-y-auto"
          >
            {/* Header */}
            <div className="px-4 py-3 border-b border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-950">
              <p className="text-xs font-medium uppercase tracking-wider text-gray-600 dark:text-gray-400">
                Kết quả tìm kiếm ({products.length})
              </p>
            </div>

            {}
            <div className="p-2">
              {products.map((product, index) => (
                <motion.button
                  key={product.id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                  onClick={() => handleProductClick(product.slug)}
                  className="w-full flex items-center gap-3 p-3 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors text-left group"
                >
                  {/* Product Image */}
                  <div className="relative w-16 h-16 bg-gray-100 dark:bg-gray-800 shrink-0 overflow-hidden">
                    {product.images[0]?.url ? (
                      <Image
                        src={product.images[0].url}
                        alt={product.name}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-200"
                        sizes="64px"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <Search className="w-6 h-6 text-gray-400" />
                      </div>
                    )}
                  </div>

                  {}
                  <div className="flex-1 min-w-0">
                    {product.category && (
                      <p className="text-[10px] font-light uppercase tracking-wider text-gray-400 mb-1">
                        {product.category.name}
                      </p>
                    )}
                    <h4 className="text-sm font-medium text-black dark:text-white line-clamp-1 mb-1 group-hover:text-gray-600 dark:group-hover:text-gray-400 transition-colors">
                      {product.name}
                    </h4>
                    <p className="text-sm font-medium text-black dark:text-white">
                      <Currency value={product.price} />
                    </p>
                  </div>

                  {}
                  <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                    <svg
                      className="w-4 h-4 text-gray-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 5l7 7-7 7"
                      />
                    </svg>
                  </div>
                </motion.button>
              ))}
            </div>

            {}
            <div className="px-4 py-3 border-t border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-950">
              <button
                onClick={handleViewAll}
                className="w-full text-sm font-medium text-black dark:text-white hover:text-gray-600 dark:hover:text-gray-400 transition-colors text-center uppercase tracking-wider"
              >
                Xem tất cả kết quả →
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* No Results */}
      <AnimatePresence>
        {isOpen && debouncedQuery && !isLoading && products.length === 0 && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="absolute top-full right-0 mt-2 w-[300px] bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 shadow-xl z-50 p-8 text-center"
          >
            <Search className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Không tìm thấy sản phẩm nào
            </p>
            <p className="text-xs text-gray-400 mt-1">Thử từ khóa khác</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
