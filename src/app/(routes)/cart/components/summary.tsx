"use client";

import axios from "axios";
import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import Currency from "@/components/ui/currency";
import useCart from "@/hooks/use-cart";
import useAuth from "@/hooks/use-auth";
import { toast } from "sonner";
import { Loader2, Tag, X, ShoppingBag, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

const Summary = () => {
  const searchParams = useSearchParams();
  const items = useCart((state) => state.items);
  const removeAll = useCart((state) => state.removeAll);
  const { requireAuth } = useAuth();

  const [couponCode, setCouponCode] = useState("");
  const [appliedCoupon, setAppliedCoupon] = useState<{
    code: string;
    value: number;
    type: "PERCENT" | "FIXED";
  } | null>(null);
  const [couponLoading, setCouponLoading] = useState(false);
  const [shippingCost, setShippingCost] = useState(0);
  const [customerNote, setCustomerNote] = useState("");

  // Calculate subtotal
  const subtotal = items.reduce((total, item) => {
    return total + Number(item.price) * item.quantity;
  }, 0);

  // Calculate discount
  const discount = appliedCoupon
    ? appliedCoupon.type === "PERCENT"
      ? (subtotal * appliedCoupon.value) / 100
      : appliedCoupon.value
    : 0;

  // Calculate total
  const totalPrice = subtotal - discount + shippingCost;

  // Free shipping if subtotal >= 500000
  useEffect(() => {
    if (subtotal >= 500000) {
      setShippingCost(0);
    } else {
      setShippingCost(30000); // Default shipping cost
    }
  }, [subtotal]);

  useEffect(() => {
    if (searchParams.get("success")) {
      toast.success("Thanh toán thành công! Đơn hàng của bạn đang được xử lý.");
      removeAll();
      setAppliedCoupon(null);
    }

    if (searchParams.get("canceled")) {
      toast.error("Thanh toán thất bại hoặc đã bị hủy. Vui lòng thử lại.");
    }
  }, [searchParams, removeAll]);

  const handleApplyCoupon = async () => {
    if (!couponCode.trim()) {
      toast.error("Vui lòng nhập mã giảm giá");
      return;
    }

    setCouponLoading(true);
    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/api/coupons?code=${couponCode}`
      );

      if (response.data && response.data.length > 0) {
        const coupon = response.data[0];
        const couponData = {
          code: coupon.code,
          value: coupon.value,
          type: coupon.type,
        };
        setAppliedCoupon(couponData);
        // Lưu coupon vào localStorage để truyền sang checkout
        localStorage.setItem("appliedCoupon", JSON.stringify(couponData));
        toast.success("Áp dụng mã giảm giá thành công!");
        setCouponCode("");
      } else {
        toast.error("Mã giảm giá không hợp lệ hoặc đã hết hạn");
      }
    } catch (error) {
      toast.error("Không thể áp dụng mã giảm giá");
    } finally {
      setCouponLoading(false);
    }
  };

  const handleRemoveCoupon = () => {
    setAppliedCoupon(null);
    // Xóa coupon khỏi localStorage
    localStorage.removeItem("appliedCoupon");
    toast.info("Đã xóa mã giảm giá");
  };

  // Load coupon và customerNote từ localStorage khi component mount
  useEffect(() => {
    const savedCoupon = localStorage.getItem("appliedCoupon");
    if (savedCoupon) {
      try {
        const coupon = JSON.parse(savedCoupon);
        setAppliedCoupon(coupon);
      } catch (error) {
        localStorage.removeItem("appliedCoupon");
      }
    }

    const savedNote = localStorage.getItem("customerNote");
    if (savedNote) {
      setCustomerNote(savedNote);
    }
  }, []);

  const onCheckout = () => {
    // Yêu cầu đăng nhập trước khi thanh toán
    if (!requireAuth("thanh toán")) {
      return;
    }

    // Lưu customerNote vào localStorage để truyền sang checkout
    if (customerNote.trim()) {
      localStorage.setItem("customerNote", customerNote.trim());
    } else {
      localStorage.removeItem("customerNote");
    }

    // Redirect to checkout page
    window.location.href = "/checkout";
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white border border-gray-200 px-5 md:px-6 py-6 md:py-8 sticky top-4 shadow-sm"
    >
      <div className="flex items-center gap-2 mb-6">
        <ShoppingBag className="w-5 h-5 text-black" />
        <h2 className="text-sm font-light text-black uppercase tracking-wider">
          Tóm tắt đơn hàng
        </h2>
      </div>

      {/* Coupon Code */}
      <div className="mb-6 space-y-2">
        <label className="text-xs font-light text-gray-700 uppercase tracking-wide">
          Mã giảm giá
        </label>
        {appliedCoupon ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex items-center justify-between p-3 bg-gray-50 border border-gray-300"
          >
            <div className="flex items-center gap-2">
              <Tag className="w-4 h-4 text-black" />
              <span className="text-xs font-light text-black">
                {appliedCoupon.code} -{" "}
                {appliedCoupon.type === "PERCENT"
                  ? `${appliedCoupon.value}%`
                  : `${appliedCoupon.value.toLocaleString("vi-VN")} ₫`}
              </span>
            </div>
            <button
              onClick={handleRemoveCoupon}
              className="text-gray-400 hover:text-black transition-colors duration-200"
              aria-label="Xóa mã giảm giá"
            >
              <X className="w-4 h-4" />
            </button>
          </motion.div>
        ) : (
          <div className="flex gap-2">
            <Input
              type="text"
              placeholder="Nhập mã giảm giá"
              value={couponCode}
              onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
              className="flex-1 rounded-none border-gray-300 text-xs font-light"
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  handleApplyCoupon();
                }
              }}
            />
            <Button
              onClick={handleApplyCoupon}
              disabled={couponLoading || !couponCode.trim()}
              size="sm"
              variant="outline"
              className="rounded-none text-xs font-light uppercase tracking-wider border-gray-300 hover:border-black transition-colors duration-200"
            >
              {couponLoading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                "Áp dụng"
              )}
            </Button>
          </div>
        )}
      </div>

      {/* Customer Note */}
      <div className="mb-6 space-y-2">
        <label className="text-xs font-light text-gray-700 uppercase tracking-wide">
          Ghi chú đơn hàng (tùy chọn)
        </label>
        <Textarea
          placeholder="Nhập ghi chú cho đơn hàng của bạn..."
          value={customerNote}
          onChange={(e) => setCustomerNote(e.target.value)}
          className="min-h-[80px] text-xs font-light rounded-none border-gray-300 resize-none"
          maxLength={500}
        />
        <p className="text-xs text-gray-500 font-light">
          {customerNote.length}/500 ký tự
        </p>
      </div>

      {/* Order Summary */}
      <div className="space-y-3 mb-6">
        <div className="flex items-center justify-between text-xs font-light">
          <span className="text-gray-600 uppercase tracking-wide">
            Tạm tính
          </span>
          <Currency value={subtotal} />
        </div>

        {discount > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex items-center justify-between text-xs font-light text-green-600"
          >
            <span className="uppercase tracking-wide">Giảm giá</span>
            <span>
              -<Currency value={discount} />
            </span>
          </motion.div>
        )}

        <div className="flex items-center justify-between text-xs font-light">
          <span className="text-gray-600 uppercase tracking-wide">
            Phí vận chuyển
          </span>
          <span>
            {shippingCost === 0 ? (
              <span className="text-green-600 font-medium">Miễn phí</span>
            ) : (
              <Currency value={shippingCost} />
            )}
          </span>
        </div>

        {subtotal < 500000 && (
          <p className="text-xs font-light text-gray-500 pt-2 border-t border-gray-100">
            Thêm <Currency value={500000 - subtotal} /> để được miễn phí vận
            chuyển
          </p>
        )}

        <div className="flex items-center justify-between border-t border-gray-300 pt-4 mt-4">
          <div className="text-base font-medium text-black uppercase tracking-wider">
            Tổng tiền
          </div>
          <div className="text-xl font-medium text-black">
            <Currency value={totalPrice} />
          </div>
        </div>
      </div>

      <Button
        disabled={items.length === 0}
        onClick={onCheckout}
        className={cn(
          "w-full rounded-none py-3.5 text-sm font-light uppercase tracking-wider transition-colors duration-200",
          items.length === 0
            ? "bg-gray-200 text-gray-400 cursor-not-allowed"
            : "bg-black text-white hover:bg-gray-800"
        )}
      >
        <span className="flex items-center justify-center gap-2">
          Thanh toán
          <ArrowRight className="w-4 h-4" />
        </span>
      </Button>
    </motion.div>
  );
};

export default Summary;
