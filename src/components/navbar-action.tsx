"use client";

import {
  X,
  Plus,
  Minus,
  Heart,
  Search,
  User,
  Trash2,
  ShoppingBag,
} from "lucide-react";
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

export const NavbarActions: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [mounted, setMounted] = useState(false);
  const cart = useCart();
  const router = useRouter();
  const { wishlistItems, setWishlist } = cart;
  const { isSignedIn } = useAuth();
  const { getAllWishlistItems } = useWishlist();
  const [syncedWishlistCount, setSyncedWishlistCount] = useState(0);
  const [isSyncing, setIsSyncing] = useState(false);
  const [isNavigating, setIsNavigating] = useState(false);
  const searchInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    const syncWishlist = async () => {
      if (!isSignedIn) {
        setSyncedWishlistCount(0);
        return;
      }

      setIsSyncing(true);
      try {
        const serverWishlistItems = await getAllWishlistItems();
        setSyncedWishlistCount(serverWishlistItems.length);
        if (serverWishlistItems.length > 0) {
          setWishlist(serverWishlistItems);
        } else {
          setWishlist([]);
        }
      } catch (error) {
        setSyncedWishlistCount(wishlistItems.length);
      } finally {
        setIsSyncing(false);
      }
    };

    syncWishlist();
    const interval = setInterval(syncWishlist, 30000);
    return () => clearInterval(interval);
  }, [isSignedIn, getAllWishlistItems, setWishlist, wishlistItems.length]);

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

  const wishlistCount = isSignedIn ? syncedWishlistCount : wishlistItems.length;

  return (
    <div className="flex items-center gap-3 md:gap-4">
      {/* Search Bar - Inline với icon (Aigle Style) */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          if (searchQuery.trim()) {
            router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
            setSearchQuery("");
          }
        }}
        className="flex items-center gap-2 border-b border-black pb-1"
      >
        <Search className="w-4 h-4 text-black shrink-0" />
        <input
          ref={searchInputRef}
          type="text"
          placeholder="SEARCH"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="border-0 outline-none bg-transparent text-sm font-light uppercase tracking-wider placeholder:text-gray-400 focus:ring-0 w-24 md:w-32"
        />
      </form>

      {/* User Account (Aigle Style) */}
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

      {/* Cart Icon (Aigle Style) */}
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen(true)}
        className="relative p-2 text-black hover:text-gray-600 transition-colors duration-200 group flex items-center justify-center"
        aria-label="Giỏ hàng"
      >
        <ShoppingBag className="w-5 h-5" />
        {cart.items.length > 0 && (
          <motion.span
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="absolute -top-1 -right-1 min-w-[18px] h-[18px] bg-black text-white text-[10px] rounded-full flex items-center justify-center font-medium px-1"
          >
            {cart.items.length > 99 ? "99+" : cart.items.length}
          </motion.span>
        )}
      </motion.button>

      {/* Cart Drawer */}
      {mounted &&
        createPortal(
          <AnimatePresence>
            {isOpen && (
              <>
                {/* BACKDROP */}
                <motion.div
                  className="fixed inset-0 z-100 bg-black/40 backdrop-blur-sm"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  onClick={() => setIsOpen(false)}
                />

                {/* DRAWER */}
                <motion.div
                  className="fixed bottom-0 right-0 left-0 z-101 bg-white border-t border-gray-200 max-w-md mx-auto h-[90vh] flex flex-col shadow-2xl md:right-4 md:left-auto md:max-w-sm md:rounded-t-2xl md:h-[85vh]"
                  initial={{ y: "100%" }}
                  animate={{ y: 0 }}
                  exit={{ y: "100%" }}
                  transition={{
                    type: "spring",
                    stiffness: 300,
                    damping: 30,
                  }}
                >
                  {/* HANDLE */}
                  <div className="flex justify-center py-2.5">
                    <div className="w-12 h-1 bg-gray-300 rounded-full" />
                  </div>

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
                          <Button className="bg-black text-white hover:bg-gray-800 rounded-none px-6 py-2.5 text-sm font-light uppercase tracking-wider transition-colors duration-200">
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
                                className="relative w-20 h-20 shrink-0 bg-gray-50 border border-gray-200 group overflow-hidden"
                              >
                                <Image
                                  src={
                                    item.images?.[0]?.url || "/placeholder.svg"
                                  }
                                  alt={item.name}
                                  fill
                                  className="object-cover group-hover:scale-105 transition-transform duration-200"
                                />
                              </Link>

                              {/* Info */}
                              <div className="flex-1 min-w-0">
                                <Link
                                  href={`/product/${item.id}`}
                                  onClick={() => setIsOpen(false)}
                                  className="block"
                                >
                                  <h3 className="text-black line-clamp-2 hover:text-gray-600 transition text-sm font-light uppercase tracking-wide mb-1">
                                    {item.name}
                                  </h3>
                                </Link>
                                <div className="mt-1 text-xs font-light text-gray-500 space-x-2">
                                  {item.size && (
                                    <span>Size: {item.size.name}</span>
                                  )}
                                  {item.color && (
                                    <span>Màu: {item.color.name}</span>
                                  )}
                                </div>
                                <div className="mt-2 mb-3">
                                  <span className="text-black text-sm font-medium">
                                    <Currency value={item.price} />
                                  </span>
                                </div>

                                {/* Quantity Controls */}
                                <div className="flex items-center justify-between">
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
                        className="w-full rounded-none py-3.5 text-sm font-light uppercase tracking-wider bg-black text-white hover:bg-gray-800 transition-colors duration-200"
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
