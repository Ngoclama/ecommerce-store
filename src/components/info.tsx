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

interface InfoProps {
  data: Product;
}

const Info: React.FC<InfoProps> = ({ data }) => {
  const [quantity, setQuantity] = useState(1);
  const [showShare, setShowShare] = useState(false);
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

    // Trigger animation
    const primaryImage = data.images?.[0]?.url || "/placeholder.svg";
    if (addToCartButtonRef.current && primaryImage) {
      setTimeout(() => {
        triggerAnimation(primaryImage, addToCartButtonRef.current);
      }, 0);
    }

    // Delay adding to cart slightly to show animation
    setTimeout(() => {
      cart.addItem(productData, quantity);
      toast.success("Đã thêm vào giỏ hàng");
    }, 100);
  };

  const handleBuyNow: MouseEventHandler<HTMLButtonElement> = (e) => {
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
    if (buyNowButtonRef.current && primaryImage) {
      setTimeout(() => {
        triggerAnimation(primaryImage, buyNowButtonRef.current);
      }, 0);
    }

    // Add to cart and redirect to checkout
    setTimeout(() => {
      cart.addItem(productData, quantity);
      router.push("/checkout");
    }, 100);
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
          <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-gray-50 border border-gray-200 rounded-none">
            <span className="text-xs font-light text-gray-600 uppercase tracking-wider">
              {data.category.name}
            </span>
          </div>
        )}

        {/* Title - Clean Typography */}
        <h1 className="text-3xl md:text-4xl lg:text-5xl font-light text-black leading-tight tracking-tight">
          {data.name}
        </h1>

        {/* Discount Badge - Subtle */}
        {discountPercent > 0 && (
          <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-black text-white rounded-none">
            <Sparkles className="w-3.5 h-3.5" />
            <span className="text-xs font-light uppercase tracking-wider">
              Giảm {discountPercent}%
            </span>
          </div>
        )}
      </div>

      {/* Price Section - Elegant Display */}
      <div className="space-y-3 pb-6 border-b border-gray-200">
        <div className="flex items-baseline gap-4">
          <span className="text-4xl md:text-5xl font-light text-black tracking-tight">
            {formatVND(currentPrice)}
          </span>
          {data.originalPrice && data.originalPrice > data.price && (
            <>
              <span className="text-lg text-gray-400 line-through font-light">
                {formatVND(data.originalPrice)}
              </span>
            </>
          )}
        </div>

        {/* Total Price when quantity > 1 */}
        {quantity > 1 && (
          <div className="flex items-center gap-3 pt-3 border-t border-gray-100">
            <span className="text-sm text-gray-600 font-light">
              Tổng cộng ({quantity} sản phẩm):
            </span>
            <span className="text-2xl text-black font-light tracking-tight">
              {formatVND(currentPrice * quantity)}
            </span>
          </div>
        )}

        {/* Stock Status */}
        {isOutOfStock ? (
          <div className="flex items-center gap-2 text-sm text-red-600 font-light">
            <span className="w-2 h-2 bg-red-600 rounded-full"></span>
            Hết hàng
          </div>
        ) : currentInventory <= 5 ? (
          <div className="flex items-center gap-2 text-sm text-amber-600 font-light">
            <span className="w-2 h-2 bg-amber-600 rounded-full animate-pulse"></span>
            Chỉ còn {currentInventory} sản phẩm
          </div>
        ) : (
          <div className="flex items-center gap-2 text-sm text-green-600 font-light">
            <Check className="w-4 h-4" />
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
            <h3 className="text-sm font-light text-black uppercase tracking-wider">
              Kích thước
            </h3>
            {selectedSizeId && (
              <span className="text-xs text-gray-500 font-light">Đã chọn</span>
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
                    "px-5 py-2.5 border rounded-none min-w-[70px] text-sm font-light transition-all duration-200",
                    selectedSizeId === size.id
                      ? "border-black bg-black text-white shadow-sm"
                      : "border-gray-300 hover:border-black bg-white text-black",
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
            <h3 className="text-sm font-light text-black uppercase tracking-wider">
              Màu sắc
            </h3>
            {selectedColorId && (
              <span className="text-xs text-gray-500 font-light">Đã chọn</span>
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
                    "px-5 py-2.5 border rounded-none min-w-[100px] text-sm font-light transition-all duration-200",
                    selectedColorId === color.id
                      ? "border-black bg-black text-white shadow-sm"
                      : "border-gray-300 hover:border-black bg-white text-black",
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
        <h3 className="text-sm font-light text-black uppercase tracking-wider">
          Số lượng
        </h3>
        <div className="flex items-center gap-4">
          <div className="flex items-center border border-gray-300 rounded-none overflow-hidden w-36 bg-white">
            <button
              onClick={() => setQuantity((prev) => (prev > 1 ? prev - 1 : 1))}
              disabled={quantity <= 1}
              className={cn(
                "flex-1 h-12 flex justify-center items-center text-black hover:bg-gray-50 transition-colors text-base font-light",
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
              className="flex-1 text-center border-0 focus-visible:ring-0 h-12 rounded-none text-base font-light"
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
                "flex-1 h-12 flex justify-center items-center text-black hover:bg-gray-50 transition-colors text-base font-light",
                quantity >= currentInventory && "opacity-40 cursor-not-allowed"
              )}
            >
              +
            </button>
          </div>
          {currentInventory > 0 && (
            <span className="text-sm text-gray-500 font-light">
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
            "w-full h-14 rounded-none bg-black text-white hover:bg-gray-900 text-sm font-light uppercase tracking-wider transition-all duration-200 shadow-sm",
            (isOutOfStock ||
              (variants.length > 0 && (!selectedSizeId || !selectedColorId))) &&
              "opacity-50 cursor-not-allowed"
          )}
        >
          <Zap className="w-4 h-4 mr-2" />
          Mua ngay
        </Button>
        <Button
          ref={addToCartButtonRef}
          onClick={onAddToCart}
          disabled={
            isOutOfStock ||
            (variants.length > 0 && (!selectedSizeId || !selectedColorId))
          }
          variant="outline"
          className={cn(
            "w-full h-14 rounded-none border-2 border-black hover:bg-black hover:text-white text-sm font-light uppercase tracking-wider transition-all duration-200",
            (isOutOfStock ||
              (variants.length > 0 && (!selectedSizeId || !selectedColorId))) &&
              "opacity-50 cursor-not-allowed"
          )}
        >
          <ShoppingCart className="w-4 h-4 mr-2" />
          Thêm vào giỏ hàng
        </Button>
      </div>

      {/* Share Section - Minimalist */}
      <div className="space-y-4 pt-6 border-t border-gray-200">
        <h3 className="text-sm font-light text-black uppercase tracking-wider">
          Chia sẻ
        </h3>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleShare("facebook")}
            className="flex items-center gap-2 border-gray-300 rounded-none hover:border-black text-xs font-light h-9"
          >
            <Facebook className="w-4 h-4" />
            Facebook
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleShare("messenger")}
            className="flex items-center gap-2 border-gray-300 rounded-none hover:border-black text-xs font-light h-9"
          >
            <MessageCircle className="w-4 h-4" />
            Messenger
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleShare("twitter")}
            className="flex items-center gap-2 border-gray-300 rounded-none hover:border-black text-xs font-light h-9"
          >
            <Twitter className="w-4 h-4" />
            Twitter
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleShare("copy")}
            className="flex items-center gap-2 border-gray-300 rounded-none hover:border-black text-xs font-light h-9"
          >
            <LinkIcon className="w-4 h-4" />
            Sao chép
          </Button>
        </div>
      </div>

      {/* Product Description - Clean Typography */}
      {data.description && (
        <div className="space-y-4 pt-6 border-t border-gray-200">
          <h3 className="text-sm font-light text-black uppercase tracking-wider">
            Mô tả sản phẩm
          </h3>
          <div
            className="text-sm text-gray-700 leading-relaxed whitespace-pre-wrap font-light"
            dangerouslySetInnerHTML={{ __html: data.description }}
          />
        </div>
      )}
    </div>
  );
};

export default Info;
