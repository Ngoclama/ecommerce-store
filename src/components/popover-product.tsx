"use client";

import { Product } from "@/types";
import Image from "next/image";
import { MouseEventHandler, useEffect, useState } from "react";
import { Button } from "./ui/button";
import { ShoppingCart, X, Gift, Zap, ArrowRight } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import Link from "next/link";

import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "./ui/select";
import useCart from "@/hooks/use-cart";
import { toast } from "sonner";

interface PopoverProductProps {
  product: Product;

  isOpen: boolean;
  onClose: () => void;
}

const PopoverProduct: React.FC<PopoverProductProps> = ({
  product,
  isOpen,
  onClose,
}) => {
  const [currentImage, setCurrentImage] = useState(0);
  const [selectedSize, setSelectedSize] = useState(product.size?.name);
  const cart = useCart();
  const onAddToCart: MouseEventHandler<HTMLButtonElement> = (e) => {
    e.stopPropagation();
    cart.addItem(product);
    toast.success("Item added to cart.");
  };

  useEffect(() => {
    if (!product?.images || product.images.length <= 1) return;
    const interval = setInterval(() => {
      setCurrentImage((prev) => (prev + 1) % product.images.length);
    }, 3000);
    return () => clearInterval(interval);
  }, [product]);

  if (!product) return null;

  const formatVND = (value: number) =>
    new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(value);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* BACKDROP */}
          <motion.div
            className="fixed inset-0 z-40 bg-white/40 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />

          {/* POPOVER */}
          <motion.div
            className="fixed top-1/2 left-1/2 z-50 w-[92%] max-w-5xl 
              -translate-x-1/2 -translate-y-1/2 bg-white/50 backdrop-blur-xl 
              rounded-2xl shadow-xl border border-white/30 overflow-hidden 
              flex flex-col md:flex-row"
            initial={{ scale: 0.85, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.85, opacity: 0 }}
            transition={{
              type: "spring",
              stiffness: 250,
              damping: 22,
            }}
          >
            {/* Close */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                onClose();
              }}
              className="absolute top-3 right-3 p-1 rounded-full bg-white/70 hover:bg-gray-200"
            >
              <X size={20} />
            </button>

            {/* LEFT: IMAGE */}
            <div className="md:w-1/2 w-full bg-gray-100">
              <div className="relative w-full h-96 md:h-full">
                <Image
                  src={
                    product.images?.[currentImage]?.url || "/placeholder.svg"
                  }
                  alt={product.name}
                  fill
                  className="object-cover"
                />
              </div>

              {/* Thumbnails */}
              {product.images?.length > 1 && (
                <div className="flex gap-2 p-3 overflow-x-auto">
                  {product.images.map((img, idx) => (
                    <div
                      key={idx}
                      className={`w-20 h-20 border-2 rounded-lg overflow-hidden 
                        cursor-pointer transition ${
                          idx === currentImage
                            ? "border-red-500"
                            : "border-gray-300"
                        }`}
                      onClick={(e) => {
                        e.stopPropagation();
                        setCurrentImage(idx);
                      }}
                    >
                      <Image
                        src={img.url}
                        alt="thumb"
                        width={80}
                        height={80}
                        className="object-cover"
                      />
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* RIGHT: INFO */}
            <div className="md:w-1/2 w-full p-6 flex flex-col gap-5">
              {/* NAME + ID */}
              <div>
                <Link
                  href={`/product/${product.id}`}
                  className="text-2xl font-bold hover:text-blue-600 transition"
                >
                  {product.name}
                </Link>

                <p className="text-sm text-black">Thương hiệu: -</p>

                <p className="text-sm font-semibold text-blue-600">
                  Mã sản phẩm: {product.id}
                </p>
              </div>

              {/* PRICE */}
              <div className="text-3xl font-bold text-red-600 drop-shadow">
                {formatVND(product.price)}
              </div>

              {/* COLOR */}
              {product.color && (
                <div className="flex items-center gap-3">
                  <span className="font-medium">Màu sắc:</span>
                  <div
                    className="w-6 h-6 rounded-full border border-gray-400 shadow"
                    style={{ backgroundColor: product.color.value }}
                  />
                </div>
              )}

              {/* SIZE - shadcn SELECT */}
              <div className="flex items-center gap-3">
                <span className="font-medium">Size:</span>
                <Select
                  value={selectedSize}
                  onValueChange={(val) => setSelectedSize(val)}
                >
                  <SelectTrigger className="w-32">
                    <SelectValue placeholder="Chọn size" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value={product.size?.name || ""}>
                      {product.size?.name}
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* KHUYẾN MÃI */}
              <div className="border border-dashed border-red-400 p-4 rounded-xl">
                <div className="flex items-center gap-2 text-red-600 font-bold mb-2">
                  <Gift size={18} /> KHUYẾN MÃI - ƯU ĐÃI
                </div>

                <ul className="text-sm text-gray-700 space-y-1">
                  <li>🎁 Nhập mã NKF50K thêm 50K đơn hàng từ 1tr</li>
                  <li>🚚 Ship toàn quốc 20.000đ</li>
                  <li>🚛 Free Ship với đơn hàng từ 500k</li>
                  <li>🔍 Kiểm hàng trước khi thanh toán</li>
                  <li>↩️ Đổi hàng trong 7 ngày (sản phẩm lỗi miễn phí)</li>
                </ul>
              </div>

              {/* BUTTONS */}
              <div className="flex flex-col gap-3 mt-2">
                <Button
                  onClick={onAddToCart}
                  className="w-full flex items-center gap-2"
                  // disabled={!product.inStock}
                >
                  <ShoppingCart size={18} />
                  Thêm vào giỏ hàng
                </Button>

                <Button className="w-full flex items-center gap-2 bg-orange-500 hover:bg-orange-600 text-white">
                  Mua ngay <Zap size={18} />
                </Button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default PopoverProduct;
