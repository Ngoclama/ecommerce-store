"use client";

import { Product } from "@/types";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Button } from "./ui/button";
import { ShoppingCart, Star } from "lucide-react";

interface PopoverProductProps {
  product: Product;
}

const PopoverProduct: React.FC<PopoverProductProps> = ({ product }) => {
  const router = useRouter();

  if (!product) {
    return null;
  }

  const formatVND = (value: number) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(value);
  };

  return (
    <div
      className="w-96 overflow-hidden rounded-xl border border-gray-200 bg-white shadow-2xl"
      onClick={() => router.push(`/product/${product.id}`)}
    >
      {/* Product Image */}
      <div className="relative h-48 w-full">
        <Image
          src={product.images?.[0]?.url || "/placeholder.svg"}
          alt={product.name}
          fill
          className="object-cover"
        />
      </div>

      {/* Product Info */}
      <div className="p-4">
        {/* Category */}
        <p className="mb-1 text-xs font-semibold uppercase tracking-wider text-gray-500">
          {product.category?.name}
        </p>

        {/* Name */}
        <h3 className="truncate text-lg font-bold text-gray-900">
          {product.name}
        </h3>

        {/* Rating & Sold */}
        <div className="mt-2 flex items-center gap-3 text-sm text-gray-600">
          {product.rating && (
            <div className="flex items-center gap-1">
              <Star className="h-4 w-4 text-yellow-400" fill="#facc15" />
              <span className="font-semibold">{product.rating}</span>
            </div>
          )}
          {product.sold && (
            <>
              <span className="text-gray-300">|</span>
              <span>
                Đã bán <span className="font-semibold">{product.sold}</span>
              </span>
            </>
          )}
        </div>

        {/* Price */}
        <div className="mt-3 flex items-baseline gap-2">
          <p className="text-2xl font-bold text-red-600">
            {formatVND(product.price)}
          </p>
          {product.originalPrice && product.originalPrice > product.price && (
            <p className="text-sm text-gray-400 line-through">
              {formatVND(product.originalPrice)}
            </p>
          )}
        </div>

        {/* Action Button */}
        <Button className="mt-4 w-full" disabled={!product.inStock}>
          <ShoppingCart className="mr-2 h-5 w-5" />
          {product.inStock ? "Thêm vào giỏ hàng" : "Hết hàng"}
        </Button>
      </div>
    </div>
  );
};

export default PopoverProduct;