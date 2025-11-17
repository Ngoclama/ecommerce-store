"use client";

import { Product } from "@/types";
import {
  ShoppingCart,
  Gift,
  Truck,
  ShieldCheck,
  BadgeCheck,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import { Button } from "./ui/button";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { useState, useEffect, MouseEventHandler } from "react";
import { motion } from "framer-motion";
import useCart from "@/hooks/use-cart";
import { toast } from "sonner";

interface InfoProps {
  data: Product;
}

const Info: React.FC<InfoProps> = ({ data }) => {
  const [expandDesc, setExpandDesc] = useState(false);
  const [openShipping, setOpenShipping] = useState(false);
  const [timeLeft, setTimeLeft] = useState(24 * 60 * 60);
  const [openReturn, setOpenReturn] = useState(false);

  const [quantity, setQuantity] = useState(1);

  const cart = useCart();
  const onAddToCart: MouseEventHandler<HTMLButtonElement> = (e) => {
    e.stopPropagation();
    cart.addItem(data, quantity);
    toast.success("Item added to cart.");
  };

  useEffect(() => {
    const interval = setInterval(() => {
      setTimeLeft((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const formatTime = (t: number) => {
    const hours = Math.floor(t / 3600);
    const minutes = Math.floor((t % 3600) / 60);
    const seconds = t % 60;
    return `${hours.toString().padStart(2, "0")}:${minutes
      .toString()
      .padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
  };

  const formatVND = (value: number) => {
    return value.toLocaleString("vi-VN") + " ₫";
  };
  const totalPrice = data.price * quantity;
  return (
    <div className="space-y-6 p-6 rounded-2xl bg-white shadow-[0_0_30px_rgba(0,0,0,0.06)]">
      {/* Title */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">{data.name}</h1>
      </div>

      {/* Thương hiệu + Mã SP */}
      <div className="text-sm text-gray-700 space-y-1">
        <p>
          Thương hiệu: <span className="font-medium text-gray-900">—</span>
        </p>
        <p>
          Mã sản phẩm:{" "}
          <span className="text-blue-600 font-medium">{data.id}</span>
        </p>
      </div>

      {/* Ưu đãi mỗi ngày */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="p-4 rounded-xl bg-gradient-to-r from-red-50 to-red-100 border border-red-300 shadow-lg"
      >
        <motion.p
          initial={{ scale: 0.95 }}
          animate={{ scale: 1 }}
          transition={{
            repeat: Infinity,
            duration: 1.2,
            repeatType: "reverse",
          }}
          className="font-semibold text-red-700 mb-1 text-lg"
        >
          🎁 Ưu đãi mỗi ngày
        </motion.p>

        <p className="text-sm text-gray-700">
          Kết thúc trong:{" "}
          <span className="font-bold text-red-600 text-lg">
            {formatTime(timeLeft)}
          </span>
        </p>
      </motion.div>

      {/* Price + Quantity */}
      <div className="flex flex-col gap-3">
        <div className="flex items-end gap-3">
          <p className="text-3xl font-semibold text-gray-900">
            {formatVND(totalPrice)}
          </p>
          {data.originalPrice && data.originalPrice > data.price && (
            <p className="text-lg text-gray-500 line-through">
              {formatVND(data.originalPrice * quantity)}
            </p>
          )}
        </div>

        {/* Buttons tăng giảm số lượng */}
        <div className="flex items-center w-36 border border-gray-300 rounded-lg overflow-hidden">
          <button
            onClick={() => setQuantity((prev) => (prev > 1 ? prev - 1 : 1))}
            className="flex-1 h-10 flex justify-center items-center border-r border-gray-300 text-gray-700 hover:bg-gray-100 transition"
          >
            -
          </button>
          <span className="flex-1 text-center text-lg font-medium">
            {quantity}
          </span>
          <button
            onClick={() => setQuantity((prev) => prev + 1)}
            className="flex-1 h-10 flex justify-center items-center border-l border-gray-300 text-gray-700 hover:bg-gray-100 transition"
          >
            +
          </button>
        </div>
      </div>

      {/* SALE BOX */}
      <div className="border border-red-400 rounded-xl p-4 bg-red-50 relative">
        <div className="absolute -top-3 left-3 bg-red-500 text-white px-3 py-0.5 rounded-md text-sm flex items-center gap-1">
          <Gift className="w-4 h-4" /> KHUYẾN MÃI - ƯU ĐÃI
        </div>

        <div className="mt-2 text-gray-800 text-sm leading-relaxed space-y-1">
          <p>
            Áo Sơ Mi nữ UK Fashion cổ đức cọc tay mí nẹp, chất liệu lụa không
            nhăn UKSM2401016
          </p>
          <p>
            <span className="font-semibold">Nhập mã NKF50K</span> thêm 50K đơn
            hàng từ 1tr —{" "}
            <span className="text-blue-600 cursor-pointer">Sao chép</span>
          </p>
          <p>Đồng giá Ship toàn quốc 20.000đ</p>
          <p>Miễn phí vận chuyển với đơn hàng từ 500k</p>
          <p>Kiểm hàng trước khi thanh toán</p>
          <p>
            Đổi hàng trong vòng 7 ngày — Miễn phí đổi với sản phẩm lỗi sản xuất.
          </p>
        </div>
      </div>

      {/* Mã giảm giá */}
      <div className="p-4 border rounded-xl bg-gray-50">
        <h3 className="font-semibold mb-2">Mã giảm giá</h3>
        <div className="h-10 rounded-lg bg-white border flex items-center justify-center text-gray-500">
          — Chưa có mã —
        </div>
      </div>

      {/* COLOR */}
      <div className="space-y-2">
        <h3 className="font-semibold">Color</h3>
        <div
          className="h-7 w-7 rounded-full border border-gray-600"
          style={{ backgroundColor: data?.color?.value }}
        ></div>
      </div>

      {/* SIZE */}
      <div className="space-y-2">
        <h3 className="font-semibold">Size</h3>
        <ToggleGroup type="single" className="flex gap-2">
          <ToggleGroupItem
            value={data?.size?.name || ""}
            className="px-4 py-2 border rounded-md"
          >
            {data?.size?.name}
          </ToggleGroupItem>
        </ToggleGroup>
      </div>

      {/* Buttons Add to Cart / Buy Now */}
      <div className="flex gap-3">
        <Button
          onClick={onAddToCart}
          className="flex-1 flex items-center gap-2"
        >
          <ShoppingCart className="w-4 h-4" />
          Add to Cart
        </Button>

        <Button className="flex-1 bg-orange-600 hover:bg-orange-700">
          Buy Now
        </Button>
      </div>

      {/* Hotline */}
      <p className="text-sm text-gray-700 flex-1 flex items-center gap-2">
        Gọi đặt mua{" "}
        <span className="font-bold text-red-600  ">1900 633 447</span> (8:00 -
        17:00)
      </p>

      {/* Chính sách */}
      <div className="grid grid-cols-2 gap-4 bg-gray-50 p-4 rounded-xl">
        <div className="flex items-center gap-2 text-sm">
          <Truck className="w-5 h-5 text-blue-600" /> Giao hàng toàn quốc
        </div>
        <div className="flex items-center gap-2 text-sm">
          <BadgeCheck className="w-5 h-5 text-green-600" /> Tích điểm tất cả sản
          phẩm
        </div>
        <div className="flex items-center gap-2 text-sm">
          <Gift className="w-5 h-5 text-pink-600" /> Nhận ưu đãi khi thanh toán
        </div>
        <div className="flex items-center gap-2 text-sm">
          <ShieldCheck className="w-5 h-5 text-gray-800" /> Cam kết chính hãng
        </div>
      </div>

      {/* Mô tả sản phẩm */}
      <div className="space-y-2">
        <h3 className="font-semibold text-lg">Mô tả sản phẩm</h3>
        <p
          className={`text-gray-700 leading-relaxed ${
            expandDesc ? "" : "line-clamp-3"
          }`}
        >
          {data.description}
        </p>
        <Button
          variant="outline"
          onClick={() => setExpandDesc(!expandDesc)}
          className="text-black hover:text-orange-600 text-sm"
        >
          {expandDesc ? "Thu gọn ▲" : "Xem thêm ▼"}
        </Button>
      </div>

      <div className="border rounded-xl p-4">
        {/* Chính sách giao hàng */}

        <div className="border rounded-xl p-4">
          <button
            onClick={() => setOpenShipping(!openShipping)}
            className="w-full flex justify-between items-center font-semibold text-left"
          >
            Chính sách giao hàng
            {openShipping ? <ChevronUp /> : <ChevronDown />}
          </button>

          {openShipping && (
            <div className="text-sm text-gray-700 mt-3 space-y-1">
              <p>Freeship với hóa đơn từ 500.000 VNĐ.</p>
              <p>Hóa đơn dưới 500.000 VNĐ, đồng giá ship 30K toàn quốc.</p>
            </div>
          )}
        </div>
        <div className="pt-4">
          {/* Chính sách đổi trả */}
          <div className="border rounded-xl p-4">
            <button
              onClick={() => setOpenReturn(!openReturn)}
              className="w-full flex justify-between items-center font-semibold text-left "
            >
              Chính sách trả hàng
              {openReturn ? <ChevronUp /> : <ChevronDown />}
            </button>
          </div>

          {openReturn && (
            <div className="text-sm text-gray-700 mt-3 space-y-1">
              <p>Hàng lỗi hỗ trợ đổi trả 1 đổi 1 trong vòng 7 ngày.</p>
              <p>
                Khách hàng được đổi size, đổi màu trong vòng 7 ngày kể từ ngày
                nhận hàng, điều kiện sản phẩm còn nguyên tem mác của công ty và
                chưa qua sử dụng, không bị dơ bẩn, hư hỏng.{" "}
              </p>
              <p>
                Đối với sản phẩm hàng xả, thanh lý trên 50% công ty không hỗ trợ
                đổi trả dưới mọi hình thức
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Info;
