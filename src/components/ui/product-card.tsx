"use client";

import { Product } from "@/types";
import Image from "next/image";
import { useState, MouseEvent, MouseEventHandler } from "react";
import { useRouter } from "next/navigation";
import { Heart, ShoppingBag, Eye, Star, X } from "lucide-react";
import { Popover, PopoverTrigger } from "./popover";
import IconButton from "./icon-button";
import useCart from "@/hooks/use-cart";
import { PopoverContent } from "@radix-ui/react-popover";
import { AnimatePresence, motion } from "framer-motion";
import { Button } from "./button";
import PopoverProduct from "../popover-product";
import { toast } from "sonner";
interface ProductCardProps {
  data: Product;
  onAddToCart?: () => void;
  onToggleFavorite?: () => void;
}

const ProductCard: React.FC<ProductCardProps> = ({
  data,
  onToggleFavorite,
}) => {
  const router = useRouter();
  const [isFavorite, setIsFavorite] = useState(false);
  const [imageError, setImageError] = useState(false);
  const [quickViewOpen, setQuickViewOpen] = useState(false);
  const cart = useCart();

  const onAddToCart: MouseEventHandler<HTMLButtonElement> = (e) => {
    e.stopPropagation();
    cart.addItem(data);
    toast.success("Item added to cart.");
  };

  const handleFavorite = (e: MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    setIsFavorite(!isFavorite);
    onToggleFavorite?.();
  };

  const handleClick = () => {
    router.push(`/product/${data.id}`);
  };

  const handleQuickView = (e: MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    setQuickViewOpen(true);
  };

  const discountPercent =
    data.originalPrice && data.price
      ? Math.round(
          ((data.originalPrice - data.price) / data.originalPrice) * 100
        )
      : 0;

  return (
    <>
      <PopoverProduct
        product={data}
        isOpen={quickViewOpen}
        onClose={() => setQuickViewOpen(false)}
      />
      <div
        onClick={handleClick}
        className="group cursor-pointer bg-white rounded-md border border-gray-200 hover:shadow-lg transition-all duration-300 overflow-hidden"
      >
        {/* IMAGE */}
        <div className="relative aspect-square bg-gray-100 overflow-hidden">
          <Image
            src={!imageError ? data.images?.[0]?.url : "/placeholder.svg"}
            alt={data.name}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-110"
            onError={() => setImageError(true)}
          />

          {/* BADGES */}
          {(data.badge || discountPercent > 0) && (
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

          {/* ACTION BUTTONS */}
          <div className="absolute inset-0 bg-black/10 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-all duration-300 flex items-end justify-center pb-4">
            <div className="flex gap-3 scale-75 opacity-0 group-hover:scale-100 group-hover:opacity-100 transition-all duration-300">
              {/* Quick View */}
              <Popover open={quickViewOpen} onOpenChange={setQuickViewOpen}>
                <PopoverTrigger asChild>
                  <IconButton
                    onClick={handleQuickView}
                    icon={<Eye size={20} className="text-gray-700" />}
                    className="bg-white hover:bg-gray-100 shadow"
                  />
                </PopoverTrigger>
                <PopoverContent
                  side="right"
                  align="start"
                  className="w-96 p-4 bg-white/30 backdrop-blur-lg rounded-2xl shadow-2xl border border-white/20 dark:bg-slate-900/30 dark:border-slate-700 z-50"
                >
                  <AnimatePresence>
                    <motion.div
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.9 }}
                      transition={{
                        type: "spring",
                        stiffness: 300,
                        damping: 25,
                      }}
                    >
                      <div className="flex justify-end mb-2">
                        <IconButton
                          onClick={(e) => {
                            e.stopPropagation();
                            setQuickViewOpen(false);
                          }}
                          icon={<X size={20} />}
                          className="bg-gray-100 hover:bg-gray-200 shadow"
                        />
                      </div>
                      <div className="flex flex-col gap-3">
                        <Image
                          src={data.images?.[0]?.url || "/placeholder.svg"}
                          alt={data.name}
                          width={300}
                          height={300}
                          className="object-contain"
                        />
                        <h3 className="font-bold text-lg">{data.name}</h3>
                        <p className="text-gray-600 line-clamp-3">
                          {data.description}
                        </p>
                        <div className="flex items-center gap-2 pt-1">
                          <span className="text-lg font-bold text-black">
                            {new Intl.NumberFormat("vi-VN", {
                              style: "currency",
                              currency: "VND",
                            }).format(Number(data.price))}
                          </span>
                          {data.originalPrice &&
                            data.originalPrice > data.price && (
                              <span className="text-sm text-gray-400 line-through">
                                {new Intl.NumberFormat("vi-VN").format(
                                  Number(data.originalPrice)
                                )}
                                ₫
                              </span>
                            )}
                        </div>
                        <Button onClick={onAddToCart} className="w-full">
                          Add To Cart
                        </Button>
                      </div>
                    </motion.div>
                  </AnimatePresence>
                </PopoverContent>
              </Popover>

              {/* Add to Cart */}
              <IconButton
                onClick={onAddToCart}
                icon={<ShoppingBag size={20} className="text-gray-700" />}
                className="bg-white hover:bg-gray-100 shadow"
                disabled={data.inStock === false}
              />
            </div>
          </div>

          {/* FAVORITE BUTTON */}
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
          {data.category && (
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
              {data.category.name}
            </p>
          )}
          <h3 className="font-semibold text-gray-800 line-clamp-2 group-hover:text-primary transition-colors duration-200">
            {data.name}
          </h3>
          <div className="flex items-center gap-2 text-xs text-gray-500">
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
            {data.sold && (
              <>
                <span>•</span>
                <span>Đã bán {data.sold}</span>
              </>
            )}
          </div>
          <div className="flex items-center gap-2 pt-1">
            <span className="text-lg font-bold text-black">
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
    </>
  );
};

export default ProductCard;
