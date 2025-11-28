"use client";

import {
  ShoppingCart,
  X,
  Plus,
  Minus,
  Heart,
  Search,
  User,
} from "lucide-react";
import { useState, useEffect } from "react";
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

export const NavbarActions: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const cart = useCart();
  const router = useRouter();
  const wishlistItems = cart.wishlistItems;
  const { isSignedIn } = useAuth();

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleCheckout = () => {
    setIsOpen(false);
    router.push("/checkout");
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
    } else {
      cart.setQuantity(item.cartItemId, safeQty);
    }
  };

  return (
    <div className="flex items-center gap-2 md:gap-3">
      {/* Search Icon - Mobile Only */}
      <button
        className="lg:hidden p-2.5 text-black hover:text-gray-600 hover:bg-gray-50 rounded-none transition-all duration-300"
        aria-label="Search"
        onClick={() => {
          const searchInput = document.querySelector(
            'input[type="text"][placeholder*="Search"]'
          ) as HTMLInputElement;
          if (searchInput) {
            searchInput.focus();
          }
        }}
      >
        <Search className="w-5 h-5" />
      </button>

      {/* User Account - Clerk UserButton hoặc Login Icon */}
      {mounted && (
        <>
          {isSignedIn ? (
            <div className="group relative flex items-center justify-center">
              <UserButton
                appearance={{
                  elements: {
                    avatarBox: "w-10 h-10 md:w-11 md:h-11",
                    userButtonPopoverCard:
                      "rounded-none border-gray-300 shadow-lg bg-white",
                    userButtonPopoverActions: "bg-white",
                    userButtonPopoverActionButton:
                      "text-black font-light uppercase tracking-wide text-xs hover:bg-gray-50 rounded-none",
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
              className="group relative p-2.5 bg-transparent hover:bg-gray-50 rounded-none transition-all duration-300"
              aria-label="Đăng nhập"
            >
              <User className="w-5 h-5 text-black group-hover:scale-110 transition-transform duration-300" />
            </Link>
          )}
        </>
      )}

      {/* Wishlist Icon */}
      <Link
        href="/wishlist"
        className="relative p-2.5 bg-transparent hover:bg-gray-50 rounded-none transition-all duration-300 group"
        aria-label="Wishlist"
      >
        <Heart
          className={cn(
            "w-5 h-5 text-black transition-all duration-300 group-hover:scale-110",
            wishlistItems.length > 0 && "fill-red-500 text-red-500"
          )}
        />
        {wishlistItems.length > 0 && (
          <motion.span
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="absolute -top-0.5 -right-0.5 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center font-light shadow-sm"
          >
            {wishlistItems.length}
          </motion.span>
        )}
      </Link>

      {/* Cart Icon */}
      <button
        onClick={() => setIsOpen(true)}
        className="relative p-2.5 bg-transparent hover:bg-gray-50 rounded-none transition-all duration-300 group"
        aria-label="Open shopping bag"
      >
        <ShoppingCart className="w-5 h-5 text-black group-hover:scale-110 transition-transform duration-300" />
        {cart.items.length > 0 && (
          <motion.span
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="absolute -top-0.5 -right-0.5 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center font-light shadow-sm"
          >
            {cart.items.length}
          </motion.span>
        )}
      </button>

      {/* Cart Drawer */}
      {mounted &&
        createPortal(
          <AnimatePresence>
            {isOpen && (
              <>
                {/* BACKDROP */}
                <motion.div
                  className="fixed inset-0 z-100 bg-black/50 backdrop-blur-sm"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.25 }}
                  onClick={() => setIsOpen(false)}
                />

                {/* DRAWER */}
                <motion.div
                  className="fixed bottom-0 right-0 left-0 z-101 bg-white border-t border-gray-300 max-w-md mx-auto h-[85vh] flex flex-col md:right-4 md:left-auto md:max-w-sm rounded-t-xl md:rounded-t-xl"
                  initial={{ y: "100%" }}
                  animate={{ y: 0 }}
                  exit={{ y: "100%" }}
                  transition={{
                    type: "spring",
                    stiffness: 260,
                    damping: 25,
                  }}
                >
                  {/* HANDLE */}
                  <div className="flex justify-center py-3">
                    <div className="w-12 h-px bg-gray-300" />
                  </div>

                  {/* HEADER */}
                  <div className="flex items-center justify-between px-4 py-4 border-b border-gray-200">
                    <h2 className="text-base font-light text-black uppercase tracking-wider">
                      Giỏ hàng ({cart.items.length})
                    </h2>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => setIsOpen(false)}
                      className="p-1 hover:bg-gray-100 w-8 h-8 rounded-none"
                    >
                      <X className="w-4 h-4 text-black" />
                    </Button>
                  </div>

                  {/* BODY (Scrollable Items) */}
                  <div className="flex-1 overflow-auto px-4 py-4">
                    {cart.items.length === 0 ? (
                      <div className="flex flex-col items-center justify-center h-full text-center">
                        <ShoppingCart className="w-16 h-16 text-gray-400 mb-4" />
                        <p className="text-black text-lg mb-2 font-light uppercase tracking-wide">
                          Giỏ hàng trống
                        </p>
                        <p className="text-gray-600 text-sm font-light">
                          Thêm sản phẩm vào giỏ hàng để tiếp tục
                        </p>
                      </div>
                    ) : (
                      <ul className="space-y-4">
                        {cart.items.map((item) => {
                          const inventory = item.inventory ?? 999;
                          const canIncrease = item.quantity < inventory;

                          return (
                            <li
                              key={item.cartItemId}
                              className="flex gap-3 items-start pb-4 border-b border-gray-200 last:border-0"
                            >
                              {/* Image */}
                              <Link
                                href={`/product/${item.id}`}
                                onClick={() => setIsOpen(false)}
                                className="relative w-16 h-16 shrink-0 bg-gray-50 border border-gray-200"
                              >
                                <Image
                                  src={
                                    item.images?.[0]?.url || "/placeholder.svg"
                                  }
                                  alt={item.name}
                                  fill
                                  className="object-cover"
                                />
                              </Link>

                              {/* Info */}
                              <div className="flex-1 min-w-0">
                                <Link
                                  href={`/product/${item.id}`}
                                  onClick={() => setIsOpen(false)}
                                  className="block"
                                >
                                  <h3 className="text-black line-clamp-2 hover:text-gray-600 transition text-xs font-light uppercase tracking-wide">
                                    {item.name}
                                  </h3>
                                </Link>
                                <div className="mt-1 text-xs font-light text-gray-600">
                                  {item.size && (
                                    <span>Size: {item.size.name}</span>
                                  )}
                                  {item.color && (
                                    <span className="ml-2">
                                      Color: {item.color.name}
                                    </span>
                                  )}
                                </div>
                                <div className="mt-2 flex items-center justify-between">
                                  <span className="text-black text-sm font-light">
                                    <Currency value={item.price} />
                                  </span>
                                </div>

                                {/* Quantity Controls */}
                                <div className="mt-3 flex items-center gap-2">
                                  <button
                                    onClick={() =>
                                      handleQuantityChange(
                                        item,
                                        item.quantity - 1
                                      )
                                    }
                                    disabled={item.quantity <= 1}
                                    className={cn(
                                      "w-8 h-8 border border-gray-300 flex items-center justify-center transition hover:border-black rounded-none bg-white",
                                      item.quantity <= 1
                                        ? "border-gray-300 text-gray-400 cursor-not-allowed opacity-50"
                                        : "text-black hover:bg-gray-100"
                                    )}
                                  >
                                    <Minus className="w-4 h-4" />
                                  </button>
                                  <span className="w-8 text-center text-black text-xs font-light">
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
                                      "w-8 h-8 border border-gray-300 flex items-center justify-center transition hover:border-black rounded-none bg-white",
                                      !canIncrease
                                        ? "border-gray-300 text-gray-400 cursor-not-allowed opacity-50"
                                        : "text-black hover:bg-gray-100"
                                    )}
                                  >
                                    <Plus className="w-4 h-4" />
                                  </button>
                                  <button
                                    onClick={() =>
                                      cart.removeItem(item.cartItemId)
                                    }
                                    className="ml-auto text-gray-600 hover:text-black text-xs font-light transition uppercase tracking-wider"
                                  >
                                    Xóa
                                  </button>
                                </div>
                              </div>
                            </li>
                          );
                        })}
                      </ul>
                    )}
                  </div>

                  {/* FOOTER */}
                  {cart.items.length > 0 && (
                    <div className="border-t border-gray-200 p-4 space-y-3 bg-white">
                      <div className="flex items-center justify-between">
                        <span className="text-gray-700 text-sm uppercase font-light tracking-wide">
                          Tổng tiền:
                        </span>
                        <span className="text-black text-xl font-light">
                          <Currency value={totalPrice} />
                        </span>
                      </div>
                      <Button
                        onClick={handleCheckout}
                        variant="default"
                        className="w-full rounded-none py-3 text-sm font-light uppercase tracking-wider border-black hover:bg-gray-800"
                      >
                        Thanh toán
                      </Button>
                      <Link
                        href="/cart"
                        onClick={() => setIsOpen(false)}
                        className="block text-center text-xs text-gray-600 hover:text-black transition uppercase font-light tracking-wider"
                      >
                        Xem giỏ hàng chi tiết
                      </Link>
                    </div>
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
