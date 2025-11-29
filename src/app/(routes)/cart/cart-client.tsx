"use client";

import { Product } from "@/types";
import useCart from "@/hooks/use-cart";
import CartItem from "./components/cart-item";
import Summary from "./components/summary";
import { ShoppingBag, Sparkles } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

interface CartClientProps {
  products: Product[];
}

const CartClient: React.FC<CartClientProps> = ({ products }) => {
  const cart = useCart();

  if (cart.items.length === 0) {
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
    <div className="grid lg:grid-cols-12 gap-6 md:gap-8">
      {/* Cart Items */}
      <div className="lg:col-span-7 space-y-4 md:space-y-6">
        {cart.items.map((item, index) => (
          <motion.div
            key={item.cartItemId}
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
