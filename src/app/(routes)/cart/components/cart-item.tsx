"use client";

import Currency from "@/components/ui/currency";
// [FIX 1] Import CartItemType từ @/types
import useCart from "@/hooks/use-cart";
import { CartItem as CartItemType } from "@/types";
import { X, Plus, Minus, Pencil } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface CartItemProps {
  data: CartItemType;
}

const CartItem: React.FC<CartItemProps> = ({ data }) => {
  const cart = useCart();

  // [FIX TỒN KHO] Kiểm tra xem có thể tăng tiếp không
  const canIncrease =
    data.inventory !== undefined && data.quantity < data.inventory;

  return (
    <div className="border-b border-gray-200 pb-6 mb-6 bg-white">
      {/* TOP ROW - Aigle Style */}
      <div className="flex items-start gap-4">
        {/* Image */}
        <div className="relative w-24 h-24 overflow-hidden shrink-0 bg-gray-50">
          <Image
            fill
            src={data.images?.[0]?.url || "/placeholder.png"}
            alt={data.name}
            className="object-cover"
          />
        </div>

        {/* Product info */}
        <div className="flex-1">
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1">
              <Link href={`/product/${data.id}`}>
                <p className="text-sm font-light text-black uppercase tracking-wide hover:underline cursor-pointer line-clamp-2">
                  {data.name}
                </p>
              </Link>

              <div className="mt-1 text-xs font-light text-gray-600 space-y-1">
                {data.size && <p>Size: {data.size.name}</p>}
                {data.color && <p>Color: {data.color.name}</p>}
              </div>
            </div>

            {/* Delete button */}
            <Button
              variant="ghost"
              size="icon"
              onClick={() => cart.removeItem(data.cartItemId)}
              className="rounded-none hover:bg-gray-100"
            >
              <X className="h-4 w-4 text-black" />
            </Button>
          </div>

          {/* Price + quantity - Aigle Style */}
          <div className="flex items-center justify-between mt-4">
            <Currency value={data.price * data.quantity} />

            {/* Quantity box */}
            <div className="flex items-center border border-gray-300 rounded-none px-2 py-1 bg-white">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => cart.decreaseQuantity(data.cartItemId)}
                className="w-8 h-8 flex justify-center items-center text-black hover:bg-gray-100 transition p-0 rounded-none"
              >
                <Minus className="h-4 w-4" />
              </Button>

              <span className="px-3 text-sm font-light">{data.quantity}</span>

              <Button
                variant="ghost"
                size="icon"
                onClick={() => cart.increaseQuantity(data.cartItemId)}
                disabled={!canIncrease}
                className={`w-8 h-8 flex justify-center items-center transition p-0 rounded-none ${
                  !canIncrease
                    ? "opacity-50 cursor-not-allowed"
                    : "text-black hover:bg-gray-100"
                }`}
              >
                <Plus size={14} />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartItem;
