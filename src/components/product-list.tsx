"use client";

import { Product } from "@/types";
import NoResult from "./ui/result";
import ProductCard from "./ui/product-card";
import useCart from "@/hooks/use-cart";
import { useWishlist } from "@/hooks/use-wishlist";
import { useEffect, useState, useRef } from "react";

interface ProductListProps {
  title: string;
  items: Product[];
}

const ProductList: React.FC<ProductListProps> = ({ title, items }) => {
  // Sử dụng useWishlist hook để có authentication token
  const {
    toggleWishlist: toggleWishlistWithAuth,
    isItemInWishlist: checkWishlist,
    getAllWishlistItems,
  } = useWishlist();
  const { wishlistItems, setWishlist } = useCart();
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

  // Sync wishlist status từ server - gọi một lần để lấy tất cả
  useEffect(() => {
    // Nếu không có items, không cần sync
    if (items.length === 0) return;

    let isMounted = true;
    const syncWishlist = async () => {
      try {
        // Gọi API một lần để lấy tất cả wishlist items
        const allWishlistItems = await getAllWishlistItemsRef.current();

        if (!isMounted) return;

        // Tạo status map từ wishlist items
        const status: Record<string, boolean> = {};
        items.forEach((item) => {
          status[item.id] = allWishlistItems.includes(item.id);
        });

        setWishlistStatus(status);
      } catch (error) {
        // Nếu API fail, fallback to local storage
        if (isMounted) {
          const status: Record<string, boolean> = {};
          items.forEach((item) => {
            status[item.id] = wishlistItemsRef.current.includes(item.id);
          });
          setWishlistStatus(status);
        }
      }
    };

    syncWishlist();

    return () => {
      isMounted = false;
    };
  }, [items]); // Chỉ phụ thuộc vào items - sử dụng ref để tránh stale closure

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

  return (
    <div className="space-y-4">
      {title && (
        <h1 className="text-3xl md:text-4xl text-black mb-4">{title}</h1>
      )}
      {items.length === 0 && <NoResult />}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
        {items.map((item) => (
          <ProductCard
            key={item.id}
            data={item}
            
            isWishlistActive={
              wishlistStatus[item.id] ?? wishlistItems.includes(item.id)
            }
            
            onToggleFavorite={handleToggleFavorite}
          />
        ))}
      </div>
    </div>
  );
};

export default ProductList;
