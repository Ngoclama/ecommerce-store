"use client";

import Currency from "@/components/ui/currency";
import useCart, { CartItem as CartItemType } from "@/hooks/use-cart";
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

  return (
    <div className="border border-gray-300 rounded-xl p-5 mb-4 bg-white shadow-sm">
      {/* TOP ROW */}
      <div className="flex items-start gap-4">
        {/* Delete button */}
        <Button
          variant="ghost"
          size="icon"
          onClick={() => cart.removeItem(data.cartItemId)}
          className="rounded-full hover:bg-red-100"
        >
          <X className="h-4 w-4 text-red-500" />
        </Button>

        {/* Image */}
        <div className="relative w-28 h-28 rounded-lg overflow-hidden flex-shrink-0">
          <Image
            fill
            src={data.images?.[0]?.url || "/placeholder.png"}
            alt={data.name}
            className="object-cover"
          />
        </div>

        {/* Product info */}
        <div className="flex-1">
          <Link href={`/product/${data.id}`}>
            <p className="text-base font-semibold text-black hover:underline cursor-pointer line-clamp-2">
              {data.name}
            </p>
          </Link>

          <p className="text-sm text-gray-600">Mã SP: {data.id}</p>

          <div className="mt-1 text-sm text-gray-500 space-y-1">
            <p>Size: {data.size.name}</p>
            <p>Color: {data.color.name}</p>
          </div>
        </div>

        {/* Price + quantity */}
        <div className="flex flex-col items-end gap-3">
          <Currency value={data.price * data.quantity} />

          {/* Quantity box */}
          <div className="flex items-center border rounded-lg px-2 py-1 bg-gray-50">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => cart.decreaseQuantity(data.cartItemId)}
              className="h-7 w-7"
            >
              <Minus className="h-4 w-4" />
            </Button>

            <span className="px-3 font-medium">{data.quantity}</span>

            <Button
              variant="ghost"
              size="icon"
              onClick={() => cart.increaseQuantity(data.cartItemId)}
              className="h-7 w-7"
            >
              <Plus className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* NOTE INPUT */}
      <div className="mt-4">
        <label className="text-sm text-gray-600 mb-2 block">
          Ghi chú đơn hàng
        </label>

        <div className="relative">
          <Input
            placeholder="Ghi chú cho sản phẩm..."
            className="pr-10 border-gray-300"
          />
          <Pencil className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 h-4 w-4" />
        </div>
      </div>
    </div>
  );
};

export default CartItem;
