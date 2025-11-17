"use client";

import Currency from "@/components/ui/currency";
import IconButton from "@/components/ui/icon-button";
import useCart, { CartItem as CartItemType } from "@/hooks/use-cart";
import { X, Plus, Minus, Pencil } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

interface CartItemProps {
  data: CartItemType;
}

const CartItem: React.FC<CartItemProps> = ({ data }) => {
  const cart = useCart();

  return (
    <div className="border border-black/20 rounded-xl p-4 mb-4 bg-white">
      {/* Row top */}
      <div className="flex items-start gap-4">
        {/* Delete button left */}
        <IconButton
          onClick={() => cart.removeItem(data.cartItemId)}
          icon={<X size={18} />}
        />

        {/* Image */}
        <div className="relative w-24 h-24 overflow-hidden rounded-md flex-shrink-0">
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
            <p className="text-lg font-semibold text-black hover:underline cursor-pointer">
              {data.name}
            </p>
          </Link>

          <p className="text-sm text-blue-600 font-medium">Mã SP: {data.id}</p>

          <div className="mt-1 text-sm text-gray-600 space-y-1">
            <p>Size: {data.size.name}</p>
            <p>Color: {data.color.name}</p>
          </div>
        </div>

        {/* Price + quantity */}
        <div className="flex flex-col items-end gap-3">
          <Currency value={data.price * data.quantity} />

          <div className="flex items-center gap-2">
            <IconButton
              onClick={() => cart.decreaseQuantity(data.cartItemId)}
              icon={<Minus size={16} />}
            />
            <span className="font-medium">{data.quantity}</span>
            <IconButton
              onClick={() => cart.increaseQuantity(data.cartItemId)}
              icon={<Plus size={16} />}
            />
          </div>
        </div>
      </div>

      {/* Note box */}
      <div className="mt-4 border border-gray-300 rounded-lg p-3 flex items-center justify-between">
        <span className="text-sm text-gray-600">Ghi chú cho sản phẩm...</span>
        <Pencil size={16} className="text-gray-500" />
      </div>
    </div>
  );
};

export default CartItem;
