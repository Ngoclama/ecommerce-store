"use client";

import { Product, ProductVariant } from "@/types";
import Image from "next/image";
import React, { MouseEventHandler, useEffect, useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { Button } from "./ui/button";
import {
  ShoppingCart,
  X,
  Gift,
  ChevronLeft,
  ChevronRight,
  ChevronUp,
  ChevronDown,
  Plus,
  Minus,
  Share2,
  Facebook,
  MessageCircle,
  Twitter,
  Link as LinkIcon,
  Heart,
} from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import Link from "next/link";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { Input } from "./ui/input";
import useCart from "@/hooks/use-cart";
import { useWishlist } from "@/hooks/use-wishlist";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import Currency from "./ui/currency";
import { useCartAnimation } from "@/contexts/cart-animation-context";

interface PopoverProductProps {
  product: Product;
  isOpen: boolean;
  onClose: () => void;
}

const PopoverProduct: React.FC<PopoverProductProps> = ({
  product,
  isOpen,
  onClose,
}) => {
  const router = useRouter();
  const cart = useCart();
  const { triggerAnimation } = useCartAnimation();
  const addToCartButtonRef = React.useRef<HTMLButtonElement>(null);
  const {
    toggleWishlist: toggleWishlistWithAuth,
    isItemInWishlist: checkWishlist,
  } = useWishlist();
  const [currentImage, setCurrentImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [showShare, setShowShare] = useState(false);
  const thumbnailScrollRef = React.useRef<HTMLDivElement>(null);
  const [canScrollUp, setCanScrollUp] = useState(true);
  const [canScrollDown, setCanScrollDown] = useState(true);

  // Variant selection state
  const [selectedSizeId, setSelectedSizeId] = useState<string | null>(null);
  const [selectedColorId, setSelectedColorId] = useState<string | null>(null);
  const [selectedMaterialId, setSelectedMaterialId] = useState<string | null>(
    null
  );

  // Get available variants
  const variants = product.variants || [];

  // Get unique sizes, colors from variants
  const availableSizes = useMemo(() => {
    const sizes = new Map<
      string,
      { id: string; name: string; value: string }
    >();
    variants.forEach((variant) => {
      if (variant.size) {
        sizes.set(variant.size.id, variant.size);
      }
    });
    return Array.from(sizes.values());
  }, [variants]);

  const availableColors = useMemo(() => {
    const colors = new Map<
      string,
      { id: string; name: string; value: string }
    >();
    variants.forEach((variant) => {
      if (variant.color) {
        colors.set(variant.color.id, variant.color);
      }
    });
    return Array.from(colors.values());
  }, [variants]);

  // Determine selected variant
  const selectedVariant = useMemo(() => {
    if (variants.length === 0) return null;

    return variants.find(
      (variant) =>
        (!selectedSizeId || variant.size?.id === selectedSizeId) &&
        (!selectedColorId || variant.color?.id === selectedColorId) &&
        (!selectedMaterialId || variant.material?.id === selectedMaterialId)
    );
  }, [variants, selectedSizeId, selectedColorId, selectedMaterialId]);

  // Set initial selections if variants exist
  useEffect(() => {
    if (variants.length > 0) {
      const firstVariant = variants[0];
      setSelectedSizeId(firstVariant.size?.id || null);
      setSelectedColorId(firstVariant.color?.id || null);
      setSelectedMaterialId(firstVariant.material?.id || null);
    }
  }, [variants]);

  // Get current price and inventory
  const currentPrice = selectedVariant?.price || product.price;
  const currentInventory = selectedVariant?.inventory ?? product.inventory ?? 0;
  const isOutOfStock = currentInventory <= 0;

  // Calculate discount
  const discountPercent =
    product.originalPrice &&
    product.price &&
    product.originalPrice > product.price
      ? Math.round(
          ((product.originalPrice - product.price) / product.originalPrice) *
            100
        )
      : 0;

  // Update quantity when inventory changes
  useEffect(() => {
    if (quantity > currentInventory && currentInventory > 0) {
      setQuantity(currentInventory);
    }
  }, [currentInventory, quantity]);

  // Reset when product changes
  useEffect(() => {
    if (isOpen) {
      setCurrentImage(0);
      setQuantity(1);
      setSelectedSizeId(null);
      setSelectedColorId(null);
      setSelectedMaterialId(null);
    }
  }, [product.id, isOpen]);

  const formatVND = (value: number) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
      minimumFractionDigits: 0,
    }).format(value);
  };

  const onAddToCart: MouseEventHandler<HTMLButtonElement> = (e) => {
    e.stopPropagation();

    if (variants.length > 0) {
      if (!selectedSizeId || !selectedColorId) {
        toast.error("Vui lòng chọn size và màu sắc");
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
      ...product,
      size: selectedVariant?.size || product.size,
      color: selectedVariant?.color || product.color,
      material: selectedVariant?.material || product.material,
      inventory: currentInventory,
      price: currentPrice,
    };

    // Trigger animation
    const primaryImage = product.images?.[0]?.url || "/placeholder.svg";
    if (addToCartButtonRef.current && primaryImage) {
      // Sử dụng setTimeout nhỏ để đảm bảo button ref đã sẵn sàng
      setTimeout(() => {
        triggerAnimation(primaryImage, addToCartButtonRef.current);
      }, 0);
    }

    // Delay adding to cart slightly to show animation
    setTimeout(() => {
      cart.addItem(productData, quantity);
      toast.success("Đã thêm vào giỏ hàng");
      onClose();
    }, 100);
  };

  const handleBuyNow: MouseEventHandler<HTMLButtonElement> = (e) => {
    e.stopPropagation();

    if (variants.length > 0) {
      if (!selectedSizeId || !selectedColorId) {
        toast.error("Vui lòng chọn size và màu sắc");
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
      ...product,
      size: selectedVariant?.size || product.size,
      color: selectedVariant?.color || product.color,
      material: selectedVariant?.material || product.material,
      inventory: currentInventory,
      price: currentPrice,
    };

    cart.addItem(productData, quantity);
    onClose();
    router.push("/checkout");
  };

  const handleShare = (type: string) => {
    const url = window.location.href;
    const title = product.name;
    const text = `Xem sản phẩm: ${product.name}`;

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
        toast.success("Đã sao chép link!");
        break;
    }
    setShowShare(false);
  };

  const nextImage = () => {
    if (product.images && product.images.length > 0) {
      setCurrentImage((prev) => (prev + 1) % product.images.length);
    }
  };

  const prevImage = () => {
    if (product.images && product.images.length > 0) {
      setCurrentImage(
        (prev) => (prev - 1 + product.images.length) % product.images.length
      );
    }
  };

  // Thumbnail scroll functions
  const scrollThumbnailsUp = () => {
    if (thumbnailScrollRef.current) {
      thumbnailScrollRef.current.scrollBy({
        top: -80,
        behavior: "smooth",
      });
    }
  };

  const scrollThumbnailsDown = () => {
    if (thumbnailScrollRef.current) {
      thumbnailScrollRef.current.scrollBy({
        top: 80,
        behavior: "smooth",
      });
    }
  };

  if (!product) return null;

  const images = product.images || [];
  const hasMultipleImages = images.length > 1;

  // Check scroll position to enable/disable buttons
  useEffect(() => {
    if (!isOpen) return;

    const checkScroll = () => {
      if (thumbnailScrollRef.current) {
        const { scrollTop, scrollHeight, clientHeight } =
          thumbnailScrollRef.current;
        setCanScrollUp(scrollTop > 0);
        setCanScrollDown(scrollTop < scrollHeight - clientHeight - 1);
      }
    };

    // Delay để đảm bảo DOM đã render
    const timeoutId = setTimeout(() => {
      checkScroll();
    }, 100);

    const scrollContainer = thumbnailScrollRef.current;
    if (scrollContainer) {
      scrollContainer.addEventListener("scroll", checkScroll);
      return () => {
        clearTimeout(timeoutId);
        scrollContainer.removeEventListener("scroll", checkScroll);
      };
    }

    return () => {
      clearTimeout(timeoutId);
    };
  }, [isOpen, product.images?.length]);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* BACKDROP */}
          <motion.div
            className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />

          {/* POPOVER */}
          <motion.div
            className="fixed top-1/2 left-1/2 z-50 w-[95%] max-w-6xl 
              -translate-x-1/2 -translate-y-1/2 bg-white 
              rounded-none border border-gray-300 overflow-hidden 
              flex flex-col md:flex-row max-h-[90vh]"
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            transition={{
              type: "spring",
              stiffness: 300,
              damping: 30,
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                onClose();
              }}
              className="absolute top-4 right-4 z-50 p-2 rounded-none bg-white hover:bg-gray-100 border border-gray-300 transition-colors"
              aria-label="Đóng"
            >
              <X className="w-5 h-5 text-black" />
            </button>

            {/* LEFT: IMAGE GALLERY */}
            <div className="md:w-1/2 w-full bg-gray-50 flex flex-row gap-3 p-3">
              {/* Thumbnails Sidebar - Left (Desktop) */}
              {hasMultipleImages && images.length > 1 && (
                <div className="hidden md:flex flex-col gap-2 items-center">
                  {/* Scroll Up Button */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      e.preventDefault();
                      scrollThumbnailsUp();
                    }}
                    disabled={!canScrollUp}
                    className={cn(
                      "p-1.5 bg-white border border-gray-300 rounded-none hover:bg-gray-50 transition-colors z-10 relative",
                      !canScrollUp && "opacity-30 cursor-not-allowed"
                    )}
                    aria-label="Scroll up"
                    type="button"
                  >
                    <ChevronUp className="w-4 h-4 text-black" />
                  </button>

                  {/* Thumbnails Container */}
                  <div
                    ref={thumbnailScrollRef}
                    className="flex flex-col gap-2 overflow-y-auto max-h-[600px] scrollbar-hide"
                  >
                    {images.map((img, idx) => (
                      <button
                        key={img.id}
                        onClick={(e) => {
                          e.stopPropagation();
                          setCurrentImage(idx);
                        }}
                        className={cn(
                          "relative w-16 h-16 border-2 rounded-none overflow-hidden shrink-0 transition-all",
                          idx === currentImage
                            ? "border-black"
                            : "border-gray-300 hover:border-gray-400"
                        )}
                      >
                        <Image
                          src={img.url}
                          alt={`Thumbnail ${idx + 1}`}
                          fill
                          className="object-cover"
                        />
                      </button>
                    ))}
                  </div>

                  {/* Scroll Down Button */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      e.preventDefault();
                      scrollThumbnailsDown();
                    }}
                    disabled={!canScrollDown}
                    className={cn(
                      "p-1.5 bg-white border border-gray-300 rounded-none hover:bg-gray-50 transition-colors z-10 relative",
                      !canScrollDown && "opacity-30 cursor-not-allowed"
                    )}
                    aria-label="Scroll down"
                    type="button"
                  >
                    <ChevronDown className="w-4 h-4 text-black" />
                  </button>
                </div>
              )}

              {/* Main Image Container */}
              <div className="flex-1 relative aspect-square bg-gray-100 overflow-hidden group">
                {images.length > 0 ? (
                  <>
                    <Image
                      src={images[currentImage]?.url || "/placeholder.svg"}
                      alt={product.name}
                      fill
                      className="object-cover transition-opacity duration-500"
                      priority
                    />

                    {/* Navigation Arrows */}
                    {hasMultipleImages && (
                      <>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            prevImage();
                          }}
                          className="absolute left-4 top-1/2 -translate-y-1/2 z-10 p-2 bg-white/90 hover:bg-white border border-gray-300 rounded-none opacity-0 group-hover:opacity-100 transition-opacity"
                          aria-label="Ảnh trước"
                        >
                          <ChevronLeft className="w-5 h-5 text-black" />
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            nextImage();
                          }}
                          className="absolute right-4 top-1/2 -translate-y-1/2 z-10 p-2 bg-white/90 hover:bg-white border border-gray-300 rounded-none opacity-0 group-hover:opacity-100 transition-opacity"
                          aria-label="Ảnh sau"
                        >
                          <ChevronRight className="w-5 h-5 text-black" />
                        </button>
                      </>
                    )}

                    {/* Image Counter */}
                    {hasMultipleImages && (
                      <div className="absolute bottom-4 right-4 bg-white/90 text-black border border-gray-300 px-3 py-1 text-xs rounded-none font-light">
                        {currentImage + 1} / {images.length}
                      </div>
                    )}

                    {/* Discount Badge */}
                    {discountPercent > 0 && (
                      <div className="absolute top-4 left-4 z-10">
                        <span className="px-2 py-1 bg-black text-white text-xs font-light uppercase rounded-none">
                          -{discountPercent}%
                        </span>
                      </div>
                    )}
                  </>
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <p className="text-gray-400 font-light">No Image</p>
                  </div>
                )}
              </div>
            </div>

            {/* Thumbnails - Mobile (Below main image) */}
            {hasMultipleImages && images.length > 1 && (
              <div className="md:hidden w-full bg-gray-50 border-t border-gray-200">
                <div className="flex gap-2 p-4 overflow-x-auto">
                  {images.map((img, idx) => (
                    <button
                      key={img.id}
                      onClick={(e) => {
                        e.stopPropagation();
                        setCurrentImage(idx);
                      }}
                      className={cn(
                        "relative w-16 h-16 border-2 rounded-none overflow-hidden shrink-0 transition-all",
                        idx === currentImage
                          ? "border-black"
                          : "border-gray-300 hover:border-gray-400"
                      )}
                    >
                      <Image
                        src={img.url}
                        alt={`Thumbnail ${idx + 1}`}
                        fill
                        className="object-cover"
                      />
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* RIGHT: PRODUCT INFO */}
            <div className="md:w-1/2 w-full p-6 md:p-8 flex flex-col gap-6 overflow-y-auto max-h-[90vh]">
              {/* Header */}
              <div>
                <Link
                  href={`/product/${product.id}`}
                  onClick={onClose}
                  className="text-2xl md:text-3xl text-black hover:text-gray-600 transition font-light uppercase tracking-wider leading-tight block"
                >
                  {product.name}
                </Link>
                {product.category && (
                  <p className="text-xs text-gray-600 mt-2 font-light uppercase tracking-wide">
                    {product.category.name}
                  </p>
                )}
              </div>

              {/* Price */}
              <div className="space-y-2 border-t border-b border-gray-200 py-4">
                <div className="flex items-baseline gap-4">
                  <span className="text-3xl md:text-4xl font-light text-black">
                    {formatVND(currentPrice)}
                  </span>
                  {product.originalPrice &&
                    product.originalPrice > product.price && (
                      <>
                        <span className="text-base text-gray-500 line-through font-light">
                          {formatVND(product.originalPrice)}
                        </span>
                        {discountPercent > 0 && (
                          <span className="text-sm text-gray-600 font-light">
                            -{discountPercent}%
                          </span>
                        )}
                      </>
                    )}
                </div>
                {quantity > 1 && (
                  <div className="flex items-center gap-3 pt-2 border-t border-gray-200">
                    <span className="text-sm text-gray-600 font-light">
                      Tổng tiền ({quantity} sản phẩm):
                    </span>
                    <span className="text-xl font-light text-black">
                      {formatVND(currentPrice * quantity)}
                    </span>
                  </div>
                )}
              </div>

              {/* Stock Status */}
              <div className="flex items-center gap-3">
                <span className="text-xs text-gray-600 uppercase font-light tracking-wide">
                  Tình trạng:
                </span>
                {isOutOfStock ? (
                  <span className="text-xs text-gray-600 font-light">
                    Hết hàng
                  </span>
                ) : (
                  <span className="text-xs text-black font-light">
                    Còn hàng ({currentInventory} sản phẩm)
                  </span>
                )}
              </div>

              {/* Variants */}
              {variants.length > 0 && (
                <div className="space-y-4">
                  {/* SIZE */}
                  {availableSizes.length > 0 && (
                    <div className="space-y-3">
                      <h3 className="text-xs font-light text-black uppercase tracking-wider">
                        Kích thước:
                      </h3>
                      <ToggleGroup
                        type="single"
                        value={selectedSizeId || ""}
                        onValueChange={(value) => {
                          if (value) {
                            setSelectedSizeId(value);
                            // Reset color if combination is invalid
                            if (selectedColorId) {
                              const matchingVariant = variants.find(
                                (v) =>
                                  v.size?.id === value &&
                                  v.color?.id === selectedColorId &&
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
                        className="flex flex-wrap gap-2"
                      >
                        {availableSizes.map((size) => {
                          const variantAvailable = variants.some(
                            (v) =>
                              v.size?.id === size.id &&
                              v.inventory > 0 &&
                              (!selectedColorId ||
                                v.color?.id === selectedColorId)
                          );
                          return (
                            <ToggleGroupItem
                              key={size.id}
                              value={size.id}
                              disabled={!variantAvailable}
                              className={cn(
                                "px-4 py-2 border border-gray-300 rounded-none min-w-[80px] uppercase text-xs font-light",
                                selectedSizeId === size.id
                                  ? "border-black bg-black text-white"
                                  : "border-gray-300 hover:border-black bg-white text-black",
                                !variantAvailable &&
                                  "opacity-50 cursor-not-allowed"
                              )}
                            >
                              {size.name}
                            </ToggleGroupItem>
                          );
                        })}
                      </ToggleGroup>
                    </div>
                  )}

                  {/* COLOR */}
                  {availableColors.length > 0 && (
                    <div className="space-y-3">
                      <h3 className="text-xs font-light text-black uppercase tracking-wider">
                        Màu sắc:
                      </h3>
                      <ToggleGroup
                        type="single"
                        value={selectedColorId || ""}
                        onValueChange={(value) => {
                          if (value) {
                            setSelectedColorId(value);
                            // Reset size if combination is invalid
                            if (selectedSizeId) {
                              const matchingVariant = variants.find(
                                (v) =>
                                  v.color?.id === value &&
                                  v.size?.id === selectedSizeId &&
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
                        className="flex flex-wrap gap-2"
                      >
                        {availableColors.map((color) => {
                          const variantAvailable = variants.some(
                            (v) =>
                              v.color?.id === color.id &&
                              v.inventory > 0 &&
                              (!selectedSizeId || v.size?.id === selectedSizeId)
                          );
                          return (
                            <ToggleGroupItem
                              key={color.id}
                              value={color.id}
                              disabled={!variantAvailable}
                              className={cn(
                                "px-4 py-2 border border-gray-300 rounded-none min-w-[80px] uppercase text-xs font-light",
                                selectedColorId === color.id
                                  ? "border-black bg-black text-white"
                                  : "border-gray-300 hover:border-black bg-white text-black",
                                !variantAvailable &&
                                  "opacity-50 cursor-not-allowed"
                              )}
                            >
                              {color.name}
                            </ToggleGroupItem>
                          );
                        })}
                      </ToggleGroup>
                    </div>
                  )}
                </div>
              )}

              {/* Quantity */}
              <div className="space-y-3">
                <h3 className="text-xs font-light text-black uppercase tracking-wider">
                  Số lượng:
                </h3>
                <div className="flex items-center gap-3">
                  <div className="flex items-center border border-gray-300 rounded-none overflow-hidden w-32 bg-white">
                    <button
                      onClick={() =>
                        setQuantity((prev) => (prev > 1 ? prev - 1 : 1))
                      }
                      disabled={quantity <= 1}
                      className={cn(
                        "flex-1 h-10 flex justify-center items-center text-black hover:bg-gray-100 transition text-sm font-light",
                        quantity <= 1 && "opacity-50 cursor-not-allowed"
                      )}
                    >
                      <Minus className="w-4 h-4" />
                    </button>
                    <Input
                      type="number"
                      value={quantity}
                      onChange={(e) => {
                        const val = parseInt(e.target.value) || 1;
                        setQuantity(
                          Math.max(1, Math.min(val, currentInventory || 1))
                        );
                      }}
                      className="flex-1 text-center border-0 focus-visible:ring-0 h-10 rounded-none text-sm font-light"
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
                        "flex-1 h-10 flex justify-center items-center text-black hover:bg-gray-100 transition text-sm font-light",
                        quantity >= currentInventory &&
                          "opacity-50 cursor-not-allowed"
                      )}
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col gap-3 pt-4">
                <Button
                  ref={addToCartButtonRef}
                  onClick={onAddToCart}
                  disabled={
                    isOutOfStock ||
                    (variants.length > 0 &&
                      (!selectedSizeId || !selectedColorId))
                  }
                  variant="default"
                  className="w-full rounded-none py-3 text-sm font-light uppercase tracking-wider"
                >
                  <ShoppingCart className="w-4 h-4 mr-2" />
                  Thêm vào giỏ hàng
                </Button>
                <Button
                  onClick={handleBuyNow}
                  disabled={
                    isOutOfStock ||
                    (variants.length > 0 &&
                      (!selectedSizeId || !selectedColorId))
                  }
                  variant="outline"
                  className="w-full rounded-none py-3 text-sm font-light uppercase tracking-wider border-black hover:bg-black hover:text-white"
                >
                  Mua ngay
                </Button>
              </div>

              {/* Share & Actions */}
              <div className="flex items-center gap-4 pt-4 border-t border-gray-200">
                <div className="relative">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowShare(!showShare)}
                    className="rounded-none text-black font-light uppercase tracking-wide text-xs"
                  >
                    <Share2 className="w-4 h-4 mr-2" />
                    Chia sẻ
                  </Button>
                  {showShare && (
                    <div className="absolute top-full left-0 mt-2 bg-white border border-gray-300 rounded-none p-2 flex gap-2 z-10">
                      <button
                        onClick={() => handleShare("facebook")}
                        className="p-2 hover:bg-gray-100 rounded-none transition"
                        aria-label="Facebook"
                      >
                        <Facebook className="w-4 h-4 text-black" />
                      </button>
                      <button
                        onClick={() => handleShare("messenger")}
                        className="p-2 hover:bg-gray-100 rounded-none transition"
                        aria-label="Messenger"
                      >
                        <MessageCircle className="w-4 h-4 text-black" />
                      </button>
                      <button
                        onClick={() => handleShare("twitter")}
                        className="p-2 hover:bg-gray-100 rounded-none transition"
                        aria-label="Twitter"
                      >
                        <Twitter className="w-4 h-4 text-black" />
                      </button>
                      <button
                        onClick={() => handleShare("copy")}
                        className="p-2 hover:bg-gray-100 rounded-none transition"
                        aria-label="Copy link"
                      >
                        <LinkIcon className="w-4 h-4 text-black" />
                      </button>
                    </div>
                  )}
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={async () => {
                    try {
                      await toggleWishlistWithAuth(product.id);
                    } catch (error) {
                      // Error đã được xử lý trong toggleWishlistWithAuth
                    }
                  }}
                  className="rounded-none text-black font-light uppercase tracking-wide text-xs"
                >
                  <Heart
                    className={cn(
                      "w-4 h-4 mr-2",
                      cart.isItemInWishlist(product.id) && "fill-black"
                    )}
                  />
                  Yêu thích
                </Button>
              </div>

              {/* Policies */}
              <div className="border border-gray-200 p-4 space-y-3 rounded-none bg-gray-50">
                <h3 className="text-xs font-light text-black uppercase tracking-wider">
                  Chính sách bán hàng
                </h3>
                <div className="space-y-2">
                  <div className="flex items-center gap-3 text-sm font-light">
                    <Gift className="w-4 h-4 text-black" />
                    <span className="text-gray-700">
                      Miễn phí ship với đơn hàng từ 500k
                    </span>
                  </div>
                  <div className="flex items-center gap-3 text-sm font-light">
                    <Gift className="w-4 h-4 text-black" />
                    <span className="text-gray-700">
                      Kiểm hàng trước khi thanh toán
                    </span>
                  </div>
                  <div className="flex items-center gap-3 text-sm font-light">
                    <Gift className="w-4 h-4 text-black" />
                    <span className="text-gray-700">Đổi trả trong 7 ngày</span>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default PopoverProduct;
