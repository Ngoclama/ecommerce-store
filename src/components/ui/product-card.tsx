"use client";

import { Product } from "@/types";
import Image from "next/image";
import IconButton from "@/components/ui/icon-button";
import { Heart, ShoppingBag, Eye, Star } from "lucide-react";
import { useState } from "react";

interface ProductCardProps {
  data: Product;
  onAddToCart?: () => void;
  onViewDetails?: () => void;
  onToggleFavorite?: () => void;
}

const ProductCard: React.FC<ProductCardProps> = ({
  data,
  onAddToCart,
  onViewDetails,
  onToggleFavorite,
}) => {
  const [isFavorite, setIsFavorite] = useState(false);
  const [imageError, setImageError] = useState(false);

  const handleFavorite = () => {
    setIsFavorite(!isFavorite);
    onToggleFavorite?.();
  };

  const discountPercent =
    data.originalPrice && data.price
      ? Math.round(
          ((data.originalPrice - data.price) / data.originalPrice) * 100
        )
      : 0;

  return (
    <div className="group cursor-pointer bg-white rounded-md border border-gray-200 hover:shadow-lg transition-all duration-300 overflow-hidden">
      {/* IMAGE WRAPPER */}
      <div className="relative aspect-square bg-gray-100 overflow-hidden">
        <Image
          src={
            !imageError
              ? data?.images?.[0]?.url
              : "/placeholder.svg?height=400&width=400"
          }
          alt={data.name}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-110"
          onError={() => setImageError(true)}
        />

        {/* BADGE (V0 UI + your logic) */}
        {(data.badge || (discountPercent > 0 && data.price)) && (
          <div className="absolute top-2 left-2 flex gap-2">
            {data.badge && (
              <span className="px-2.5 py-1 bg-primary text-primary-foreground text-xs font-semibold rounded-full shadow">
                {data.badge}
              </span>
            )}
            {discountPercent > 0 && (
              <span className="px-2.5 py-1 bg-red-500 text-white text-xs font-bold rounded-sm shadow">
                -{discountPercent}%
              </span>
            )}
          </div>
        )}

        {/* OUT OF STOCK */}
        {data.inStock === false && (
          <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
            <span className="text-white font-semibold">Hết hàng</span>
          </div>
        )}

        {/* ACTION BUTTONS (V0 Style – modern) */}
        <div className="absolute inset-0 bg-black/10 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-all duration-300 flex items-end justify-center pb-4">
          <div className="flex gap-3 scale-75 opacity-0 group-hover:scale-100 group-hover:opacity-100 transition-all duration-300">
            <IconButton
              onClick={onViewDetails}
              icon={<Eye size={20} className="text-gray-700" />}
              className="bg-white hover:bg-gray-100 shadow"
            />

            <IconButton
              onClick={onAddToCart}
              icon={<ShoppingBag size={20} className="text-gray-700" />}
              className="bg-white hover:bg-gray-100 shadow"
              disabled={data.inStock === false}
            />
          </div>
        </div>

        {/* FAVORITE BUTTON (Your logic + v0 UI) */}
        <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <IconButton
            onClick={handleFavorite}
            icon={
              <Heart
                size={20}
                className={
                  isFavorite ? "text-red-500 fill-red-500" : "text-gray-700"
                }
              />
            }
            className="bg-white/90 hover:bg-white shadow"
          />
        </div>
      </div>

      {/* PRODUCT INFO */}
      <div className="p-3 space-y-2">
        {/* Category */}
        {data.category && (
          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
            {data.category.name}
          </p>
        )}

        {/* NAME */}
        <h3 className="font-semibold text-gray-800 line-clamp-2 group-hover:text-primary transition-colors duration-200">
          {data.name}
        </h3>

        {/* RATING + SOLD (Shopee style) */}
        <div className="flex items-center gap-2 text-xs text-gray-500">
          {/* Stars */}
          <div className="flex items-center gap-0.5">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                size={14}
                className={
                  i < Math.round(data.rating || 0)
                    ? "fill-yellow-400 text-yellow-400"
                    : "text-gray-300"
                }
              />
            ))}
          </div>

          {/* Sold */}
          {data.sold && (
            <>
              <span>•</span>
              <span>Đã bán {data.sold}</span>
            </>
          )}
        </div>

        {/* PRICE (Shopee + VND + v0 typography) */}
        <div className="flex items-center gap-2 pt-1">
          <span className="text-lg font-bold text-red-500">
            {new Intl.NumberFormat("vi-VN", {
              style: "currency",
              currency: "VND",
            }).format(Number(data.price))}
          </span>

          {data.originalPrice && data.originalPrice > data.price && (
            <span className="text-sm text-gray-400 line-through">
              {new Intl.NumberFormat("vi-VN").format(
                Number(data.originalPrice)
              )}
              ₫
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
