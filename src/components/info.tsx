"use client";

import { Product } from "@/types";
import { ShoppingCart, Star } from "lucide-react";
import { Button } from "./ui/button";

interface InfoProps {
  data: Product;
}

const Info: React.FC<InfoProps> = ({ data }) => {
  const formatVND = (value: number) => {
    return value.toLocaleString("vi-VN") + " ₫";
  };
  return (
    <div
      className="
        space-y-6 
        p-6 
        rounded-2xl 
        backdrop-blur-xl 
        bg-white/30 
        border border-white/20 
        shadow-xl
      "
    >
      {/* Title */}
      <div className="flex items-center gap-3">
        <h1 className="text-3xl font-bold text-gray-900">{data.name}</h1>

        {data.badge && (
          <span className="rounded-md bg-red-600 px-2 py-0.5 text-sm text-white">
            {data.badge}
          </span>
        )}
      </div>

      {/* Ratings + Sold */}
      <div className="flex items-center gap-4">
        {data.rating && (
          <div className="flex items-center gap-1">
            <Star className="w-5 h-5 text-yellow-500 fill-yellow-500" />
            <span className="text-gray-700 font-medium">{data.rating}/5</span>
          </div>
        )}
        {data.sold !== undefined && (
          <span className="text-gray-600 text-sm">{data.sold} sold</span>
        )}
      </div>

      {/* Price */}
      <div>
        <div className="flex items-end gap-3">
          <p className="text-3xl font-semibold text-gray-900 drop-shadow-sm">
            {formatVND(data.price)}
          </p>

          {data.originalPrice && data.originalPrice > data.price && (
            <p className="text-lg text-gray-500 line-through">
              {formatVND(data.originalPrice)}
            </p>
          )}
        </div>
      </div>

      <hr className="border-white/40" />

      {/* Size & Color */}
      <div className="flex flex-col gap-y-6">
        <div className="flex items-center gap-x-4">
          <h3 className="font-semibold text-black">Size:</h3>
          <div>{data?.size?.name}</div>
        </div>

        <div className="flex items-center gap-x-4">
          <h3 className="font-semibold text-black">Color:</h3>
          <div
            className="h-6 w-6 rounded-full border border-gray-600"
            style={{ backgroundColor: data?.color?.value }}
          />
        </div>
      </div>

      {/* Description */}
      <div>
        <h3 className="font-semibold text-black mb-1">Description:</h3>
        <p className="text-gray-700 leading-relaxed">{data.description}</p>
      </div>

      {/* Add to cart */}
      <div className="mt-6 flex items-center gap-x-3">
        <Button className="flex items-center gap-x-2" disabled={!data.inStock}>
          Add To Cart
          <ShoppingCart />
        </Button>
      </div>
    </div>
  );
};

export default Info;
