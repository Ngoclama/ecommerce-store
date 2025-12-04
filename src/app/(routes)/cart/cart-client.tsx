"use client";

import useCart from "@/hooks/use-cart";
import CartItem from "./components/cart-item";
import Summary from "./components/summary";
import { ShoppingBag, Sparkles } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
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

  // Read from localStorage immediately on mount for instant display
  useEffect(() => {
    setMounted(true);

    // Load from localStorage immediately
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
            setHydratedItems(parsed.state.items);
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
      setHydratedItems(cart.items);
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

  // Empty cart state
  if (items.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white py-16 md:py-24 text-center"
      >
        <div className="max-w-md mx-auto space-y-6">
          <div className="flex justify-center">
            <div className="p-6 bg-gray-50 border border-gray-200 rounded-none">
              <ShoppingBag className="w-16 h-16 text-gray-300" />
            </div>
          </div>
          <div className="space-y-3">
            <h2 className="text-2xl md:text-3xl font-light text-black uppercase tracking-wider">
              Giỏ hàng trống
            </h2>
            <p className="text-gray-600 text-sm font-light leading-relaxed">
              Bạn chưa có sản phẩm nào trong giỏ hàng.
              <br />
              Hãy khám phá và thêm những sản phẩm bạn yêu thích!
            </p>
          </div>
          <div className="pt-4">
            <Button
              asChild
              className="bg-gray-400 text-white hover:bg-gray-900 hover:shadow-lg hover:shadow-gray-400/30 rounded-none px-8 py-3 text-sm font-light uppercase tracking-wider transition-all duration-300 ease-in-out hover:scale-[1.01] active:scale-[0.99]"
            >
              <Link href="/">
                <Sparkles className="w-4 h-4 mr-2 inline" />
                Khám phá sản phẩm
              </Link>
            </Button>
          </div>
        </div>
      </motion.div>
    );
  }

  // Cart with items
  return (
    <div className="grid lg:grid-cols-12 gap-6 md:gap-8">
      {/* Cart Items */}
      <div className="lg:col-span-7 space-y-4 md:space-y-6">
        {items.map((item, index) => (
          <motion.div
            key={item.cartItemId}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
          >
            <CartItem data={item} />
          </motion.div>
        ))}
      </div>

      {/* Summary */}
      <div className="lg:col-span-5">
        <Summary coupons={coupons} />
      </div>
    </div>
  );
};

export default CartClient;
