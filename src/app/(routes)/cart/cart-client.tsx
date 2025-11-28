"use client";

import { Product } from "@/types";
import useCart from "@/hooks/use-cart";
import CartItem from "./components/cart-item";
import Summary from "./components/summary";
import { ShoppingBag } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

interface CartClientProps {
  products: Product[];
}

const CartClient: React.FC<CartClientProps> = ({ products }) => {
  const cart = useCart();

  if (cart.items.length === 0) {
    return (
      <div className="bg-white p-12 text-center">
        <ShoppingBag className="w-24 h-24 text-gray-300 mx-auto mb-6" />
        <h2 className="text-2xl font-light text-black uppercase tracking-wider mb-2">
          Your cart is empty
        </h2>
        <p className="text-gray-600 mb-8 text-sm font-light">
          You don't have any products in your cart. Start shopping now!
        </p>
        <Button
          asChild
          variant="outline"
          className="rounded-none px-8 py-3 text-xs font-light uppercase tracking-wider"
        >
          <Link href="/">Continue shopping</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="grid lg:grid-cols-12 gap-8">
      {/* Cart Items */}
      <div className="lg:col-span-7 space-y-4">
        {cart.items.map((item) => (
          <CartItem key={item.cartItemId} data={item} />
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
