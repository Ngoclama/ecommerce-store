"use client";

import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import { Product } from "@/types";
import ProductCard from "@/components/ui/product-card";
import useCart from "@/hooks/use-cart";
import { useWishlist } from "@/hooks/use-wishlist";
import { useEffect, useState } from "react";

interface ProductSwiperProps {
  products: Product[];
}

const ProductSwiper: React.FC<ProductSwiperProps> = ({ products }) => {
  const { wishlistItems, setWishlist } = useCart();
  const {
    toggleWishlist: toggleWishlistWithAuth,
    isItemInWishlist: checkWishlist,
  } = useWishlist();
  const [wishlistStatus, setWishlistStatus] = useState<Record<string, boolean>>(
    {}
  );

  
  useEffect(() => {
    const syncWishlist = async () => {
      const status: Record<string, boolean> = {};
      for (const product of products) {
        try {
          const isInWishlist = await checkWishlist(product.id);
          status[product.id] = isInWishlist;
        } catch (error) {
          status[product.id] = wishlistItems.includes(product.id);
        }
      }
      setWishlistStatus(status);
    };

    if (products.length > 0) {
      syncWishlist();
    }
  }, [products, checkWishlist, wishlistItems]);

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
      // Error đã được xử lý
    }
  };

  return (
    <Swiper
      modules={[Navigation, Pagination, Autoplay]}
      spaceBetween={20}
      slidesPerView={1}
      navigation
      pagination={{ clickable: true }}
      autoplay={{ delay: 4000 }}
      breakpoints={{
        640: { slidesPerView: 2 },
        768: { slidesPerView: 3 },
        1024: { slidesPerView: 4 },
      }}
    >
      {products.map((product) => (
        <SwiperSlide key={product.id}>
          <ProductCard
            data={product}
            isWishlistActive={
              wishlistStatus[product.id] ?? wishlistItems.includes(product.id)
            }
            onToggleFavorite={handleToggleFavorite}
          />
        </SwiperSlide>
      ))}
    </Swiper>
  );
};

export default ProductSwiper;
