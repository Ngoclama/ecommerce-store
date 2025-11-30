"use client";

import { Product, ProductVariant } from "@/types";
import {
  ShoppingCart,
  Share2,
  Facebook,
  MessageCircle,
  Twitter,
  Link as LinkIcon,
  Check,
  Sparkles,
  Zap,
} from "lucide-react";
import { Button } from "./ui/button";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { Input } from "./ui/input";
import { useState, useEffect, MouseEventHandler, useMemo, useRef } from "react";
import useCart from "@/hooks/use-cart";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import SizeGuide from "./size-guide";
import { useRouter } from "next/navigation";
import { useCartAnimation } from "@/contexts/cart-animation-context";
import { motion } from "framer-motion";

interface InfoProps {
  data: Product;
}

const Info: React.FC<InfoProps> = ({ data }) => {
  const [quantity, setQuantity] = useState(1);
  const [showShare, setShowShare] = useState(false);
  const [isNavigating, setIsNavigating] = useState(false);
  const router = useRouter();
  const cart = useCart();
  const { triggerAnimation } = useCartAnimation();
  const addToCartButtonRef = useRef<HTMLButtonElement>(null);
  const buyNowButtonRef = useRef<HTMLButtonElement>(null);

  // Variant selection state
  const [selectedSizeId, setSelectedSizeId] = useState<string | null>(null);
  const [selectedColorId, setSelectedColorId] = useState<string | null>(null);
  const [selectedMaterialId, setSelectedMaterialId] = useState<string | null>(
    null
  );

  // Get available variants
  const variants = data.variants || [];

  // Get unique sizes, colors, materials from variants
  const availableSizes = useMemo(() => {
    const sizes = new Map<
      string,
      { id: string; name: string; value: string }
    >();
    variants.forEach((v) => {
      if (!sizes.has(v.size.id)) {
        sizes.set(v.size.id, v.size);
      }
    });
    return Array.from(sizes.values());
  }, [variants]);

  const availableColors = useMemo(() => {
    const colors = new Map<
      string,
      { id: string; name: string; value: string }
    >();
    variants.forEach((v) => {
      if (!colors.has(v.color.id)) {
        colors.set(v.color.id, v.color);
      }
    });
    return Array.from(colors.values());
  }, [variants]);

  const availableMaterials = useMemo(() => {
    const materials = new Map<string, { id: string; name: string }>();
    variants.forEach((v) => {
      if (v.material && !materials.has(v.material.id)) {
        materials.set(v.material.id, v.material);
      }
    });
    return Array.from(materials.values());
  }, [variants]);

  // Find selected variant
  const selectedVariant = useMemo(() => {
    if (!selectedSizeId || !selectedColorId) return null;
    return (
      variants.find(
        (v) =>
          v.size.id === selectedSizeId &&
          v.color.id === selectedColorId &&
          (!selectedMaterialId || v.material?.id === selectedMaterialId)
      ) || null
    );
  }, [variants, selectedSizeId, selectedColorId, selectedMaterialId]);

  // Auto-select first variant if available
  useEffect(() => {
    if (variants.length > 0 && !selectedSizeId && !selectedColorId) {
      const firstVariant = variants[0];
      setSelectedSizeId(firstVariant.size.id);
      setSelectedColorId(firstVariant.color.id);
      if (firstVariant.material) {
        setSelectedMaterialId(firstVariant.material.id);
      }
    }
  }, [variants, selectedSizeId, selectedColorId]);

  // Get current price and inventory
  const currentPrice = selectedVariant?.price || data.price;
  const currentInventory = selectedVariant?.inventory ?? data.inventory ?? 0;
  const isOutOfStock = currentInventory <= 0;

  // Calculate discount
  const discountPercent =
    data.originalPrice && data.price && data.originalPrice > data.price
      ? Math.round(
          ((data.originalPrice - data.price) / data.originalPrice) * 100
        )
      : 0;

  // Update quantity when inventory changes
  useEffect(() => {
    if (quantity > currentInventory && currentInventory > 0) {
      setQuantity(currentInventory);
    }
  }, [currentInventory, quantity]);

  const onAddToCart: MouseEventHandler<HTMLButtonElement> = (e) => {
    e.stopPropagation();

    if (variants.length > 0) {
      if (!selectedSizeId || !selectedColorId) {
        toast.error("Vui lòng chọn kích thước và màu sắc");
        return;
      }
    }

    if (isOutOfStock) {
      toast.error("Sản phẩm đã hết hàng");
      return;
    }

    if (quantity > currentInventory) {
      toast.error(`Chỉ còn ${currentInventory} sản phẩm trong kho`);
      return;
    }

    const productData = {
      ...data,
      size: selectedVariant?.size || data.size,
      color: selectedVariant?.color || data.color,
      material: selectedVariant?.material || data.material,
      inventory: currentInventory,
      price: currentPrice,
    };

    // Trigger animation - thu nhỏ button trước, sau đó bay vào giỏ hàng
    const primaryImage = data.images?.[0]?.url || "/placeholder.svg";
    if (addToCartButtonRef.current && primaryImage) {
      // Trigger animation ngay lập tức để có hiệu ứng thu nhỏ và bay
      triggerAnimation(primaryImage, addToCartButtonRef.current);
    }

    // Add to cart immediately - Zustand will update state synchronously
    cart.addItem(productData, quantity);
    
    // Small delay for toast to show after animation starts
    setTimeout(() => {
      toast.success("Đã thêm vào giỏ hàng");
      
      // If we're on the cart page, refresh to show the new item
      if (typeof window !== "undefined" && window.location.pathname === "/cart") {
        router.refresh();
      }
    }, 100);
  };

  const handleBuyNow: MouseEventHandler<HTMLButtonElement> = (e) => {
    e.stopPropagation();

    // Guard để tránh double navigation
    if (isNavigating) {
      return;
    }

    if (variants.length > 0) {
      if (!selectedSizeId || !selectedColorId) {
        toast.error("Vui lòng chọn kích thước và màu sắc");
        return;
      }
    }

    if (isOutOfStock) {
      toast.error("Sản phẩm đã hết hàng");
      return;
    }

    if (quantity > currentInventory) {
      toast.error(`Chỉ còn ${currentInventory} sản phẩm trong kho`);
      return;
    }

    setIsNavigating(true);
    const productData = {
      ...data,
      size: selectedVariant?.size || data.size,
      color: selectedVariant?.color || data.color,
      material: selectedVariant?.material || data.material,
      inventory: currentInventory,
      price: currentPrice,
    };

    // Trigger animation
    const primaryImage = data.images?.[0]?.url || "/placeholder.svg";
    if (buyNowButtonRef.current && primaryImage) {
      triggerAnimation(primaryImage, buyNowButtonRef.current);
    }

    // Add to cart first, then navigate after a short delay to ensure state is persisted
    cart.addItem(productData, quantity);
    
    // Use a longer delay to ensure Zustand persist middleware has time to save to localStorage
    setTimeout(() => {
      router.push("/cart");
    }, 200);
  };

  const formatVND = (value: number) => {
    return new Intl.NumberFormat("vi-VN").format(value) + "₫";
  };

  const handleShare = (type: string) => {
    const url = window.location.href;
    const title = data.name;
    const text = `Xem sản phẩm: ${data.name}`;

    switch (type) {
      case "facebook":
        window.open(
          `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
            url
          )}`,
          "_blank"
        );
        break;
      case "messenger":
        window.open(
          `https://www.facebook.com/dialog/send?link=${encodeURIComponent(
            url
          )}&app_id=YOUR_APP_ID`,
          "_blank"
        );
        break;
      case "twitter":
        window.open(
          `https://twitter.com/intent/tweet?url=${encodeURIComponent(
            url
          )}&text=${encodeURIComponent(text)}`,
          "_blank"
        );
        break;
      case "copy":
        navigator.clipboard.writeText(url);
        toast.success("Đã sao chép liên kết!");
        break;
    }
    setShowShare(false);
  };

  return (
    <div className="space-y-8 lg:space-y-10">
      {/* Header Section - Modern 2025 Style */}
      <div className="space-y-4">
        {/* Category Badge */}
        {data.category && (
          <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-black dark:bg-white text-white dark:text-black rounded-none">
            <span className="text-xs font-light uppercase tracking-wider">
              {data.category.name}
            </span>
          </div>
        )}

        {/* Title - Clean Typography */}
        <h1 className="text-2xl md:text-3xl lg:text-4xl font-light text-black dark:text-white leading-tight tracking-tight">
          {data.name}
        </h1>

        {/* Discount Badge - Subtle */}
        {discountPercent > 0 && (
          <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-black dark:bg-white text-white dark:text-black rounded-none">
            <Sparkles className="w-3.5 h-3.5" />
            <span className="text-xs font-light uppercase tracking-wider">
              Giảm {discountPercent}%
            </span>
          </div>
        )}
      </div>

      {/* Price Section - Elegant Display */}
      <div className="space-y-3 pb-6 border-b border-gray-200 dark:border-gray-800">
        <div className="flex items-baseline gap-4">
          <span className="text-3xl md:text-4xl font-light text-black dark:text-white tracking-tight">
            {formatVND(currentPrice)}
          </span>
          {data.originalPrice && data.originalPrice > data.price && (
            <>
              <span className="text-base text-gray-400 dark:text-gray-500 line-through font-light">
                {formatVND(data.originalPrice)}
              </span>
            </>
          )}
        </div>

        {/* Total Price when quantity > 1 */}
        {quantity > 1 && (
          <div className="flex items-center gap-3 pt-3 border-t border-gray-100 dark:border-gray-800">
            <span className="text-xs text-gray-600 dark:text-gray-400 font-light">
              Tổng cộng ({quantity} sản phẩm):
            </span>
            <span className="text-xl text-black dark:text-white font-light tracking-tight">
              {formatVND(currentPrice * quantity)}
            </span>
          </div>
        )}

        {/* Stock Status */}
        {isOutOfStock ? (
          <div className="flex items-center gap-2 text-xs text-red-600 dark:text-red-400 font-light">
            <span className="w-2 h-2 bg-red-600 dark:bg-red-400 rounded-full"></span>
            Hết hàng
          </div>
        ) : currentInventory <= 5 ? (
          <div className="flex items-center gap-2 text-xs text-amber-600 dark:text-amber-400 font-light">
            <span className="w-2 h-2 bg-amber-600 dark:bg-amber-400 rounded-full animate-pulse"></span>
            Chỉ còn {currentInventory} sản phẩm
          </div>
        ) : (
          <div className="flex items-center gap-2 text-xs text-green-600 dark:text-green-400 font-light">
            <Check className="w-3.5 h-3.5" />
            Còn hàng
          </div>
        )}
      </div>

      {/* Size Guide */}
      <SizeGuide category={data.category?.name} />

      {/* SIZE Selection - Modern Toggle */}
      {availableSizes.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-light text-black dark:text-white uppercase tracking-wider">
              Kích thước
            </h3>
            {selectedSizeId && (
              <span className="text-xs text-gray-500 dark:text-gray-400 font-light">Đã chọn</span>
            )}
          </div>
          <ToggleGroup
            type="single"
            value={selectedSizeId || ""}
            onValueChange={(value) => {
              if (value) {
                setSelectedSizeId(value);
                if (selectedColorId) {
                  const matchingVariant = variants.find(
                    (v) =>
                      v.size.id === value &&
                      v.color.id === selectedColorId &&
                      v.inventory > 0
                  );
                  if (!matchingVariant) {
                    setSelectedColorId(null);
                  }
                }
              } else {
                setSelectedSizeId(null);
              }
            }}
            className="flex flex-wrap gap-2.5"
          >
            {availableSizes.map((size) => {
              const variantAvailable = variants.some(
                (v) =>
                  v.size.id === size.id &&
                  v.inventory > 0 &&
                  (!selectedColorId || v.color.id === selectedColorId)
              );
              return (
                <ToggleGroupItem
                  key={size.id}
                  value={size.id}
                  disabled={!variantAvailable}
                  className={cn(
                    "px-4 py-2 border rounded-none min-w-[70px] text-xs font-light transition-all duration-200",
                    selectedSizeId === size.id
                      ? "border-black dark:border-white bg-black dark:bg-white text-white dark:text-black shadow-sm"
                      : "border-gray-300 dark:border-gray-700 hover:border-black dark:hover:border-white bg-white dark:bg-gray-800 text-black dark:text-white",
                    !variantAvailable && "opacity-40 cursor-not-allowed"
                  )}
                >
                  {size.name}
                </ToggleGroupItem>
              );
            })}
          </ToggleGroup>
        </div>
      )}

      {/* COLOR Selection - Modern Toggle */}
      {availableColors.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-light text-black dark:text-white uppercase tracking-wider">
              Màu sắc
            </h3>
            {selectedColorId && (
              <span className="text-xs text-gray-500 dark:text-gray-400 font-light">Đã chọn</span>
            )}
          </div>
          <ToggleGroup
            type="single"
            value={selectedColorId || ""}
            onValueChange={(value) => {
              if (value) {
                setSelectedColorId(value);
                if (selectedSizeId) {
                  const matchingVariant = variants.find(
                    (v) =>
                      v.color.id === value &&
                      v.size.id === selectedSizeId &&
                      v.inventory > 0
                  );
                  if (!matchingVariant) {
                    setSelectedSizeId(null);
                  }
                }
              } else {
                setSelectedColorId(null);
              }
            }}
            className="flex flex-wrap gap-2.5"
          >
            {availableColors.map((color) => {
              const variantAvailable = variants.some(
                (v) =>
                  v.color.id === color.id &&
                  v.inventory > 0 &&
                  (!selectedSizeId || v.size.id === selectedSizeId)
              );
              return (
                <ToggleGroupItem
                  key={color.id}
                  value={color.id}
                  disabled={!variantAvailable}
                  className={cn(
                    "px-4 py-2 border rounded-none min-w-[100px] text-xs font-light transition-all duration-200",
                    selectedColorId === color.id
                      ? "border-black dark:border-white bg-black dark:bg-white text-white dark:text-black shadow-sm"
                      : "border-gray-300 dark:border-gray-700 hover:border-black dark:hover:border-white bg-white dark:bg-gray-800 text-black dark:text-white",
                    !variantAvailable && "opacity-40 cursor-not-allowed"
                  )}
                >
                  {color.name}
                </ToggleGroupItem>
              );
            })}
          </ToggleGroup>
        </div>
      )}

      {/* Quantity - Modern Input */}
      <div className="space-y-4">
        <h3 className="text-xs font-light text-black dark:text-white uppercase tracking-wider">
          Số lượng
        </h3>
        <div className="flex items-center gap-4">
          <div className="flex items-center border border-gray-300 dark:border-gray-700 rounded-none overflow-hidden w-36 bg-white dark:bg-gray-800">
            <button
              onClick={() => setQuantity((prev) => (prev > 1 ? prev - 1 : 1))}
              disabled={quantity <= 1}
              className={cn(
                "flex-1 h-12 flex justify-center items-center text-black dark:text-white hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors text-sm font-light",
                quantity <= 1 && "opacity-40 cursor-not-allowed"
              )}
            >
              −
            </button>
            <Input
              type="number"
              value={quantity}
              onChange={(e) => {
                const val = parseInt(e.target.value) || 1;
                setQuantity(Math.max(1, Math.min(val, currentInventory || 1)));
              }}
              className="flex-1 text-center border-0 focus-visible:ring-0 h-12 rounded-none text-sm font-light bg-white dark:bg-gray-800 text-black dark:text-white"
              min={1}
              max={currentInventory || 1}
            />
            <button
              onClick={() =>
                setQuantity((prev) =>
                  prev < currentInventory ? prev + 1 : prev
                )
              }
              disabled={quantity >= currentInventory}
              className={cn(
                "flex-1 h-12 flex justify-center items-center text-black dark:text-white hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors text-sm font-light",
                quantity >= currentInventory && "opacity-40 cursor-not-allowed"
              )}
            >
              +
            </button>
          </div>
          {currentInventory > 0 && (
            <span className="text-xs text-gray-500 dark:text-gray-400 font-light">
              Tối đa {currentInventory} sản phẩm
            </span>
          )}
        </div>
      </div>

      {/* Action Buttons - Modern 2025 Style */}
      <div className="flex flex-col gap-3 pt-2">
        <Button
          ref={buyNowButtonRef}
          onClick={handleBuyNow}
          disabled={
            isOutOfStock ||
            (variants.length > 0 && (!selectedSizeId || !selectedColorId))
          }
          className={cn(
            "w-full h-12 rounded-none bg-black dark:bg-white text-white dark:text-black hover:bg-gray-900 dark:hover:bg-gray-100 text-xs font-light uppercase tracking-wider transition-all duration-200 shadow-sm",
            (isOutOfStock ||
              (variants.length > 0 && (!selectedSizeId || !selectedColorId))) &&
              "opacity-50 cursor-not-allowed"
          )}
        >
          <Zap className="w-3.5 h-3.5 mr-2" />
          Mua ngay
        </Button>
        <motion.button
          ref={addToCartButtonRef}
          onClick={onAddToCart}
          disabled={
            isOutOfStock ||
            (variants.length > 0 && (!selectedSizeId || !selectedColorId))
          }
          whileTap={{ scale: 0.95 }}
          transition={{ duration: 0.1 }}
          className={cn(
            "w-full h-12 rounded-none border-2 border-black dark:border-white hover:bg-black dark:hover:bg-white hover:text-white dark:hover:text-black text-xs font-light uppercase tracking-wider transition-all duration-200 flex items-center justify-center gap-2 bg-transparent",
            (isOutOfStock ||
              (variants.length > 0 && (!selectedSizeId || !selectedColorId))) &&
              "opacity-50 cursor-not-allowed"
          )}
        >
          <ShoppingCart className="w-3.5 h-3.5" />
          Thêm vào giỏ hàng
        </motion.button>
      </div>

      {/* Share Section - Minimalist */}
      <div className="space-y-4 pt-6 border-t border-gray-200 dark:border-gray-800">
        <h3 className="text-xs font-light text-black dark:text-white uppercase tracking-wider">
          Chia sẻ
        </h3>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleShare("facebook")}
            className="flex items-center gap-2 border-gray-300 dark:border-gray-700 rounded-none hover:border-black dark:hover:border-white bg-white dark:bg-gray-800 text-black dark:text-white hover:bg-gray-50 dark:hover:bg-gray-700 text-xs font-light h-8"
          >
            <Facebook className="w-3.5 h-3.5" />
            Facebook
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleShare("messenger")}
            className="flex items-center gap-2 border-gray-300 dark:border-gray-700 rounded-none hover:border-black dark:hover:border-white bg-white dark:bg-gray-800 text-black dark:text-white hover:bg-gray-50 dark:hover:bg-gray-700 text-xs font-light h-8"
          >
            <MessageCircle className="w-3.5 h-3.5" />
            Messenger
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleShare("twitter")}
            className="flex items-center gap-2 border-gray-300 dark:border-gray-700 rounded-none hover:border-black dark:hover:border-white bg-white dark:bg-gray-800 text-black dark:text-white hover:bg-gray-50 dark:hover:bg-gray-700 text-xs font-light h-8"
          >
            <Twitter className="w-3.5 h-3.5" />
            Twitter
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleShare("copy")}
            className="flex items-center gap-2 border-gray-300 dark:border-gray-700 rounded-none hover:border-black dark:hover:border-white bg-white dark:bg-gray-800 text-black dark:text-white hover:bg-gray-50 dark:hover:bg-gray-700 text-xs font-light h-8"
          >
            <LinkIcon className="w-3.5 h-3.5" />
            Sao chép
          </Button>
        </div>
      </div>

      {/* Product Description - Clean Typography */}
      {data.description && (
        <div className="space-y-4 pt-6 border-t border-gray-200 dark:border-gray-800">
          <h3 className="text-xs font-light text-black dark:text-white uppercase tracking-wider">
            Mô tả sản phẩm
          </h3>
          <div
            className="text-xs text-gray-700 dark:text-gray-300 leading-relaxed whitespace-pre-wrap font-light"
            dangerouslySetInnerHTML={{ __html: data.description }}
          />
        </div>
      )}
    </div>
  );
};

export default Info;
