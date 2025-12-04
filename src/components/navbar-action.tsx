"use client";

import { X, Plus, Minus, Heart, User, Trash2, ShoppingBag } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import useCart from "@/hooks/use-cart";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import Currency from "@/components/ui/currency";
import { CartItem } from "@/types";
import { UserButton, useAuth } from "@clerk/nextjs";
import { useWishlist } from "@/hooks/use-wishlist";
import { SearchDropdown } from "./search-dropdown";

export const NavbarActions: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const cart = useCart();
  const router = useRouter();
  const { wishlistItems, setWishlist } = cart;
  const { isSignedIn } = useAuth();
  const { getAllWishlistItems } = useWishlist();
  const [syncedWishlistCount, setSyncedWishlistCount] = useState(0);
  const [isSyncing, setIsSyncing] = useState(false);
  const [isNavigating, setIsNavigating] = useState(false);
  const syncIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const lastSyncRef = useRef<string>("");
  const wishlistItemsRef = useRef<string[]>([]);
  const cartButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Cập nhật ref khi wishlistItems thay đổi
  useEffect(() => {
    wishlistItemsRef.current = wishlistItems;
  }, [wishlistItems]);

  useEffect(() => {
    let isMounted = true;

    const syncWishlist = async () => {
      if (!isSignedIn) {
        if (isMounted) {
          setSyncedWishlistCount(0);
          if (wishlistItemsRef.current.length > 0) {
            setWishlist([]);
          }
        }
        return;
      }

      if (!isMounted) return;

      setIsSyncing(true);
      try {
        const serverWishlistItems = await getAllWishlistItems();

        if (!isMounted) return;

        // Remove duplicates from server response
        const uniqueWishlistItems = Array.from(new Set(serverWishlistItems));
        const newCount = uniqueWishlistItems.length;
        const wishlistKey = uniqueWishlistItems.sort().join(",");

        if (lastSyncRef.current !== wishlistKey) {
          setSyncedWishlistCount(newCount);
          lastSyncRef.current = wishlistKey;

          const currentWishlistKey = wishlistItemsRef.current.sort().join(",");

          if (wishlistKey !== currentWishlistKey) {
            if (uniqueWishlistItems.length > 0) {
              setWishlist(uniqueWishlistItems);
            } else {
              setWishlist([]);
            }
          }
        }
      } catch (error) {
        if (isMounted) {
          console.error("[WISHLIST_SYNC_ERROR]", error);
        }
      } finally {
        if (isMounted) {
          setIsSyncing(false);
        }
      }
    };

    syncWishlist();

    if (isSignedIn) {
      if (syncIntervalRef.current) {
        clearInterval(syncIntervalRef.current);
      }
      syncIntervalRef.current = setInterval(syncWishlist, 30000);
    } else {
      if (syncIntervalRef.current) {
        clearInterval(syncIntervalRef.current);
        syncIntervalRef.current = null;
      }
    }

    return () => {
      isMounted = false;
      if (syncIntervalRef.current) {
        clearInterval(syncIntervalRef.current);
        syncIntervalRef.current = null;
      }
    };
  }, [isSignedIn, getAllWishlistItems, setWishlist]);

  const handleCheckout = () => {
    if (isNavigating) {
      return;
    }
    setIsNavigating(true);
    setIsOpen(false);
    router.push("/cart");
  };

  const totalPrice = cart.items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  const handleQuantityChange = (item: CartItem, newQty: number) => {
    const safeQty = Math.max(0, newQty);
    const inventory = item.inventory ?? 999;

    if (safeQty > inventory) {
      toast.error(`Chỉ còn ${inventory} sản phẩm trong kho.`);
      return;
    }

    if (safeQty === 0) {
      cart.removeItem(item.cartItemId);
      toast.success("Đã xóa sản phẩm khỏi giỏ hàng");
    } else {
      cart.setQuantity(item.cartItemId, safeQty);
    }
  };

  const handleRemoveItem = (item: CartItem) => {
    cart.removeItem(item.cartItemId);
    toast.success("Đã xóa sản phẩm khỏi giỏ hàng");
  };

  const wishlistCount = isSignedIn
    ? isSyncing
      ? syncedWishlistCount
      : syncedWishlistCount
    : wishlistItems.length;

  // Calculate popover position (prevent overflow on both sides)
  const [popoverPosition, setPopoverPosition] = useState({
    top: 0,
    left: 0,
  });

  useEffect(() => {
    if (isOpen && cartButtonRef.current) {
      const rect = cartButtonRef.current.getBoundingClientRect();
      const popoverMaxWidth = 448; // max-w-md = 448px
      const popoverWidth = Math.min(popoverMaxWidth, window.innerWidth * 0.9);
      const viewportWidth = window.innerWidth;
      const margin = 16;

      // Start from cart button position
      let left = rect.left;

      // Check if popover would overflow on the right
      if (left + popoverWidth > viewportWidth - margin) {
        // Align to right edge with margin
        left = viewportWidth - popoverWidth - margin;
      }

      // Ensure minimum margin from left edge
      left = Math.max(margin, left);

      // Ensure popover doesn't exceed viewport width
      const maxAllowedWidth = viewportWidth - left - margin;
      const finalWidth = Math.min(popoverWidth, maxAllowedWidth);

      // Position popover below the cart button
      setPopoverPosition({
        top: rect.bottom + 8,
        left: left,
      });
    }
  }, [isOpen]);

  return (
    <div className="flex items-center gap-3 md:gap-4">
      {/* Search Dropdown - Real-time search */}
      <SearchDropdown />

      {/* User Account */}
      {mounted && (
        <motion.div
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="relative"
        >
          {isSignedIn ? (
            <div className="group relative flex items-center justify-center">
              <UserButton
                appearance={{
                  elements: {
                    avatarBox:
                      "w-8 h-8 transition-transform duration-200 group-hover:scale-105",
                    userButtonPopoverCard:
                      "rounded-none border border-gray-200 shadow-xl bg-white",
                    userButtonPopoverActions: "bg-white p-2",
                    userButtonPopoverActionButton:
                      "text-black font-light uppercase tracking-wide text-xs hover:bg-gray-50 rounded-none transition-colors duration-200",
                    userButtonPopoverActionButtonText: "text-black",
                    userButtonPopoverFooter: "hidden",
                  },
                }}
                afterSignOutUrl="/"
              />
            </div>
          ) : (
            <Link
              href="/sign-in"
              className="group relative p-2 text-black hover:text-gray-600 transition-colors duration-200 flex items-center justify-center"
              aria-label="Đăng nhập"
            >
              <User className="w-5 h-5" />
            </Link>
          )}
        </motion.div>
      )}

      {/* Wishlist Icon */}
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => router.push("/wishlist")}
        className="relative p-2 text-black dark:text-white hover:text-gray-600 dark:hover:text-gray-400 transition-colors duration-200 group flex items-center justify-center"
        aria-label="Danh sách yêu thích"
      >
        <Heart className="w-5 h-5" />
        {wishlistCount > 0 && (
          <motion.span
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="absolute -top-1 -right-1 min-w-[18px] h-[18px] bg-black dark:bg-white text-white dark:text-black text-[10px] rounded-full flex items-center justify-center font-medium px-1"
          >
            {wishlistCount > 99 ? "99+" : wishlistCount}
          </motion.span>
        )}
      </motion.button>

      {/* Cart Icon */}
      <motion.button
        ref={cartButtonRef}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          setIsOpen(true);
        }}
        type="button"
        className="relative p-2 text-black dark:text-white hover:text-gray-600 dark:hover:text-gray-400 transition-colors duration-200 group flex items-center justify-center"
        aria-label="Giỏ hàng"
        data-cart-icon="true"
        id="cart-icon-button"
      >
        <ShoppingBag className="w-5 h-5" />
        {cart.items.length > 0 && (
          <motion.span
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="absolute -top-1 -right-1 min-w-[18px] h-[18px] bg-black dark:bg-white text-white dark:text-black text-[10px] rounded-full flex items-center justify-center font-medium px-1"
          >
            {cart.items.length > 99 ? "99+" : cart.items.length}
          </motion.span>
        )}
      </motion.button>

      {/* Cart Popover - Small popover from bottom-left */}
      {mounted &&
        typeof document !== "undefined" &&
        createPortal(
          <AnimatePresence>
            {isOpen && (
              <>
                {/* BACKDROP */}
                <motion.div
                  className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  onClick={() => setIsOpen(false)}
                />

                {/* POPOVER - Small compact popover from bottom-left */}
                <motion.div
                  className="fixed z-50 bg-white border border-gray-200 shadow-2xl w-[90vw] max-w-md max-h-[80vh] flex flex-col rounded-none"
                  style={{
                    top: `${popoverPosition.top}px`,
                    left: `${popoverPosition.left}px`,
                    right: "auto",
                    maxHeight: `min(600px, calc(100vh - ${popoverPosition.top}px - 16px))`,
                    maxWidth: `min(448px, calc(100vw - ${popoverPosition.left}px - 16px))`,
                  }}
                  initial={{ opacity: 0, scale: 0.95, y: -10 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95, y: -10 }}
                  transition={{
                    type: "spring",
                    stiffness: 300,
                    damping: 30,
                  }}
                  onClick={(e) => e.stopPropagation()}
                >
                  {/* HEADER */}
                  <div className="flex items-center justify-between px-5 py-4 border-b border-gray-200 bg-white">
                    <div className="flex items-center gap-3">
                      <ShoppingBag className="w-5 h-5 text-black" />
                      <h2 className="text-base font-light text-black uppercase tracking-wider">
                        Giỏ hàng
                        {cart.items.length > 0 && (
                          <span className="ml-2 text-gray-500 font-normal">
                            ({cart.items.length})
                          </span>
                        )}
                      </h2>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => setIsOpen(false)}
                      className="p-1.5 hover:bg-gray-100 w-8 h-8 rounded-none transition-colors duration-200"
                      aria-label="Đóng giỏ hàng"
                    >
                      <X className="w-4 h-4 text-black" />
                    </Button>
                  </div>

                  {/* BODY (Scrollable Items) */}
                  <div className="flex-1 overflow-y-auto px-5 py-4 scrollbar-hide">
                    {cart.items.length === 0 ? (
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="flex flex-col items-center justify-center h-full text-center py-12"
                      >
                        <div className="p-6 bg-gray-50 rounded-full mb-6">
                          <ShoppingBag className="w-12 h-12 text-gray-400" />
                        </div>
                        <h3 className="text-black text-lg mb-2 font-light uppercase tracking-wide">
                          Giỏ hàng trống
                        </h3>
                        <p className="text-gray-600 text-sm font-light mb-6 max-w-xs">
                          Thêm sản phẩm vào giỏ hàng để tiếp tục mua sắm
                        </p>
                        <Link href="/" onClick={() => setIsOpen(false)}>
                          <Button className="bg-gray-400 text-white hover:bg-gray-900 hover:shadow-lg hover:shadow-gray-400/30 rounded-none px-6 py-2.5 text-sm font-light uppercase tracking-wider transition-all duration-300 ease-in-out hover:scale-[1.02] active:scale-[0.98]">
                            Khám phá sản phẩm
                          </Button>
                        </Link>
                      </motion.div>
                    ) : (
                      <motion.ul
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="space-y-4"
                      >
                        {cart.items.map((item, index) => {
                          const inventory = item.inventory ?? 999;
                          const canIncrease = item.quantity < inventory;

                          return (
                            <motion.li
                              key={item.cartItemId}
                              initial={{ opacity: 0, x: -20 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ delay: index * 0.05 }}
                              className="flex gap-4 items-start pb-4 border-b border-gray-100 last:border-0"
                            >
                              {/* Image */}
                              <Link
                                href={`/product/${item.id}`}
                                onClick={() => setIsOpen(false)}
                                className="relative w-24 h-24 md:w-28 md:h-28 shrink-0 bg-gray-50 border border-gray-200 group overflow-hidden"
                              >
                                <Image
                                  src={
                                    item.images?.[0]?.url || "/placeholder.svg"
                                  }
                                  alt={item.name}
                                  fill
                                  sizes="(max-width: 768px) 96px, 112px"
                                  className="object-cover group-hover:scale-105 transition-transform duration-200"
                                />
                              </Link>

                              {/* Info - Đầy đủ thông tin */}
                              <div className="flex-1 min-w-0">
                                {/* Category */}
                                {item.category && (
                                  <div className="mb-1">
                                    <span className="text-[10px] font-light uppercase tracking-wider text-gray-400">
                                      {item.category.name}
                                    </span>
                                  </div>
                                )}

                                {/* Product Name */}
                                <Link
                                  href={`/product/${item.id}`}
                                  onClick={() => setIsOpen(false)}
                                  className="block"
                                >
                                  <h3 className="text-black line-clamp-2 hover:text-gray-600 transition text-sm font-light uppercase tracking-wide mb-2">
                                    {item.name}
                                  </h3>
                                </Link>

                                {/* Variant Info */}
                                <div className="mt-1 mb-2 space-y-1">
                                  {item.size && (
                                    <div className="text-xs font-light text-gray-600">
                                      <span className="uppercase tracking-wide">
                                        Size:
                                      </span>{" "}
                                      <span className="text-black">
                                        {item.size.name}
                                      </span>
                                    </div>
                                  )}
                                  {item.color && (
                                    <div className="text-xs font-light text-gray-600">
                                      <span className="uppercase tracking-wide">
                                        Màu:
                                      </span>{" "}
                                      <span className="text-black">
                                        {item.color.name}
                                      </span>
                                    </div>
                                  )}
                                  {item.material && (
                                    <div className="text-xs font-light text-gray-600">
                                      <span className="uppercase tracking-wide">
                                        Chất liệu:
                                      </span>{" "}
                                      <span className="text-black">
                                        {item.material.name}
                                      </span>
                                    </div>
                                  )}
                                </div>

                                {/* Price */}
                                <div className="mt-3 mb-3">
                                  <div className="flex items-baseline gap-2">
                                    <span className="text-black text-base font-medium">
                                      <Currency value={item.price} />
                                    </span>
                                    {item.originalPrice &&
                                      item.originalPrice > item.price && (
                                        <span className="text-xs text-gray-400 line-through">
                                          <Currency
                                            value={item.originalPrice}
                                          />
                                        </span>
                                      )}
                                  </div>
                                  {item.quantity > 1 && (
                                    <div className="mt-1 text-xs text-gray-500">
                                      {item.quantity} ×{" "}
                                      <Currency value={item.price} /> ={" "}
                                      <span className="text-black font-medium">
                                        <Currency
                                          value={item.price * item.quantity}
                                        />
                                      </span>
                                    </div>
                                  )}
                                </div>

                                {/* Inventory Status */}
                                {inventory <= 5 && inventory > 0 && (
                                  <div className="mb-2 text-xs text-amber-600 font-light">
                                    Chỉ còn {inventory} sản phẩm
                                  </div>
                                )}

                                {/* Quantity Controls */}
                                <div className="flex items-center justify-between mt-3">
                                  <div className="flex items-center gap-2">
                                    <button
                                      onClick={() =>
                                        handleQuantityChange(
                                          item,
                                          item.quantity - 1
                                        )
                                      }
                                      disabled={item.quantity <= 1}
                                      className={cn(
                                        "w-7 h-7 border border-gray-300 flex items-center justify-center transition-all duration-200 rounded-none bg-white",
                                        item.quantity <= 1
                                          ? "border-gray-200 text-gray-300 cursor-not-allowed"
                                          : "text-black hover:border-black hover:bg-gray-50"
                                      )}
                                      aria-label="Giảm số lượng"
                                    >
                                      <Minus className="w-3.5 h-3.5" />
                                    </button>
                                    <span className="w-8 text-center text-black text-sm font-medium">
                                      {item.quantity}
                                    </span>
                                    <button
                                      onClick={() =>
                                        handleQuantityChange(
                                          item,
                                          item.quantity + 1
                                        )
                                      }
                                      disabled={!canIncrease}
                                      className={cn(
                                        "w-7 h-7 border border-gray-300 flex items-center justify-center transition-all duration-200 rounded-none bg-white",
                                        !canIncrease
                                          ? "border-gray-200 text-gray-300 cursor-not-allowed"
                                          : "text-black hover:border-black hover:bg-gray-50"
                                      )}
                                      aria-label="Tăng số lượng"
                                    >
                                      <Plus className="w-3.5 h-3.5" />
                                    </button>
                                  </div>
                                  <button
                                    onClick={() => handleRemoveItem(item)}
                                    className="p-1.5 text-gray-400 hover:text-red-500 transition-colors duration-200"
                                    aria-label="Xóa sản phẩm"
                                  >
                                    <Trash2 className="w-4 h-4" />
                                  </button>
                                </div>
                              </div>
                            </motion.li>
                          );
                        })}
                      </motion.ul>
                    )}
                  </div>

                  {/* FOOTER */}
                  {cart.items.length > 0 && (
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="border-t border-gray-200 p-5 space-y-4 bg-white"
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-gray-700 text-sm uppercase font-light tracking-wide">
                          Tổng tiền:
                        </span>
                        <span className="text-black text-xl font-medium">
                          <Currency value={totalPrice} />
                        </span>
                      </div>
                      <Button
                        onClick={handleCheckout}
                        className="w-full rounded-none py-3.5 text-sm font-light uppercase tracking-wider bg-gray-400 text-white hover:bg-gray-900 hover:shadow-lg hover:shadow-gray-400/30 transition-all duration-300 ease-in-out hover:scale-[1.01] active:scale-[0.99]"
                      >
                        Thanh toán
                      </Button>
                      <Link
                        href="/cart"
                        onClick={() => setIsOpen(false)}
                        className="block text-center text-xs text-gray-500 hover:text-black transition-colors duration-200 uppercase font-light tracking-wider"
                      >
                        Xem chi tiết giỏ hàng
                      </Link>
                    </motion.div>
                  )}
                </motion.div>
              </>
            )}
          </AnimatePresence>,
          document.body
        )}
    </div>
  );
};
