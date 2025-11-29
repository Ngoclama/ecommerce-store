"use client";

import Currency from "@/components/ui/currency";
import useCart from "@/hooks/use-cart";
import { CartItem as CartItemType } from "@/types";
import { Plus, Minus, Trash2 } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { motion } from "framer-motion";

interface CartItemProps {
  data: CartItemType;
}

const CartItem: React.FC<CartItemProps> = ({ data }) => {
  const cart = useCart();

  // Kiểm tra xem có thể tăng tiếp không
  const canIncrease =
    data.inventory !== undefined && data.quantity < data.inventory;

  const handleQuantityChange = (newQty: number) => {
    const safeQty = Math.max(0, newQty);
    const inventory = data.inventory ?? 999;

    if (safeQty > inventory) {
      toast.error(`Chỉ còn ${inventory} sản phẩm trong kho.`);
      return;
    }

    if (safeQty === 0) {
      cart.removeItem(data.cartItemId);
      toast.success("Đã xóa sản phẩm khỏi giỏ hàng");
    } else {
      cart.setQuantity(data.cartItemId, safeQty);
    }
  };

  const handleRemove = () => {
    cart.removeItem(data.cartItemId);
    toast.success("Đã xóa sản phẩm khỏi giỏ hàng");
  };

  return (
    <motion.div
      layout
      className="border-b border-gray-200 pb-6 mb-6 bg-white last:border-0 last:pb-0 last:mb-0"
    >
      <div className="flex items-start gap-4 md:gap-6">
        {/* Image */}
        <Link
          href={`/product/${data.id}`}
          className="relative w-20 h-20 md:w-24 md:h-24 overflow-hidden shrink-0 bg-gray-50 border border-gray-200 group"
        >
          <Image
            fill
            src={data.images?.[0]?.url || "/placeholder.png"}
            alt={data.name}
            className="object-cover group-hover:scale-105 transition-transform duration-200"
          />
        </Link>

        {/* Product info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1 min-w-0">
              <Link href={`/product/${data.id}`}>
                <h3 className="text-sm md:text-base font-light text-black uppercase tracking-wide hover:text-gray-600 transition-colors duration-200 line-clamp-2 mb-2">
                  {data.name}
                </h3>
              </Link>

              <div className="mt-1 text-xs font-light text-gray-500 space-y-0.5">
                {data.size && (
                  <p>
                    <span className="uppercase tracking-wide">Size:</span>{" "}
                    {data.size.name}
                  </p>
                )}
                {data.color && (
                  <p>
                    <span className="uppercase tracking-wide">Màu:</span>{" "}
                    {data.color.name}
                  </p>
                )}
              </div>

              {/* Price */}
              <div className="mt-3 mb-4">
                <span className="text-base md:text-lg font-medium text-black">
                  <Currency value={data.price * data.quantity} />
                </span>
                {data.quantity > 1 && (
                  <span className="text-xs text-gray-500 ml-2">
                    ({data.quantity} × <Currency value={data.price} />)
                  </span>
                )}
              </div>
            </div>

            {/* Delete button */}
            <Button
              variant="ghost"
              size="icon"
              onClick={handleRemove}
              className="rounded-none hover:bg-gray-100 transition-colors duration-200 p-1.5"
              aria-label="Xóa sản phẩm"
            >
              <Trash2 className="h-4 w-4 text-gray-400 hover:text-red-500 transition-colors duration-200" />
            </Button>
          </div>

          {/* Quantity Controls */}
          <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-100">
            <span className="text-xs font-light text-gray-600 uppercase tracking-wide">
              Số lượng:
            </span>
            <div className="flex items-center gap-2">
              <button
                onClick={() => handleQuantityChange(data.quantity - 1)}
                disabled={data.quantity <= 1}
                className={cn(
                  "w-8 h-8 border border-gray-300 flex items-center justify-center transition-all duration-200 rounded-none bg-white",
                  data.quantity <= 1
                    ? "border-gray-200 text-gray-300 cursor-not-allowed"
                    : "text-black hover:border-black hover:bg-gray-50"
                )}
                aria-label="Giảm số lượng"
              >
                <Minus className="w-3.5 h-3.5" />
              </button>
              <span className="w-10 text-center text-black text-sm font-medium">
                {data.quantity}
              </span>
              <button
                onClick={() => handleQuantityChange(data.quantity + 1)}
                disabled={!canIncrease}
                className={cn(
                  "w-8 h-8 border border-gray-300 flex items-center justify-center transition-all duration-200 rounded-none bg-white",
                  !canIncrease
                    ? "border-gray-200 text-gray-300 cursor-not-allowed"
                    : "text-black hover:border-black hover:bg-gray-50"
                )}
                aria-label="Tăng số lượng"
              >
                <Plus className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default CartItem;
