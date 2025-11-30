"use client";

import { Product } from "@/types";
import useCart from "@/hooks/use-cart";
import CartItem from "./components/cart-item";
import Summary from "./components/summary";
import { ShoppingBag, Sparkles } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { useEffect, useState, useRef } from "react";
import { useRouter, usePathname } from "next/navigation";

interface CartClientProps {
  products: Product[];
}

const CartClient: React.FC<CartClientProps> = ({ products }) => {
  const cart = useCart();
  const router = useRouter();
  const pathname = usePathname();
  const [mounted, setMounted] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);
  const prevItemsLengthRef = useRef(cart.items.length);
  
  // Ensure component is mounted and cart state is hydrated
  useEffect(() => {
    setMounted(true);
    // Sync with current cart state on mount
    prevItemsLengthRef.current = cart.items.length;
  }, []);

  // Force re-render when cart items change
  useEffect(() => {
    const currentLength = cart.items.length;
    // If items changed, force update
    if (currentLength !== prevItemsLengthRef.current) {
      prevItemsLengthRef.current = currentLength;
      setRefreshKey((prev) => prev + 1);
    }
  }, [cart.items]);

  // Force refresh when navigating to cart page
  useEffect(() => {
    if (pathname === "/cart" && mounted) {
      // Small delay to ensure Zustand state is synced
      const timer = setTimeout(() => {
        setRefreshKey((prev) => prev + 1);
      }, 50);
      return () => clearTimeout(timer);
    }
  }, [pathname, mounted]);

  // Listen for cart-updated custom event
  useEffect(() => {
    const handleCartUpdate = () => {
      setRefreshKey((prev) => prev + 1);
    };

    window.addEventListener("cart-updated", handleCartUpdate);
    return () => window.removeEventListener("cart-updated", handleCartUpdate);
  }, []);

  // Use cart.items directly - Zustand will handle reactivity
  const displayItems = mounted ? cart.items : [];

  if (displayItems.length === 0) {
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
              className="bg-black text-white hover:bg-gray-800 rounded-none px-8 py-3 text-sm font-light uppercase tracking-wider transition-colors duration-200"
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

  return (
    <div className="grid lg:grid-cols-12 gap-6 md:gap-8" key={refreshKey}>
      {/* Cart Items */}
      <div className="lg:col-span-7 space-y-4 md:space-y-6">
        {displayItems.map((item, index) => (
          <motion.div
            key={`${item.cartItemId}-${refreshKey}`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <CartItem data={item} />
          </motion.div>
        ))}
      </div>

      {/* Summary */}
      <div className="lg:col-span-5">
        <Summary />
      </div>
    </div>
  );
};

export default CartClient;
