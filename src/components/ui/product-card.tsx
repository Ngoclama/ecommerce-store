"use client";

import { Product } from "@/types";
import Image from "next/image";
import React, { useState, MouseEvent, MouseEventHandler, useMemo } from "react";
import { useRouter } from "next/navigation";
import { Heart, ShoppingBag, Eye, Zap, TrendingUp } from "lucide-react";
import IconButton from "./icon-button";
import useCart from "@/hooks/use-cart";
import { AnimatePresence, motion } from "framer-motion";
import { Button } from "./button";
import PopoverProduct from "../popover-product";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { useCartAnimation } from "@/contexts/cart-animation-context";

interface ProductCardProps {
  data: Product;
  isWishlistActive: boolean;
  onToggleFavorite: (productId: string) => void;
}

const ProductCard: React.FC<ProductCardProps> = ({
  data,
  isWishlistActive,
  onToggleFavorite,
}) => {
  const router = useRouter();
  const [imageError, setImageError] = useState(false);
  const [quickViewOpen, setQuickViewOpen] = useState(false);
  const [imageIndex, setImageIndex] = useState(0);
  const [isNavigating, setIsNavigating] = useState(false);
  const cart = useCart();
  const { triggerAnimation } = useCartAnimation();
  const addToCartButtonRef = React.useRef<HTMLButtonElement>(null);

  const productInventory = useMemo(() => {
    if (data.variants && data.variants.length > 0) {
      return data.variants.reduce(
        (sum, variant) => sum + (variant.inventory || 0),
        0
      );
    }
    return data.inventory ?? 0;
  }, [data.variants, data.inventory]);

  const discountPercent = useMemo(() => {
    if (data.originalPrice && data.price && data.originalPrice > data.price) {
      return Math.round(
        ((data.originalPrice - data.price) / data.originalPrice) * 100
      );
    }
    return 0;
  }, [data.originalPrice, data.price]);

  const images = data.images || [];
  
  const primaryImage =
    images[0]?.url && images[0].url.trim()
      ? images[0].url.trim()
      : "/placeholder.svg";
  const secondaryImage =
    images[1]?.url && images[1].url.trim()
      ? images[1].url.trim()
      : primaryImage;
  const hasMultipleImages = images.length > 1;

  const availableSizes = useMemo(() => {
    if (data.variants && data.variants.length > 0) {
      const sizes = new Map<
        string,
        { id: string; name: string; value: string }
      >();
      data.variants.forEach((v) => {
        if (v.size && !sizes.has(v.size.id)) {
          sizes.set(v.size.id, v.size);
        }
      });
      return Array.from(sizes.values());
    }
    if (data.size) {
      return [data.size];
    }
    return [];
  }, [data.variants, data.size]);

  const availableColors = useMemo(() => {
    if (data.variants && data.variants.length > 0) {
      const colors = new Map<
        string,
        { id: string; name: string; value: string }
      >();
      data.variants.forEach((v) => {
        if (v.color && !colors.has(v.color.id)) {
          colors.set(v.color.id, v.color);
        }
      });
      return Array.from(colors.values());
    }
    if (data.color) {
      return [data.color];
    }
    return [];
  }, [data.variants, data.color]);

  const isOutOfStock = productInventory <= 0;
  const isLowStock = productInventory > 0 && productInventory <= 5;

  
  const formatVND = (value: number) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
      minimumFractionDigits: 0,
    }).format(value);
  };

  const onAddToCart: MouseEventHandler<HTMLButtonElement> = (e) => {
    e.stopPropagation();

    if (productInventory <= 0) {
      toast.error("Sản phẩm đã hết hàng");
      return;
    }

    if (data.variants && data.variants.length > 0) {
      router.push(`/product/${data.id}`);
      toast.info("Vui lòng chọn size và màu sắc");
      return;
    }

    // Trigger animation
    if (addToCartButtonRef.current && primaryImage) {
      // Sử dụng setTimeout nhỏ để đảm bảo button ref đã sẵn sàng
      setTimeout(() => {
        triggerAnimation(primaryImage, addToCartButtonRef.current);
      }, 0);
    }

    setTimeout(() => {
      cart.addItem(data);
      toast.success("Đã thêm vào giỏ hàng");
    }, 100);
  };

  const handleFavorite: MouseEventHandler<HTMLButtonElement> = (e) => {
    e.stopPropagation();
    onToggleFavorite(data.id);
  };

  const handleClick = () => {
    if (isNavigating) {
      return;
    }
    setIsNavigating(true);
    router.push(`/product/${data.id}`);
  };

  const handleQuickView = (e: MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    setQuickViewOpen(true);
  };

  const handleBuyNow: MouseEventHandler<HTMLButtonElement> = (e) => {
    e.stopPropagation();

    if (isNavigating) {
      return;
    }

    if (productInventory <= 0) {
      toast.error("Sản phẩm đã hết hàng");
      return;
    }

    if (data.variants && data.variants.length > 0) {
      setIsNavigating(true);
      router.push(`/product/${data.id}`);
      toast.info("Vui lòng chọn size và màu sắc");
      return;
    }

    setIsNavigating(true);
    cart.addItem(data);
    toast.success("Đã thêm vào giỏ hàng");
    router.push("/cart");
  };

  const handleImageHover = () => {
    if (hasMultipleImages) {
      setImageIndex(1);
    }
  };

  const handleImageLeave = () => {
    setImageIndex(0);
  };

  return (
    <>
      <PopoverProduct
        product={data}
        isOpen={quickViewOpen}
        onClose={() => setQuickViewOpen(false)}
      />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className={cn(
          "group relative bg-white dark:bg-gray-800 transition-all duration-300 w-full",
          isOutOfStock && "opacity-60"
        )}
        onMouseEnter={handleImageHover}
        onMouseLeave={handleImageLeave}
      >
        {/* IMAGE CONTAINER */}
        <div
          className="relative aspect-3/4 bg-gray-50 dark:bg-gray-900 overflow-hidden border border-gray-200 dark:border-gray-700 cursor-pointer"
          onClick={handleClick}
        >
          {}
          <AnimatePresence mode="wait">
            <motion.div
              key={imageIndex}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.4 }}
              className="absolute inset-0"
            >
              <Image
                src={
                  imageError
                    ? "/placeholder.svg"
                    : imageIndex === 0
                    ? primaryImage
                    : secondaryImage
                }
                alt={data.name}
                fill
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                className="object-cover transition-transform duration-700 group-hover:scale-110"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  if (target.src !== "/placeholder.svg") {
                    target.src = "/placeholder.svg";
                    setImageError(true);
                  }
                }}
              />
            </motion.div>
          </AnimatePresence>

          {/* BADGES - Top Left */}
          <div className="absolute top-4 left-4 z-20 flex flex-col gap-2">
            {discountPercent > 0 && (
              <motion.span
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="px-3 py-1.5 bg-gray-400 text-white text-sm font-light uppercase tracking-wide rounded-none"
              >
                -{discountPercent}%
              </motion.span>
            )}
            {isOutOfStock && (
              <motion.span
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="px-3 py-1.5 bg-white dark:bg-gray-800 text-black dark:text-white text-sm font-light uppercase border border-black dark:border-white rounded-none"
              >
                Hết hàng
              </motion.span>
            )}
            {isLowStock && !isOutOfStock && (
              <motion.span
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="px-3 py-1.5 bg-yellow-500 text-black text-sm font-light uppercase rounded-none"
              >
                Sắp hết
              </motion.span>
            )}
          </div>

          {/* FAVORITE BUTTON - Top Right */}
          <div className="absolute top-4 right-4 z-20">
            <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }}>
              <IconButton
                onClick={handleFavorite}
                icon={
                  <Heart
                    className={cn(
                      "w-6 h-6 transition-all duration-300",
                      isWishlistActive
                        ? "text-red-500 fill-red-500"
                        : "text-black"
                    )}
                  />
                }
                className="bg-white/90 dark:bg-gray-800/90 hover:bg-white dark:hover:bg-gray-800 border-0 rounded-none backdrop-blur-sm transition-all duration-300 shadow-sm"
                aria-label="Thêm vào yêu thích"
              />
            </motion.div>
          </div>

          {/* IMAGE INDICATOR - Bottom Left (if multiple images) */}
          {hasMultipleImages && (
            <div className="absolute bottom-4 left-4 z-20 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm px-3 py-1.5 rounded-none border border-gray-300 dark:border-gray-700">
              <span className="text-sm font-light text-black dark:text-white">
                {imageIndex + 1} / {images.length}
              </span>
            </div>
          )}

          {}
          <div
            className="absolute inset-x-0 bottom-0 bg-white/98 dark:bg-gray-800/98 backdrop-blur-sm border-t border-gray-200 dark:border-gray-700 p-2.5 space-y-1.5 opacity-0 group-hover:opacity-100 translate-y-5 group-hover:translate-y-0 transition-all duration-300 z-30"
            onClick={(e) => e.stopPropagation()}
          >
            <Button
              onClick={handleQuickView}
              variant="outline"
              size="default"
              className="w-full h-9 rounded-none border-gray-300 dark:border-gray-600 hover:border-black dark:hover:border-white text-black dark:text-white font-light uppercase tracking-wide text-[10px] leading-tight transition-all duration-300  dark:hover:bg-gray-700  dark:bg-gray-800 overflow-hidden flex items-center justify-center gap-1.5 px-2"
            >
              <Eye className="w-3.5 h-3.5 shrink-0" />
              <span className="truncate flex-1 min-w-0 text-center">
                Xem nhanh
              </span>
            </Button>
            <motion.div
              whileTap={{ scale: 0.95 }}
              transition={{ duration: 0.1 }}
            >
              <Button
                ref={addToCartButtonRef}
                onClick={onAddToCart}
                variant="outline"
                size="default"
                disabled={isOutOfStock}
                className={cn(
                  "w-full h-9 rounded-none border-gray-300 dark:border-gray-600 hover:border-black dark:hover:border-white text-black dark:text-white font-light uppercase tracking-wide text-[10px] leading-tight transition-all duration-300  dark:bg-gray-800 overflow-hidden flex items-center justify-center gap-1.5 px-2",
                  isOutOfStock && "opacity-40 cursor-not-allowed"
                )}
              >
                <ShoppingBag className="w-3.5 h-3.5 shrink-0" />
                <span className="truncate flex-1 min-w-0 text-center">
                  Thêm vào giỏ hàng
                </span>
              </Button>
            </motion.div>
            <Button
              onClick={handleBuyNow}
              variant="default"
              size="default"
              disabled={isOutOfStock}
              className={cn(
                "w-full h-9 rounded-none bg-gray-400 dark:bg-gray-500 text-white hover:bg-gray-900 dark:hover:bg-gray-900 hover:shadow-lg hover:shadow-gray-400/30 font-light uppercase tracking-wide text-[10px] leading-tight transition-all duration-300 ease-in-out overflow-hidden flex items-center justify-center gap-1.5 px-2 hover:scale-[1.01] active:scale-[0.99]",
                isOutOfStock && "opacity-40 cursor-not-allowed"
              )}
            >
              <Zap className="w-3.5 h-3.5 shrink-0" />
              <span className="truncate flex-1 min-w-0 text-center">
                Mua ngay
              </span>
            </Button>
          </div>

          {/* HOVER OVERLAY GRADIENT */}
          <div className="absolute inset-0 bg-linear-to-t from-black/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
        </div>

        {}
        <div className="pt-5 pb-4 px-3 space-y-3">
          {/* Product Name */}
          <h3
            className="text-lg font-light text-black dark:text-white uppercase tracking-wide line-clamp-2 min-h-14 cursor-pointer hover:text-gray-600 dark:hover:text-gray-400 transition-colors duration-300"
            onClick={handleClick}
          >
            {data.name}
          </h3>

          {/* Price Section */}
          <div className="flex items-baseline gap-3 flex-wrap">
            <span className="text-xl md:text-2xl font-light text-black dark:text-white">
              {formatVND(Number(data.price))}
            </span>
            {data.originalPrice && data.originalPrice > data.price && (
              <>
                <span className="text-base text-gray-500 dark:text-gray-400 line-through font-light">
                  {formatVND(Number(data.originalPrice))}
                </span>
                {discountPercent > 0 && (
                  <span className="text-base text-gray-600 dark:text-gray-400 font-light">
                    (-{discountPercent}%)
                  </span>
                )}
              </>
            )}
          </div>

          {}
          {isLowStock && !isOutOfStock && (
            <div className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-yellow-600" />
              <span className="text-base text-gray-600 dark:text-gray-400 font-light">
                Chỉ còn {productInventory} sản phẩm
              </span>
            </div>
          )}

          {}
          {(availableSizes.length > 0 || availableColors.length > 0) && (
            <div className="flex flex-wrap items-center gap-2 pt-1">
              {/* Sizes */}
              {availableSizes.length > 0 && (
                <div className="flex items-center gap-1.5">
                  <span className="text-xs text-gray-500 dark:text-gray-400 font-light uppercase tracking-wide">
                    Size:
                  </span>
                  <div className="flex flex-wrap gap-1">
                    {availableSizes.slice(0, 3).map((size) => (
                      <span
                        key={size.id}
                        className="px-2 py-0.5 text-xs font-light text-black dark:text-white border border-gray-300 dark:border-gray-600 rounded-none uppercase bg-white dark:bg-gray-800"
                      >
                        {size.name}
                      </span>
                    ))}
                    {availableSizes.length > 3 && (
                      <span className="px-2 py-0.5 text-xs font-light text-gray-500 dark:text-gray-400">
                        +{availableSizes.length - 3}
                      </span>
                    )}
                  </div>
                </div>
              )}

              {/* Colors */}
              {availableColors.length > 0 && (
                <div className="flex items-center gap-1.5">
                  <span className="text-xs text-gray-500 dark:text-gray-400 font-light uppercase tracking-wide">
                    Color:
                  </span>
                  <div className="flex flex-wrap gap-1.5 items-center">
                    {availableColors.slice(0, 3).map((color) => (
                      <div
                        key={color.id}
                        className="flex items-center gap-1"
                        title={color.name}
                      >
                        <div
                          className="w-4 h-4 border border-gray-300 dark:border-gray-600 rounded-none"
                          style={{
                            backgroundColor: color.value || "#ccc",
                          }}
                        />
                        <span className="text-xs font-light text-black dark:text-white uppercase hidden sm:inline">
                          {color.name}
                        </span>
                      </div>
                    ))}
                    {availableColors.length > 3 && (
                      <span className="text-xs font-light text-gray-500 dark:text-gray-400">
                        +{availableColors.length - 3}
                      </span>
                    )}
                  </div>
                </div>
              )}
            </div>
          )}

          {}
          {data.category && (
            <div className="pt-1">
              <span className="text-sm text-gray-500 dark:text-gray-400 font-light uppercase tracking-wide">
                {data.category.name}
              </span>
            </div>
          )}
        </div>
      </motion.div>
    </>
  );
};

export default ProductCard;
