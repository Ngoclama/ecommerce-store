"use client";

import Container from "@/components/ui/container";
import useCart from "@/hooks/use-cart";
import CartItem from "./components/cart-item";
import Summary from "./components/summary";
import { useCallback } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";

const CartPage = () => {
  const cart = useCart();

  const onClearCart = useCallback(() => {
    if (window.confirm("Are you sure you want to clear the cart?")) {
      cart.removeAll();
    }
    toast.success("Cart cleared.");
  }, [cart]);

  return (
    <div className="bg-white">
      <Container>
        <div className="px-4 py-16 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold text-black mb-8">Shopping Cart</h1>

          {cart.items.length === 0 ? (
            <p className="text-neutral-500 mt-6">No items added to cart</p>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Left side: Cart Items */}
              <div className="lg:col-span-2 space-y-4">
                {cart.items.map((item) => (
                  <CartItem key={item.cartItemId} data={item} />
                ))}
                <div className=" pt-4 text-black ">
                  <Button
                    variant="outline"
                    onClick={onClearCart}
                    className="cursor-pointer"
                  >
                    Clear Cart
                  </Button>
                </div>
              </div>

              {/* Right side: Summary */}
              <div className="lg:col-span-1">
                <Summary />
              </div>
            </div>
          )}
        </div>
      </Container>
    </div>
  );
};

export default CartPage;
