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
  Heart,
  Package,
  Truck,
  ShieldCheck,
  TrendingUp,
  Star,
  Clock,
  Award,
  Gift,
  RefreshCw,
  Info as InfoIcon,
  AlertCircle,
} from "lucide-react";
import { Button } from "./ui/button";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { Input } from "./ui/input";
import { Badge } from "./ui/badge";
import { Separator } from "./ui/separator";
import { useState, useEffect, MouseEventHandler, useMemo, useRef } from "react";
import useCart from "@/hooks/use-cart";
import { useWishlist } from "@/hooks/use-wishlist";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import SizeGuide from "./size-guide";
import { useRouter } from "next/navigation";
import { useCartAnimation } from "@/contexts/cart-animation-context";
import { motion, AnimatePresence } from "framer-motion";

interface InfoProps {
  data: Product;
}

const Info: React.FC<InfoProps> = ({ data }) => {
  const [quantity, setQuantity] = useState(1);
  const [showShare, setShowShare] = useState(false);
  const [isNavigating, setIsNavigating] = useState(false);
  const router = useRouter();
  const cart = useCart();
  const wishlist = useWishlist();
  const { triggerAnimation } = useCartAnimation();
  const addToCartButtonRef = useRef<HTMLButtonElement>(null);
  const buyNowButtonRef = useRef<HTMLButtonElement>(null);

  // Check if product is in wishlist using cart's wishlistItems
  const isInWishlist = cart.wishlistItems.includes(data.id);

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

    // Trigger animation
    const primaryImage = data.images?.[0]?.url || "/placeholder.svg";
    if (addToCartButtonRef.current && primaryImage) {
      triggerAnimation(primaryImage, addToCartButtonRef.current);
    }

    cart.addItem(productData, quantity);

    setTimeout(() => {
      toast.success("Đã thêm vào giỏ hàng");

      if (
        typeof window !== "undefined" &&
        window.location.pathname === "/cart"
      ) {
        window.dispatchEvent(new CustomEvent("cart-updated"));
        router.refresh();
      }
    }, 100);
  };

  const handleBuyNow: MouseEventHandler<HTMLButtonElement> = (e) => {
    e.stopPropagation();

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

    const primaryImage = data.images?.[0]?.url || "/placeholder.svg";
    if (buyNowButtonRef.current && primaryImage) {
      triggerAnimation(primaryImage, buyNowButtonRef.current);
    }

    cart.addItem(productData, quantity);

    let retryCount = 0;
    const maxRetries = 5;

    const verifyAndNavigate = () => {
      try {
        const storageKey = "ecommerce-cart-wishlist-storage";
        const saved = localStorage.getItem(storageKey);
        if (saved) {
          const parsed = JSON.parse(saved);
          const savedItems = parsed?.state?.items || [];

          if (savedItems.length > 0) {
            window.dispatchEvent(
              new CustomEvent("cart-updated", {
                detail: { source: "buy-now" },
              })
            );
            router.push("/cart");
            return;
          }
        }

        if (retryCount < maxRetries) {
          retryCount++;
          setTimeout(verifyAndNavigate, 100);
        } else {
          console.warn("[Info] Max retries reached, navigating anyway");
          window.dispatchEvent(
            new CustomEvent("cart-updated", {
              detail: { source: "buy-now" },
            })
          );
          router.push("/cart");
        }
      } catch (error) {
        console.error("[Info] Error verifying cart state:", error);
        window.dispatchEvent(
          new CustomEvent("cart-updated", {
            detail: { source: "buy-now" },
          })
        );
        router.push("/cart");
      }
    };

    setTimeout(verifyAndNavigate, 150);
  };

  const formatVND = (value: number) => {
    return new Intl.NumberFormat("vi-VN").format(value) + "₫";
  };

  // Toggle wishlist
  const onToggleWishlist: MouseEventHandler<HTMLButtonElement> = (e) => {
    e.stopPropagation();

    // Use async wishlist toggle from hook
    wishlist.toggleWishlist(data.id);
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
    <div className="space-y-8 lg:space-y-12">
      {/* Header Section - Luxury Style */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="space-y-6"
      >
        <div className="flex items-start justify-between gap-6">
          <div className="flex-1 space-y-4">
            {data.category && (
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.1 }}
                className="inline-flex items-center gap-2 px-4 py-2 bg-neutral-900 dark:bg-neutral-100 text-white dark:text-neutral-900 rounded-sm border-2 border-neutral-900 dark:border-neutral-100"
              >
                <span className="text-xs font-light uppercase tracking-[0.15em]">
                  {data.category.name}
                </span>
              </motion.div>
            )}

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="text-4xl md:text-5xl lg:text-6xl font-light text-neutral-900 dark:text-neutral-100 leading-[1.1] tracking-tight uppercase"
            >
              {data.name}
            </motion.h1>

            <div className="flex flex-wrap items-center gap-2">
              {discountPercent > 0 && (
                <motion.div
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-red-600 dark:bg-red-500 text-white rounded-none"
                >
                  <Sparkles className="w-3 h-3" />
                  <span className="text-xs font-medium uppercase tracking-wide">
                    -{discountPercent}%
                  </span>
                </motion.div>
              )}

              {data.createdAt &&
                new Date(data.createdAt).getTime() >
                  Date.now() - 7 * 24 * 60 * 60 * 1000 && (
                  <Badge
                    variant="outline"
                    className="border-green-600 dark:border-green-500 text-green-600 dark:text-green-500 rounded-none text-xs font-light"
                  >
                    <TrendingUp className="w-3 h-3 mr-1" />
                    Mới
                  </Badge>
                )}

              {data.isFeatured && (
                <Badge
                  variant="outline"
                  className="border-slate-400 dark:border-slate-500 bg-gradient-to-r from-slate-50 to-slate-100 dark:from-slate-900/50 dark:to-slate-800/50 text-slate-600 dark:text-slate-400 rounded-none text-xs font-light shadow-sm"
                >
                  <Award className="w-3 h-3 mr-1" />
                  Bán chạy
                </Badge>
              )}
            </div>
          </div>

          <motion.button
            onClick={onToggleWishlist}
            whileTap={{ scale: 0.9 }}
            className={cn(
              "flex-shrink-0 w-11 h-11 flex items-center justify-center border rounded-none transition-all duration-200",
              isInWishlist
                ? "border-red-600 dark:border-red-500 bg-red-600 dark:bg-red-500 text-white"
                : "border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:border-red-600 dark:hover:border-red-500 hover:text-red-600 dark:hover:text-red-500"
            )}
          >
            <Heart
              className={cn(
                "w-5 h-5 transition-all",
                isInWishlist && "fill-current"
              )}
            />
          </motion.button>
        </div>
      </motion.div>

      {/* Price Section - Luxury Style */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.3 }}
        className="space-y-6 pb-8 border-b-2 border-neutral-200 dark:border-neutral-800"
      >
        <div className="flex items-baseline gap-6 flex-wrap">
          <motion.span
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="text-5xl md:text-6xl lg:text-7xl font-light text-neutral-900 dark:text-neutral-100 tracking-tight"
          >
            {formatVND(currentPrice)}
          </motion.span>
          {data.originalPrice && data.originalPrice > data.price && (
            <motion.div
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.5 }}
              className="flex flex-col gap-2"
            >
              <span className="text-lg text-neutral-400 dark:text-neutral-500 line-through font-light">
                {formatVND(data.originalPrice)}
              </span>
              <span className="text-sm text-green-600 dark:text-green-400 font-light tracking-wide">
                Tiết kiệm {formatVND(data.originalPrice - data.price)}
              </span>
            </motion.div>
          )}
        </div>

        <AnimatePresence>
          {quantity > 1 && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="flex items-center gap-3 pt-3 border-t border-gray-100 dark:border-gray-800 overflow-hidden"
            >
              <span className="text-xs text-gray-800 dark:text-gray-400 font-light">
                Tổng cộng ({quantity} sản phẩm):
              </span>
              <span className="text-xl text-black dark:text-white font-light tracking-tight">
                {formatVND(currentPrice * quantity)}
              </span>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="flex items-center justify-between gap-4 pt-2">
          <div className="flex items-center gap-6">
            {isOutOfStock ? (
              <div className="flex items-center gap-2 text-xs text-red-600 dark:text-red-400 font-light">
                <AlertCircle className="w-4 h-4" />
                <span className="font-medium">Hết hàng</span>
              </div>
            ) : currentInventory <= 5 ? (
              <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400 font-light">
                <motion.span
                  animate={{
                    scale: [1, 1.2, 1],
                    opacity: [0.6, 1, 0.6],
                  }}
                  transition={{ repeat: Infinity, duration: 2 }}
                  className="w-2 h-2 bg-gradient-to-r from-slate-400 to-slate-500 dark:from-slate-500 dark:to-slate-400 rounded-full shadow-lg shadow-slate-400/50 dark:shadow-slate-500/30"
                />
                <span className="font-medium bg-gradient-to-r from-slate-600 to-slate-500 dark:from-slate-400 dark:to-slate-300 bg-clip-text text-transparent">
                  Chỉ còn {currentInventory} sản phẩm
                </span>
              </div>
            ) : (
              <div className="flex items-center gap-2 text-xs text-green-600 dark:text-green-400 font-light">
                <Check className="w-4 h-4" />
                <span className="font-medium">Còn hàng</span>
              </div>
            )}

            {selectedVariant?.sku && (
              <span className="text-xs text-gray-500 dark:text-gray-400 font-light">
                SKU: {selectedVariant.sku}
              </span>
            )}
          </div>
        </div>
      </motion.div>

      {/* Trust Badges - Luxury Style */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.5 }}
        className="grid grid-cols-2 lg:grid-cols-4 gap-4"
      >
        {[
          {
            icon: Truck,
            title: "Giao hàng nhanh",
            desc: "2-3 ngày",
            delay: 0.1,
          },
          {
            icon: ShieldCheck,
            title: "Bảo hành",
            desc: "12 tháng",
            delay: 0.2,
          },
          { icon: RefreshCw, title: "Đổi trả", desc: "7 ngày", delay: 0.3 },
          {
            icon: Package,
            title: "Đóng gói",
            desc: "Chuyên nghiệp",
            delay: 0.4,
          },
        ].map(({ icon: Icon, title, desc, delay }, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 + delay }}
            whileHover={{ scale: 1.02, y: -2 }}
            className="flex items-center gap-3 p-4 bg-neutral-50 dark:bg-neutral-900/50 rounded-sm border-2 border-neutral-200 dark:border-neutral-800 hover:border-neutral-400 dark:hover:border-neutral-600 transition-all duration-300"
          >
            <div className="p-2 bg-white dark:bg-neutral-800 rounded-sm border border-neutral-200 dark:border-neutral-700">
              <Icon className="w-5 h-5 text-neutral-700 dark:text-neutral-300" />
            </div>
            <div className="flex flex-col">
              <span className="text-xs font-light text-neutral-900 dark:text-neutral-100 uppercase tracking-wide">
                {title}
              </span>
              <span className="text-[10px] text-neutral-600 dark:text-neutral-400 font-light">
                {desc}
              </span>
            </div>
          </motion.div>
        ))}
      </motion.div>

      <SizeGuide category={data.category?.name} />

      {/* SIZE Selection */}
      {availableSizes.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-light text-black dark:text-white uppercase tracking-wider">
              Kích thước
            </h3>
            {selectedSizeId && (
              <span className="text-xs text-gray-500 dark:text-gray-400 font-light">
                Đã chọn
              </span>
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
                      ? "border-slate-700 dark:border-slate-300 bg-slate-700 dark:bg-slate-300 text-white dark:text-slate-900 shadow-md"
                      : "border-slate-300 dark:border-slate-700 hover:border-slate-500 dark:hover:border-slate-500 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 hover:bg-slate-50 dark:hover:bg-slate-800",
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

      {/* COLOR Selection */}
      {availableColors.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-light text-black dark:text-white uppercase tracking-wider">
              Màu sắc
            </h3>
            {selectedColorId && (
              <span className="text-xs text-gray-500 dark:text-gray-400 font-light">
                Đã chọn
              </span>
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
                      ? "border-slate-700 dark:border-slate-300 bg-slate-700 dark:bg-slate-300 text-white dark:text-slate-900 shadow-md"
                      : "border-slate-300 dark:border-slate-700 hover:border-slate-500 dark:hover:border-slate-500 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 hover:bg-slate-50 dark:hover:bg-slate-800",
                    !variantAvailable && "opacity-40 cursor-not-allowed"
                  )}
                >
                  <div className="flex items-center gap-2">
                    <div
                      className="h-4 w-4 rounded-full border border-slate-300 dark:border-slate-600"
                      style={{ backgroundColor: color.value }}
                    />
                    {color.name}
                  </div>
                </ToggleGroupItem>
              );
            })}
          </ToggleGroup>
        </div>
      )}

      {/* Quantity */}
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

      {/* Action Buttons */}
      <div className="space-y-3 pt-2">
        {variants.length > 0 && (!selectedSizeId || !selectedColorId) && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            className="flex items-center gap-2 p-3 bg-gradient-to-r from-slate-50 to-blue-50/50 dark:from-slate-900/30 dark:to-blue-950/20 border border-slate-200 dark:border-slate-800 rounded-none shadow-sm"
          >
            <InfoIcon className="w-4 h-4 text-slate-600 dark:text-slate-400 flex-shrink-0" />
            <span className="text-xs text-slate-700 dark:text-slate-300 font-light">
              Vui lòng chọn {!selectedSizeId ? "kích thước" : ""}{" "}
              {!selectedSizeId && !selectedColorId ? "và" : ""}{" "}
              {!selectedColorId ? "màu sắc" : ""}
            </span>
          </motion.div>
        )}

        <div className="flex flex-col gap-3">
          <motion.div whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.98 }}>
            <Button
              ref={buyNowButtonRef}
              onClick={handleBuyNow}
              disabled={
                isOutOfStock ||
                (variants.length > 0 && (!selectedSizeId || !selectedColorId))
              }
              className={cn(
                "w-full h-12 rounded-none bg-gray-400 dark:bg-gray-500 text-white hover:bg-gray-900 dark:hover:bg-gray-700 hover:shadow-lg hover:shadow-gray-400/30 text-xs font-medium uppercase tracking-wider transition-all duration-300 ease-in-out shadow-sm hover:scale-[1.01] active:scale-[0.99]",
                (isOutOfStock ||
                  (variants.length > 0 &&
                    (!selectedSizeId || !selectedColorId))) &&
                  "opacity-50 cursor-not-allowed"
              )}
            >
              <Zap className="w-4 h-4 mr-2" />
              Mua ngay
            </Button>
          </motion.div>

          <motion.button
            ref={addToCartButtonRef}
            onClick={onAddToCart}
            disabled={
              isOutOfStock ||
              (variants.length > 0 && (!selectedSizeId || !selectedColorId))
            }
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.98 }}
            className={cn(
              "w-full h-12 rounded-none border-2 border-gray-400 dark:border-gray-500 hover:bg-gray-900 dark:hover:bg-gray-900 hover:border-gray-900 dark:hover:border-gray-900 hover:text-white hover:shadow-md hover:shadow-gray-400/20 text-xs font-medium uppercase tracking-wider transition-all duration-300 ease-in-out flex items-center justify-center gap-2 bg-transparent text-gray-600 dark:text-gray-300 hover:scale-[1.01] active:scale-[0.99]",
              (isOutOfStock ||
                (variants.length > 0 &&
                  (!selectedSizeId || !selectedColorId))) &&
                "opacity-50 cursor-not-allowed"
            )}
          >
            <ShoppingCart className="w-4 h-4" />
            Thêm vào giỏ hàng
          </motion.button>
        </div>
      </div>

      {/* Share Section */}
      <div className="space-y-4 pt-6 border-t border-gray-200 dark:border-gray-800">
        <h3 className="text-xs font-medium text-black dark:text-white uppercase tracking-wider">
          Chia sẻ sản phẩm
        </h3>
        <div className="flex flex-wrap gap-2">
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleShare("facebook")}
              className="flex items-center gap-2 border-gray-300 dark:border-gray-700 rounded-none hover:border-blue-600 dark:hover:border-blue-500 hover:bg-blue-50 dark:hover:bg-blue-950 hover:text-blue-600 dark:hover:text-blue-400 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 text-xs font-light h-9 transition-colors"
            >
              <Facebook className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Facebook</span>
            </Button>
          </motion.div>

          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleShare("messenger")}
              className="flex items-center gap-2 border-gray-300 dark:border-gray-700 rounded-none hover:border-blue-500 dark:hover:border-blue-400 hover:bg-blue-50 dark:hover:bg-blue-950 hover:text-blue-500 dark:hover:text-blue-400 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 text-xs font-light h-9 transition-colors"
            >
              <MessageCircle className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Messenger</span>
            </Button>
          </motion.div>

          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleShare("twitter")}
              className="flex items-center gap-2 border-gray-300 dark:border-gray-700 rounded-none hover:border-sky-500 dark:hover:border-sky-400 hover:bg-sky-50 dark:hover:bg-sky-950 hover:text-sky-500 dark:hover:text-sky-400 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 text-xs font-light h-9 transition-colors"
            >
              <Twitter className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Twitter</span>
            </Button>
          </motion.div>

          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleShare("copy")}
              className="flex items-center gap-2 border-gray-300 dark:border-gray-700 rounded-none hover:border-gray-900 dark:hover:border-gray-100 hover:bg-gray-50 dark:hover:bg-gray-700 hover:text-gray-900 dark:hover:text-gray-100 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 text-xs font-light h-9 transition-colors"
            >
              <LinkIcon className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Sao chép</span>
            </Button>
          </motion.div>
        </div>
      </div>

      {/* Product Description */}
      {data.description && (
        <div className="space-y-4 pt-6 border-t border-gray-200 dark:border-gray-800">
          <h3 className="text-xs font-medium text-black dark:text-white uppercase tracking-wider flex items-center gap-2">
            <Sparkles className="w-3.5 h-3.5" />
            Mô tả sản phẩm
          </h3>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="prose prose-sm dark:prose-invert max-w-none"
          >
            <div
              className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed whitespace-pre-wrap font-light [&_ul]:list-disc [&_ul]:pl-5 [&_ol]:list-decimal [&_ol]:pl-5 [&_li]:mb-1 [&_p]:mb-3 [&_strong]:font-medium [&_strong]:text-gray-900 [&_strong]:dark:text-gray-100"
              dangerouslySetInnerHTML={{ __html: data.description || "" }}
            />
          </motion.div>
        </div>
      )}

      {/* Additional Product Info */}
      <div className="space-y-4 pt-6 border-t border-gray-200 dark:border-gray-800">
        <h3 className="text-xs font-medium text-black dark:text-white uppercase tracking-wider">
          Thông tin thêm
        </h3>
        <div className="grid gap-3 text-xs">
          <div className="flex items-start gap-3 p-3 bg-gray-50 dark:bg-gray-900/50 rounded-none">
            <Package className="w-4 h-4 text-gray-600 dark:text-gray-400 flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <p className="font-medium text-gray-900 dark:text-gray-100 mb-1">
                Chính sách giao hàng
              </p>
              <p className="text-gray-600 dark:text-gray-400 font-light leading-relaxed">
                Giao hàng toàn quốc. Miễn phí vận chuyển cho đơn hàng từ
                500.000₫
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3 p-3 bg-gray-50 dark:bg-gray-900/50 rounded-none">
            <RefreshCw className="w-4 h-4 text-gray-600 dark:text-gray-400 flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <p className="font-medium text-gray-900 dark:text-gray-100 mb-1">
                Chính sách đổi trả
              </p>
              <p className="text-gray-600 dark:text-gray-400 font-light leading-relaxed">
                Đổi trả trong vòng 7 ngày nếu sản phẩm lỗi hoặc không đúng mô tả
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3 p-3 bg-gray-50 dark:bg-gray-900/50 rounded-none">
            <ShieldCheck className="w-4 h-4 text-gray-600 dark:text-gray-400 flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <p className="font-medium text-gray-900 dark:text-gray-100 mb-1">
                Bảo hành chính hãng
              </p>
              <p className="text-gray-600 dark:text-gray-400 font-light leading-relaxed">
                Bảo hành 12 tháng đối với lỗi từ nhà sản xuất
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Customer Support CTA */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="p-4 bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-900/50 dark:to-gray-800/50 border border-gray-200 dark:border-gray-800 rounded-none"
      >
        <div className="flex items-start gap-3">
          <InfoIcon className="w-5 h-5 text-gray-700 dark:text-gray-300 flex-shrink-0 mt-0.5" />
          <div className="flex-1">
            <p className="text-sm font-medium text-gray-900 dark:text-gray-100 mb-1">
              Cần hỗ trợ?
            </p>
            <p className="text-xs text-gray-600 dark:text-gray-400 font-light mb-3">
              Đội ngũ chăm sóc khách hàng luôn sẵn sàng hỗ trợ bạn 24/7
            </p>
            <a
              href="tel:0123456789"
              className="inline-flex items-center gap-2 text-xs font-medium text-black dark:text-white hover:underline"
            >
              <span>Hotline: 0123 456 789</span>
            </a>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Info;
