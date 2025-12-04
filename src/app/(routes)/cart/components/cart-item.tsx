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
      whileHover={{ y: -2 }}
      className="bg-white dark:bg-gray-900 border-2 border-neutral-200 dark:border-neutral-800 rounded-sm p-4 md:p-6 shadow-lg hover:shadow-xl transition-all duration-300"
    >
      <div className="flex items-start gap-4 md:gap-6">
        {/* Image - Luxury Style */}
        <Link
          href={`/product/${data.id}`}
          className="relative w-24 h-24 md:w-32 md:h-32 overflow-hidden shrink-0 bg-neutral-100 dark:bg-neutral-900 border-2 border-neutral-200 dark:border-neutral-800 rounded-sm group"
        >
          <motion.div
            whileHover={{ scale: 1.1 }}
            transition={{ duration: 0.5, ease: [0.25, 0.1, 0.25, 1] }}
            className="absolute inset-0"
          >
            <Image
              fill
              src={data.images?.[0]?.url || "/placeholder.png"}
              alt={data.name}
              sizes="(max-width: 768px) 96px, 128px"
              className="object-cover"
            />
          </motion.div>
        </Link>

        {/* Product info - Luxury Style */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-4 mb-4">
            <div className="flex-1 min-w-0">
              <Link href={`/product/${data.id}`}>
                <motion.h3
                  whileHover={{ x: 4 }}
                  className="text-base md:text-lg font-light text-neutral-900 dark:text-neutral-100 uppercase tracking-tight hover:text-neutral-600 dark:hover:text-neutral-400 transition-colors duration-300 line-clamp-2 mb-3"
                >
                  {data.name}
                </motion.h3>
              </Link>

              <div className="flex flex-wrap items-center gap-3 mb-4">
                {data.size && (
                  <span className="px-3 py-1 bg-neutral-100 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-sm text-xs font-light text-neutral-600 dark:text-neutral-400 uppercase tracking-[0.15em]">
                    Size: {data.size.name}
                  </span>
                )}
                {data.color && (
                  <span className="px-3 py-1 bg-neutral-100 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-sm text-xs font-light text-neutral-600 dark:text-neutral-400 uppercase tracking-[0.15em]">
                    Màu: {data.color.name}
                  </span>
                )}
              </div>

              {/* Price - Luxury Style */}
              <div className="mb-4">
                <div className="text-xl md:text-2xl font-light text-neutral-900 dark:text-neutral-100 mb-1">
                  <Currency value={data.price * data.quantity} />
                </div>
                {data.quantity > 1 && (
                  <p className="text-xs text-neutral-500 dark:text-neutral-400 font-light">
                    {data.quantity} × <Currency value={data.price} />
                  </p>
                )}
              </div>
            </div>

            {/* Delete button - Luxury Style */}
            <motion.button
              onClick={handleRemove}
              whileHover={{ scale: 1.1, rotate: 5 }}
              whileTap={{ scale: 0.9 }}
              className="p-2 rounded-sm border-2 border-neutral-200 dark:border-neutral-800 hover:border-red-500 dark:hover:border-red-500 bg-white dark:bg-gray-900 hover:bg-red-50 dark:hover:bg-red-950/20 transition-all duration-300 shrink-0"
              aria-label="Xóa sản phẩm"
            >
              <Trash2 className="h-4 w-4 text-neutral-400 dark:text-neutral-600 hover:text-red-500 dark:hover:text-red-400 transition-colors duration-300" />
            </motion.button>
          </div>

          {/* Quantity Controls - Luxury Style */}
          <div className="flex items-center justify-between pt-4 border-t-2 border-neutral-200 dark:border-neutral-800">
            <span className="text-xs font-light text-neutral-600 dark:text-neutral-400 uppercase tracking-[0.15em]">
              Số lượng:
            </span>
            <div className="flex items-center gap-2">
              <motion.button
                onClick={() => handleQuantityChange(data.quantity - 1)}
                disabled={data.quantity <= 1}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                className={cn(
                  "w-10 h-10 border-2 rounded-sm flex items-center justify-center transition-all duration-300 bg-white dark:bg-gray-900",
                  data.quantity <= 1
                    ? "border-neutral-200 dark:border-neutral-800 text-neutral-300 dark:text-neutral-700 cursor-not-allowed"
                    : "border-neutral-300 dark:border-neutral-700 text-neutral-900 dark:text-neutral-100 hover:border-neutral-900 dark:hover:border-neutral-100 hover:bg-neutral-50 dark:hover:bg-neutral-800"
                )}
                aria-label="Giảm số lượng"
              >
                <Minus className="w-4 h-4" />
              </motion.button>
              <span className="w-12 text-center text-neutral-900 dark:text-neutral-100 text-sm font-light">
                {data.quantity}
              </span>
              <motion.button
                onClick={() => handleQuantityChange(data.quantity + 1)}
                disabled={!canIncrease}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                className={cn(
                  "w-10 h-10 border-2 rounded-sm flex items-center justify-center transition-all duration-300 bg-white dark:bg-gray-900",
                  !canIncrease
                    ? "border-neutral-200 dark:border-neutral-800 text-neutral-300 dark:text-neutral-700 cursor-not-allowed"
                    : "border-neutral-300 dark:border-neutral-700 text-neutral-900 dark:text-neutral-100 hover:border-neutral-900 dark:hover:border-neutral-100 hover:bg-neutral-50 dark:hover:bg-neutral-800"
                )}
                aria-label="Tăng số lượng"
              >
                <Plus className="w-4 h-4" />
              </motion.button>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default CartItem;
