"use client";

import { Product, ProductVariant } from "@/types";
import Image from "next/image";
import React, { useEffect, useState, useMemo, useRef } from "react";
import { useRouter } from "next/navigation";
import { createPortal } from "react-dom";
import { Button } from "./ui/button";
import {
  ShoppingCart,
  X,
  ChevronLeft,
  ChevronRight,
  Plus,
  Minus,
  Share2,
  Heart,
  ZoomIn,
} from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import Link from "next/link";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import useCart from "@/hooks/use-cart";
import { useWishlist } from "@/hooks/use-wishlist";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
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
  const [mounted, setMounted] = useState(false);
  const {
    toggleWishlist: toggleWishlistWithAuth,
    isItemInWishlist: checkWishlist,
    getAllWishlistItems,
  } = useWishlist();

  // State
  const [currentImage, setCurrentImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [isInWishlist, setIsInWishlist] = useState(false);
  const [selectedSizeId, setSelectedSizeId] = useState<string | null>(null);
  const [selectedColorId, setSelectedColorId] = useState<string | null>(null);
  const [selectedMaterialId, setSelectedMaterialId] = useState<string | null>(
    null
  );
  const [isAddingToCart, setIsAddingToCart] = useState(false);

  // Refs
  const popoverRef = useRef<HTMLDivElement>(null);
  const thumbnailRef = useRef<HTMLDivElement>(null);

  // Get variants
  const variants = product.variants || [];
  const images = product.images || [];

  // Get unique sizes, colors, materials
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

  const availableMaterials = useMemo(() => {
    const materials = new Map<string, { id: string; name: string }>();
    variants.forEach((variant) => {
      if (variant.material) {
        materials.set(variant.material.id, variant.material);
      }
    });
    return Array.from(materials.values());
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

  // Get current price and inventory
  const currentPrice = selectedVariant?.price || product.price;
  const currentInventory = selectedVariant?.inventory ?? product.inventory ?? 0;
  const isOutOfStock = currentInventory <= 0;

  // Calculate discount
  const discountPercent = useMemo(() => {
    if (
      product.originalPrice &&
      product.price &&
      product.originalPrice > product.price
    ) {
      return Math.round(
        ((product.originalPrice - product.price) / product.originalPrice) * 100
      );
    }
    return 0;
  }, [product.originalPrice, product.price]);

  // Format VND
  const formatVND = (price: number) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(price);
  };

  // Initialize mounted state
  useEffect(() => {
    setMounted(true);
  }, []);

  // Lock body scroll when popover is open
  useEffect(() => {
    if (isOpen) {
      // Save current scroll position
      const scrollY = window.scrollY;
      document.body.style.position = "fixed";
      document.body.style.top = `-${scrollY}px`;
      document.body.style.width = "100%";
      document.body.style.overflow = "hidden";

      return () => {
        // Restore scroll position
        document.body.style.position = "";
        document.body.style.top = "";
        document.body.style.width = "";
        document.body.style.overflow = "";
        window.scrollTo(0, scrollY);
      };
    }
  }, [isOpen]);

  // Reset state when product changes
  useEffect(() => {
    if (isOpen) {
      setCurrentImage(0);
      setQuantity(1);
      // Set initial variant selections
      if (variants.length > 0) {
        const firstVariant = variants[0];
        setSelectedSizeId(firstVariant.size?.id || null);
        setSelectedColorId(firstVariant.color?.id || null);
        setSelectedMaterialId(firstVariant.material?.id || null);
      } else {
        setSelectedSizeId(null);
        setSelectedColorId(null);
        setSelectedMaterialId(null);
      }
    }
  }, [isOpen, product.id, variants]);

  // Check wishlist status
  useEffect(() => {
    if (!isOpen) return;

    const checkWishlistStatus = async () => {
      try {
        const allItems = await getAllWishlistItems();
        setIsInWishlist(allItems.includes(product.id));
      } catch {
        try {
          const isInList = await checkWishlist(product.id);
          setIsInWishlist(isInList);
        } catch {
          setIsInWishlist(false);
        }
      }
    };

    checkWishlistStatus();
  }, [isOpen, product.id, getAllWishlistItems, checkWishlist]);

  // Update quantity when inventory changes
  useEffect(() => {
    if (quantity > currentInventory && currentInventory > 0) {
      setQuantity(currentInventory);
    }
  }, [currentInventory, quantity]);

  // Image navigation
  const nextImage = () => {
    if (images.length > 0) {
      setCurrentImage((prev) => (prev + 1) % images.length);
    }
  };

  const prevImage = () => {
    if (images.length > 0) {
      setCurrentImage((prev) => (prev - 1 + images.length) % images.length);
    }
  };

  // Quantity handlers
  const increaseQuantity = () => {
    if (currentInventory > 0 && quantity < currentInventory) {
      setQuantity((prev) => prev + 1);
    }
  };

  const decreaseQuantity = () => {
    if (quantity > 1) {
      setQuantity((prev) => prev - 1);
    }
  };

  // Add to cart
  const handleAddToCart = async () => {
    if (isOutOfStock) {
      toast.error("Sản phẩm đã hết hàng");
      return;
    }

    if (variants.length > 0 && !selectedVariant) {
      toast.error("Vui lòng chọn đầy đủ thông tin sản phẩm");
      return;
    }

    setIsAddingToCart(true);

    try {
      // Create product data with selected variant
      const productData: Product = {
        ...product,
        price: currentPrice,
        size: selectedVariant?.size || undefined,
        color: selectedVariant?.color || undefined,
        material: selectedVariant?.material || undefined,
      };

      cart.addItem(productData, quantity);

      // Trigger animation
      const primaryImage = images[0]?.url || "/placeholder.svg";
      const addToCartButton = popoverRef.current?.querySelector(
        'button:has(svg[class*="ShoppingCart"])'
      ) as HTMLElement | null;

      if (addToCartButton && primaryImage) {
        triggerAnimation(primaryImage, addToCartButton);
      }

      toast.success("Đã thêm vào giỏ hàng");

      // Đóng popover sau khi thêm vào giỏ hàng thành công
      // Delay để animation và toast hiển thị mượt mà
      setTimeout(() => {
        onClose();
      }, 500); // Delay 500ms để người dùng thấy được toast message và animation mượt mà
    } catch (error) {
      toast.error("Có lỗi xảy ra khi thêm vào giỏ hàng");
    } finally {
      setIsAddingToCart(false);
    }
  };

  // Toggle wishlist
  const handleToggleWishlist = async () => {
    try {
      await toggleWishlistWithAuth(product.id);
      setIsInWishlist((prev) => !prev);
      toast.success(
        isInWishlist ? "Đã xóa khỏi yêu thích" : "Đã thêm vào yêu thích"
      );
    } catch (error) {
      toast.error("Có lỗi xảy ra");
    }
  };

  // Share product
  const handleShare = async () => {
    const url = `${window.location.origin}/product/${product.id}`;
    try {
      if (navigator.share) {
        await navigator.share({
          title: product.name,
          text: product.description || "",
          url,
        });
      } else {
        await navigator.clipboard.writeText(url);
        toast.success("Đã sao chép link");
      }
    } catch (error) {
      // User cancelled or error
      if (error instanceof Error && error.name !== "AbortError") {
        await navigator.clipboard.writeText(url);
        toast.success("Đã sao chép link");
      }
    }
  };

  // Handle escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener("keydown", handleEscape);
      return () => document.removeEventListener("keydown", handleEscape);
    }
  }, [isOpen, onClose]);

  if (!mounted || !isOpen) return null;

  // Check if document.body exists (SSR safety)
  if (typeof window === "undefined" || !document.body) {
    return null;
  }

  const hasMultipleImages = images.length > 1;

  return createPortal(
    <AnimatePresence mode="wait">
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{
              duration: 0.3,
              ease: [0.4, 0, 0.2, 1], // Custom easing curve
            }}
            onClick={onClose}
          />

          {/* Popover */}
          <motion.div
            ref={popoverRef}
            className="fixed inset-0 z-[101] flex items-center justify-center p-4 pointer-events-none"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{
              duration: 0.3,
              ease: [0.4, 0, 0.2, 1],
            }}
          >
            <motion.div
              className="bg-white w-full max-w-6xl h-[90vh] max-h-[90vh] overflow-hidden flex flex-col md:flex-row pointer-events-auto shadow-2xl relative"
              initial={{ scale: 0.9, opacity: 0, y: 30 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 30 }}
              transition={{
                type: "spring",
                stiffness: 400,
                damping: 35,
                mass: 0.8,
              }}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Close Button */}
              <button
                onClick={onClose}
                className="absolute top-4 right-4 z-[102] p-2 bg-white hover:bg-gray-100 border border-gray-300 transition-colors rounded-none shadow-sm"
                aria-label="Đóng"
              >
                <X className="w-5 h-5 text-black" />
              </button>

              {/* Left: Image Gallery */}
              <div className="w-full md:w-1/2 bg-gray-50 flex flex-col min-h-0">
                {/* Main Image */}
                <div className="relative aspect-square bg-gray-100 overflow-hidden group shrink-0">
                  {images.length > 0 ? (
                    <>
                      <Image
                        src={images[currentImage]?.url || "/placeholder.svg"}
                        alt={product.name}
                        fill
                        sizes="(max-width: 768px) 100vw, 50vw"
                        className="object-cover"
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
                      <p className="text-gray-400 font-light">Không có ảnh</p>
                    </div>
                  )}
                </div>

                {/* Thumbnails - Desktop (Side) */}
                {hasMultipleImages && images.length > 1 && (
                  <div className="hidden md:flex gap-2 p-4 overflow-x-auto border-t border-gray-200 shrink-0">
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
                          sizes="64px"
                          className="object-cover"
                        />
                      </button>
                    ))}
                  </div>
                )}

                {/* Thumbnails - Mobile (Bottom) */}
                {hasMultipleImages && images.length > 1 && (
                  <div className="md:hidden flex gap-2 p-4 overflow-x-auto border-t border-gray-200 shrink-0">
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
                          sizes="64px"
                          className="object-cover"
                        />
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Right: Product Info */}
              <div className="w-full md:w-1/2 p-6 md:p-8 flex flex-col gap-6 overflow-y-auto min-h-0">
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
                    <div className="text-sm text-gray-600 font-light">
                      Tổng: {formatVND(currentPrice * quantity)}
                    </div>
                  )}
                </div>

                {/* Description */}
                {product.description && (
                  <div
                    className="text-sm text-gray-700 font-light leading-relaxed"
                    dangerouslySetInnerHTML={{ __html: product.description }}
                  />
                )}

                {/* Variants */}
                {variants.length > 0 && (
                  <div className="space-y-4">
                    {/* Size */}
                    {availableSizes.length > 0 && (
                      <div>
                        <label className="text-xs font-light uppercase tracking-wide text-gray-700 mb-2 block">
                          Kích thước
                        </label>
                        <ToggleGroup
                          type="single"
                          value={selectedSizeId || undefined}
                          onValueChange={(value) => {
                            if (value) setSelectedSizeId(value);
                          }}
                          className="justify-start"
                        >
                          {availableSizes.map((size) => (
                            <ToggleGroupItem
                              key={size.id}
                              value={size.id}
                              aria-label={size.name}
                              className="rounded-none border-gray-300 data-[state=on]:bg-gray-800 data-[state=on]:text-white data-[state=on]:border-gray-400"
                            >
                              {size.value}
                            </ToggleGroupItem>
                          ))}
                        </ToggleGroup>
                      </div>
                    )}

                    {/* Color */}
                    {availableColors.length > 0 && (
                      <div>
                        <label className="text-xs font-light uppercase tracking-wide text-gray-700 mb-2 block">
                          Màu sắc
                        </label>
                        <ToggleGroup
                          type="single"
                          value={selectedColorId || undefined}
                          onValueChange={(value) => {
                            if (value) setSelectedColorId(value);
                          }}
                          className="justify-start"
                        >
                          {availableColors.map((color) => (
                            <ToggleGroupItem
                              key={color.id}
                              value={color.id}
                              aria-label={color.name}
                              className="rounded-none border-gray-300 data-[state=on]:bg-gray-800 data-[state=on]:text-white data-[state=on]:border-gray-400"
                            >
                              <div className="flex items-center gap-2">
                                <div
                                  className="h-4 w-4 rounded-full border"
                                  style={{ backgroundColor: color.value }}
                                />
                                {color.name}
                              </div>
                            </ToggleGroupItem>
                          ))}
                        </ToggleGroup>
                      </div>
                    )}

                    {/* Material */}
                    {availableMaterials.length > 0 && (
                      <div>
                        <label className="text-xs font-light uppercase tracking-wide text-gray-700 mb-2 block">
                          Chất liệu
                        </label>
                        <ToggleGroup
                          type="single"
                          value={selectedMaterialId || undefined}
                          onValueChange={(value) => {
                            if (value) setSelectedMaterialId(value);
                          }}
                          className="justify-start"
                        >
                          {availableMaterials.map((material) => (
                            <ToggleGroupItem
                              key={material.id}
                              value={material.id}
                              aria-label={material.name}
                              className="rounded-none border-gray-300 data-[state=on]:bg-gray-400 data-[state=on]:text-white data-[state=on]:border-gray-400"
                            >
                              {material.name}
                            </ToggleGroupItem>
                          ))}
                        </ToggleGroup>
                      </div>
                    )}

                    {/* Inventory Status */}
                    {selectedVariant && (
                      <div className="text-sm font-light">
                        {currentInventory > 0 ? (
                          <span className="text-green-600">
                            Còn {currentInventory} sản phẩm
                          </span>
                        ) : (
                          <span className="text-red-600">Hết hàng</span>
                        )}
                      </div>
                    )}
                  </div>
                )}

                {/* Quantity */}
                <div className="flex items-center gap-4">
                  <label className="text-xs font-light uppercase tracking-wide text-gray-700">
                    Số lượng
                  </label>
                  <div className="flex items-center gap-2 border border-gray-300">
                    <button
                      onClick={decreaseQuantity}
                      disabled={quantity <= 1}
                      className="p-2 hover:bg-gray-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <Minus className="w-4 h-4" />
                    </button>
                    <span className="w-12 text-center font-light">
                      {quantity}
                    </span>
                    <button
                      onClick={increaseQuantity}
                      disabled={quantity >= currentInventory || isOutOfStock}
                      className="p-2 hover:bg-gray-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex flex-col gap-3 pt-4 border-t border-gray-200">
                  <Button
                    onClick={handleAddToCart}
                    disabled={isOutOfStock || isAddingToCart}
                    className="w-full h-12 rounded-none bg-gray-400 text-white hover:bg-gray-900 hover:shadow-lg hover:shadow-gray-400/30 font-light uppercase tracking-wider disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 ease-in-out hover:scale-[1.01] active:scale-[0.99]"
                  >
                    {isAddingToCart ? (
                      "Đang thêm..."
                    ) : isOutOfStock ? (
                      "Hết hàng"
                    ) : (
                      <>
                        <ShoppingCart className="w-4 h-4 mr-2" />
                        Thêm vào giỏ hàng
                      </>
                    )}
                  </Button>

                  <div className="flex gap-2">
                    <Button
                      onClick={handleToggleWishlist}
                      variant="outline"
                      className="flex-1 rounded-none border-gray-300 font-light uppercase tracking-wider"
                    >
                      <Heart
                        className={cn(
                          "w-4 h-4 mr-2",
                          isInWishlist && "fill-red-500 text-red-500"
                        )}
                      />
                      {isInWishlist ? "Đã yêu thích" : "Yêu thích"}
                    </Button>

                    <Button
                      onClick={handleShare}
                      variant="outline"
                      className="flex-1 rounded-none border-gray-300 font-light uppercase tracking-wider"
                    >
                      <Share2 className="w-4 h-4 mr-2" />
                      Chia sẻ
                    </Button>
                  </div>

                  <Link
                    href={`/product/${product.id}`}
                    onClick={onClose}
                    className="text-center text-sm text-gray-600 hover:text-black transition font-light uppercase tracking-wide"
                  >
                    Xem chi tiết sản phẩm →
                  </Link>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </>
      )}
    </AnimatePresence>,
    document.body
  );
};

export default PopoverProduct;
