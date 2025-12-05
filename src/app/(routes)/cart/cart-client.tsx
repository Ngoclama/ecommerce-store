"use client";

import useCart from "@/hooks/use-cart";
import CartItem from "./components/cart-item";
import Summary from "./components/summary";
import { ShoppingBag, Sparkles, ArrowRight } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { motion, useInView } from "framer-motion";
import { useEffect, useState, useRef } from "react";
import { usePathname } from "next/navigation";
import { CartItem as CartItemType, Coupon } from "@/types";

interface CartClientProps {
  coupons?: Coupon[];
}

const CartClient: React.FC<CartClientProps> = ({ coupons = [] }) => {
  const cart = useCart();
  const pathname = usePathname();
  const [mounted, setMounted] = useState(false);
  const [hydratedItems, setHydratedItems] = useState<CartItemType[]>([]);
  const headerRef = useRef(null);
  const isHeaderInView = useInView(headerRef, { once: true, amount: 0.3 });

  // Read from localStorage immediately on mount for instant display
  useEffect(() => {
    // Use requestAnimationFrame to defer setState
    requestAnimationFrame(() => {
      setMounted(true);
    });

    // Load from localStorage immediately
    try {
      const storageKey = "ecommerce-cart-wishlist-storage";
      const saved = localStorage.getItem(storageKey);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed?.state?.items && Array.isArray(parsed.state.items)) {
          requestAnimationFrame(() => {
            setHydratedItems(parsed.state.items);
          });
        }
      }
    } catch (error) {
      console.error("[CartClient] Error loading from localStorage:", error);
    }
  }, []);

  // Reload when navigating to cart page
  useEffect(() => {
    if (pathname === "/cart" && mounted) {
      try {
        const storageKey = "ecommerce-cart-wishlist-storage";
        const saved = localStorage.getItem(storageKey);
        if (saved) {
          const parsed = JSON.parse(saved);
          if (parsed?.state?.items && Array.isArray(parsed.state.items)) {
            requestAnimationFrame(() => {
              setHydratedItems(parsed.state.items);
            });
          }
        }
      } catch (error) {
        console.error("[CartClient] Error reloading on navigate:", error);
      }
    }
  }, [pathname, mounted]);

  // Sync with Zustand when it hydrates (cart.items changes)
  useEffect(() => {
    if (cart.items.length > 0) {
      requestAnimationFrame(() => {
        setHydratedItems(cart.items);
      });
    }
  }, [cart.items]);

  // Listen for cart-updated event to refresh immediately
  useEffect(() => {
    const handleCartUpdate = () => {
      // Small delay to ensure localStorage is updated
      setTimeout(() => {
        try {
          const storageKey = "ecommerce-cart-wishlist-storage";
          const saved = localStorage.getItem(storageKey);
          if (saved) {
            const parsed = JSON.parse(saved);
            if (parsed?.state?.items && Array.isArray(parsed.state.items)) {
              setHydratedItems(parsed.state.items);
            }
          }
        } catch (error) {
          console.error("[CartClient] Error on cart update:", error);
        }
      }, 50);
    };

    window.addEventListener("cart-updated", handleCartUpdate);
    return () => window.removeEventListener("cart-updated", handleCartUpdate);
  }, []);

  // Use hydrated items if available, otherwise use Zustand state
  // This ensures items display immediately even before Zustand hydrates
  const items = mounted
    ? hydratedItems.length > 0
      ? hydratedItems
      : cart.items
    : [];

  // Empty cart state - Luxury Style
  if (items.length === 0) {
    return (
      <div className="px-4 sm:px-6 lg:px-8 py-12 md:py-16 lg:py-20">
        <motion.div
          ref={headerRef}
          initial={{ opacity: 0, y: 30 }}
          animate={
            isHeaderInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }
          }
          transition={{ duration: 0.8 }}
          className="text-center py-20 md:py-32"
        >
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={
              isHeaderInView
                ? { scale: 1, opacity: 1 }
                : { scale: 0.8, opacity: 0 }
            }
            transition={{ duration: 0.6, delay: 0.2, type: "spring" }}
            className="inline-flex items-center justify-center w-24 h-24 rounded-sm bg-gradient-to-br from-neutral-900 to-neutral-800 dark:from-neutral-100 dark:to-neutral-200 border-2 border-neutral-900 dark:border-neutral-100 mb-8"
          >
            <motion.div
              animate={{ rotate: [0, 10, -10, 0] }}
              transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
            >
              <ShoppingBag className="w-12 h-12 text-white dark:text-neutral-900" />
            </motion.div>
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={
              isHeaderInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }
            }
            transition={{ duration: 0.8, delay: 0.3 }}
            className="text-3xl md:text-4xl lg:text-5xl font-light text-neutral-900 dark:text-neutral-100 uppercase tracking-tight mb-4"
          >
            Giỏ hàng trống
          </motion.h2>

          <motion.div
            initial={{ opacity: 0, width: 0 }}
            animate={
              isHeaderInView
                ? { opacity: 1, width: "100%" }
                : { opacity: 0, width: 0 }
            }
            transition={{ duration: 1, delay: 0.4 }}
            className="h-px bg-gradient-to-r from-transparent via-neutral-900 to-transparent dark:from-transparent dark:via-neutral-100 dark:to-transparent max-w-2xl mx-auto mb-6"
          />

          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={
              isHeaderInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 10 }
            }
            transition={{ duration: 0.8, delay: 0.5 }}
            className="text-sm md:text-base text-neutral-600 dark:text-neutral-400 font-light max-w-md mx-auto leading-relaxed mb-8"
          >
            Bạn chưa có sản phẩm nào trong giỏ hàng.
            <br />
            Hãy khám phá và thêm những sản phẩm bạn yêu thích!
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={
              isHeaderInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 10 }
            }
            transition={{ duration: 0.6, delay: 0.6 }}
          >
            <Button
              asChild
              className="inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-neutral-900 to-neutral-800 dark:from-neutral-100 dark:to-neutral-200 text-white dark:text-neutral-900 hover:from-neutral-800 hover:to-neutral-700 dark:hover:from-neutral-200 dark:hover:to-neutral-300 border-2 border-neutral-900 dark:border-neutral-100 rounded-sm text-sm font-light uppercase tracking-[0.15em] transition-all duration-300 hover:scale-105 hover:shadow-xl"
            >
              <Link href="/">
                <Sparkles className="w-4 h-4" />
                Khám phá sản phẩm
                <ArrowRight className="w-4 h-4" />
              </Link>
            </Button>
          </motion.div>
        </motion.div>
      </div>
    );
  }

  // Cart with items - Luxury Style
  return (
    <div className="px-4 sm:px-6 lg:px-8 py-12 md:py-16 lg:py-20">
      {/* Luxury Header */}
      <motion.div
        ref={headerRef}
        initial={{ opacity: 0, y: 30 }}
        animate={isHeaderInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
        transition={{ duration: 0.8 }}
        className="mb-12 md:mb-16"
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={
            isHeaderInView
              ? { opacity: 1, scale: 1 }
              : { opacity: 0, scale: 0.8 }
          }
          transition={{ duration: 0.6, delay: 0.2, type: "spring" }}
          className="inline-flex items-center gap-3 px-5 py-3 bg-gradient-to-br from-neutral-900 to-neutral-800 dark:from-neutral-100 dark:to-neutral-200 border-2 border-neutral-900 dark:border-neutral-100 rounded-sm mb-6"
        >
          <motion.div
            animate={{ rotate: [0, 10, -10, 0] }}
            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
          >
            <ShoppingBag className="w-5 h-5 text-white dark:text-neutral-900" />
          </motion.div>
          <span className="text-xs font-light text-white dark:text-neutral-900 uppercase tracking-[0.2em]">
            Giỏ hàng
          </span>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={
            isHeaderInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }
          }
          transition={{ duration: 0.8, delay: 0.3 }}
          className="text-4xl md:text-5xl lg:text-6xl font-light text-neutral-900 dark:text-neutral-100 leading-[1.1] tracking-tight uppercase mb-6"
        >
          Giỏ hàng của bạn
        </motion.h1>

        <motion.div
          initial={{ opacity: 0, width: 0 }}
          animate={
            isHeaderInView
              ? { opacity: 1, width: "100%" }
              : { opacity: 0, width: 0 }
          }
          transition={{ duration: 1, delay: 0.4 }}
          className="h-px bg-gradient-to-r from-neutral-900 via-neutral-400 to-transparent dark:from-neutral-100 dark:via-neutral-600 mb-4"
        />

        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={
            isHeaderInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 10 }
          }
          transition={{ duration: 0.8, delay: 0.5 }}
          className="text-sm text-neutral-600 dark:text-neutral-400 font-light"
        >
          {items.length} {items.length === 1 ? "sản phẩm" : "sản phẩm"} trong
          giỏ hàng
        </motion.p>
      </motion.div>

      {/* Cart Content */}
      <div className="grid lg:grid-cols-12 gap-6 md:gap-8 lg:gap-12">
        {/* Cart Items */}
        <div className="lg:col-span-7 space-y-4 md:space-y-6">
          {items.map((item, index) => (
            <motion.div
              key={item.cartItemId}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.6 + index * 0.05 }}
            >
              <CartItem data={item} />
            </motion.div>
          ))}
        </div>

        {/* Summary */}
        <div className="lg:col-span-5">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.7 }}
          >
            <Summary coupons={coupons} />
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default CartClient;
