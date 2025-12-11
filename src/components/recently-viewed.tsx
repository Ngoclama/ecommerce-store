"use client";

import { useEffect, useState, useRef } from "react";
import { Product } from "@/types";
import ProductCard from "./ui/product-card";
import { X, Clock, Trash2 } from "lucide-react";
import { Button } from "./ui/button";
import useCart from "@/hooks/use-cart";
import { useWishlist } from "@/hooks/use-wishlist";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";

interface RecentlyViewedProps {
  currentProductId?: string;
}

const RecentlyViewed: React.FC<RecentlyViewedProps> = ({
  currentProductId,
}) => {
  const [viewedProducts, setViewedProducts] = useState<Product[]>([]);
  const { wishlistItems, setWishlist } = useCart();
  const { toggleWishlist: toggleWishlistWithAuth, getAllWishlistItems } =
    useWishlist();
  const [wishlistStatus, setWishlistStatus] = useState<Record<string, boolean>>(
    {}
  );

  // Sử dụng ref để tránh stale closure và đảm bảo dependencies array không đổi
  const getAllWishlistItemsRef = useRef(getAllWishlistItems);
  const wishlistItemsRef = useRef(wishlistItems);

  // Cập nhật ref khi giá trị thay đổi
  useEffect(() => {
    getAllWishlistItemsRef.current = getAllWishlistItems;
  }, [getAllWishlistItems]);

  useEffect(() => {
    wishlistItemsRef.current = wishlistItems;
  }, [wishlistItems]);

  // Sync wishlist status từ server
  useEffect(() => {
    if (viewedProducts.length === 0) return;

    let isMounted = true;
    const syncWishlist = async () => {
      try {
        const allWishlistItems = await getAllWishlistItemsRef.current();
        if (isMounted) {
          const status: Record<string, boolean> = {};
          viewedProducts.forEach((product) => {
            status[product.id] = allWishlistItems.includes(product.id);
          });
          setWishlistStatus(status);
        }
      } catch (error) {
        
        if (isMounted) {
          const status: Record<string, boolean> = {};
          viewedProducts.forEach((product) => {
            status[product.id] = wishlistItemsRef.current.includes(product.id);
          });
          setWishlistStatus(status);
        }
      }
    };

    syncWishlist();

    return () => {
      isMounted = false;
    };
  }, [viewedProducts]); // Chỉ phụ thuộc vào viewedProducts - sử dụng ref để tránh stale closure

  const handleToggleFavorite = async (productId: string) => {
    try {
      const newStatus = await toggleWishlistWithAuth(productId);
      
      setWishlistStatus((prev) => ({
        ...prev,
        [productId]: newStatus ?? !prev[productId],
      }));
      
      if (newStatus) {
        if (!wishlistItems.includes(productId)) {
          setWishlist([...wishlistItems, productId]);
        }
      } else {
        setWishlist(wishlistItems.filter((id) => id !== productId));
      }
    } catch (error) {
      // Error đã được xử lý trong toggleWishlistWithAuth
    }
  };

  useEffect(() => {
    if (currentProductId) {
      const stored = localStorage.getItem("recentlyViewed");
      const viewed = stored ? JSON.parse(stored) : [];

      
      const filtered = viewed.filter((p: Product) => p.id !== currentProductId);
      const currentProduct = viewed.find(
        (p: Product) => p.id === currentProductId
      );

      
      requestAnimationFrame(() => {
        if (currentProduct) {
          setViewedProducts([currentProduct, ...filtered].slice(0, 8));
        } else {
          setViewedProducts(viewed.slice(0, 8));
        }
      });
    } else {
      const stored = localStorage.getItem("recentlyViewed");
      setViewedProducts(stored ? JSON.parse(stored).slice(0, 8) : []);
    }
  }, [currentProductId]);

  const handleClear = () => {
    localStorage.removeItem("recentlyViewed");
    setViewedProducts([]);
  };

  if (viewedProducts.length === 0) {
    return null;
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="border-t border-gray-200 pt-10 mt-12"
    >
      {}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-gray-50 border border-gray-200 rounded-none">
            <Clock className="w-5 h-5 text-black" />
          </div>
          <div>
            <h3 className="text-2xl md:text-3xl font-light text-black uppercase tracking-wider">
              Sản phẩm đã xem
            </h3>
            <p className="text-xs text-gray-500 font-light mt-1">
              {viewedProducts.length} sản phẩm
            </p>
          </div>
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={handleClear}
          className="text-gray-600 hover:text-black hover:bg-gray-50 rounded-none transition-all duration-200 group"
        >
          <Trash2 className="w-4 h-4 mr-2 group-hover:scale-110 transition-transform" />
          <span className="text-xs font-light uppercase tracking-wider">
            Xóa tất cả
          </span>
        </Button>
      </div>

      {/* Products Grid - Modern Layout */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 md:gap-6">
        <AnimatePresence>
          {viewedProducts.map((product, index) => (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.3, delay: index * 0.05 }}
            >
              <ProductCard
                data={product}
                isWishlistActive={
                  wishlistStatus[product.id] ??
                  wishlistItems.includes(product.id)
                }
                onToggleFavorite={handleToggleFavorite}
              />
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </motion.div>
  );
};

export default RecentlyViewed;
