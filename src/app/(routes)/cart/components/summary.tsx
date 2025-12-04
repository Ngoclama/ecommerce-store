"use client";

import axios from "axios";
import { useEffect, useState, useRef } from "react";
import { useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import Currency from "@/components/ui/currency";
import useCart from "@/hooks/use-cart";
import useAuth from "@/hooks/use-auth";
import { toast } from "sonner";
import {
  Loader2,
  Tag,
  X,
  ShoppingBag,
  ArrowRight,
  ChevronDown,
  Sparkles,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import { Coupon } from "@/types";

interface SummaryProps {
  coupons?: Coupon[];
}

const Summary = ({ coupons = [] }: SummaryProps) => {
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
  const [showCouponList, setShowCouponList] = useState(false);
  const prevItemsRef = useRef<string>("");

  // Filter active and valid coupons
  const activeCoupons = (coupons || []).filter((coupon) => {
    try {
      const now = new Date();
      const expiryDate = coupon.expiresAt ? new Date(coupon.expiresAt) : null;
      const isExpired = expiryDate && expiryDate < now;
      return !isExpired;
    } catch (error) {
      console.error("Error filtering coupon:", error, coupon);
      return false;
    }
  });

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
      const apiUrl = process.env.NEXT_PUBLIC_API_URL;
      if (!apiUrl) {
        toast.error("Cấu hình API không hợp lệ");
        setCouponLoading(false);
        return;
      }

      const url = `/api/coupons?code=${encodeURIComponent(
        couponCode.trim().toUpperCase()
      )}`;

      if (process.env.NODE_ENV === "development") {
        console.log("[COUPON_APPLY] Requesting URL:", url);
      }

      const response = await axios.get(url, {
        timeout: 10000,
      });

      if (process.env.NODE_ENV === "development") {
        console.log("[COUPON_APPLY] Response:", response.data);
      }

      if (
        response.data &&
        Array.isArray(response.data) &&
        response.data.length > 0
      ) {
        const coupon = response.data[0];

        if (!coupon.code || !coupon.value || !coupon.type) {
          toast.error("Dữ liệu mã giảm giá không hợp lệ");
          setCouponLoading(false);
          return;
        }

        const couponData = {
          code: coupon.code,
          value: coupon.value,
          type: coupon.type,
        };
        setAppliedCoupon(couponData);
        localStorage.setItem("appliedCoupon", JSON.stringify(couponData));
        toast.success("Áp dụng mã giảm giá thành công!");
        setCouponCode("");
      } else if (
        response.data &&
        typeof response.data === "object" &&
        "success" in response.data &&
        response.data.success === false
      ) {
        const message =
          ("message" in response.data &&
            typeof response.data.message === "string" &&
            response.data.message) ||
          "";
        if (
          message.toLowerCase().includes("expired") ||
          message.toLowerCase().includes("hết hạn")
        ) {
          toast.error("Mã này đã hết hạn sử dụng");
        } else {
          toast.error(message || "Mã giảm giá không hợp lệ hoặc đã hết hạn");
        }
      } else {
        toast.error("Mã giảm giá không hợp lệ hoặc đã hết hạn");
      }
    } catch (error: any) {
      if (error.response) {
        const status = error.response.status;
        const message =
          error.response.data?.message || error.response.data?.error || "";

        if (status === 404) {
          const isExpired =
            message.toLowerCase().includes("expired") ||
            message.toLowerCase().includes("hết hạn") ||
            message.toLowerCase().includes("not found or expired");

          if (isExpired) {
            toast.error("Mã này đã hết hạn sử dụng");
          } else {
            if (process.env.NODE_ENV === "development") {
              console.error("[COUPON_APPLY_ERROR] 404 - URL:", error.config?.url);
              console.error("[COUPON_APPLY_ERROR] Response:", error.response.data);
            }
            toast.error(
              message ||
                "Mã giảm giá không tồn tại. Vui lòng kiểm tra lại mã hoặc đảm bảo admin server đang chạy."
            );
          }
        } else if (status === 400) {
          toast.error(message || "Mã giảm giá không hợp lệ");
        } else {
          if (process.env.NODE_ENV === "development") {
            console.error("[COUPON_APPLY_ERROR] Server error:", status, error.response.data);
          }
          toast.error(message || "Không thể áp dụng mã giảm giá");
        }
      } else if (error.request) {
        if (process.env.NODE_ENV === "development") {
          console.error("[COUPON_APPLY_ERROR] No response - URL:", error.config?.url);
        }
        toast.error("Không thể kết nối đến server. Vui lòng đảm bảo admin server đang chạy.");
      } else {
        if (process.env.NODE_ENV === "development") {
          console.error("[COUPON_APPLY_ERROR]", error);
        }
        toast.error("Không thể áp dụng mã giảm giá. Vui lòng thử lại.");
      }
    } finally {
      setCouponLoading(false);
    }
  };

  const handleRemoveCoupon = () => {
    setAppliedCoupon(null);
    setCouponCode("");
    localStorage.removeItem("appliedCoupon");
    toast.info("Đã xóa mã giảm giá");
  };

  const handleSelectCoupon = async (coupon: Coupon) => {
    if (!coupon.code || !coupon.value || !coupon.type) {
      toast.error("Dữ liệu mã giảm giá không hợp lệ");
      return;
    }

    const couponData = {
      code: coupon.code,
      value: coupon.value,
      type: coupon.type,
    };

    setAppliedCoupon(couponData);
    localStorage.setItem("appliedCoupon", JSON.stringify(couponData));
    setCouponCode("");
    setShowCouponList(false);
    toast.success("Áp dụng mã giảm giá thành công!");
  };

  // Reset mã giảm giá và ghi chú khi giỏ hàng thay đổi
  useEffect(() => {
    const itemsKey = items
      .map((item) => item.cartItemId)
      .sort()
      .join(",");

    if (prevItemsRef.current && prevItemsRef.current !== itemsKey) {
      setAppliedCoupon(null);
      setCustomerNote("");
      setCouponCode("");
      localStorage.removeItem("appliedCoupon");
      localStorage.removeItem("customerNote");
    }

    prevItemsRef.current = itemsKey;
  }, [items]);

  const onCheckout = () => {
    if (!requireAuth("thanh toán")) {
      return;
    }

    if (customerNote.trim()) {
      localStorage.setItem("customerNote", customerNote.trim());
    } else {
      localStorage.removeItem("customerNote");
    }

    window.location.href = "/checkout";
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white dark:bg-gray-900 border-2 border-neutral-200 dark:border-neutral-800 rounded-sm px-6 md:px-8 py-8 md:py-10 sticky top-4 shadow-xl"
    >
      {/* Header - Luxury Style */}
      <div className="flex items-center gap-3 mb-8 pb-6 border-b-2 border-neutral-200 dark:border-neutral-800">
        <motion.div
          whileHover={{ rotate: 5 }}
          className="p-2 rounded-sm bg-gradient-to-br from-neutral-900 to-neutral-800 dark:from-neutral-100 dark:to-neutral-200 border-2 border-neutral-900 dark:border-neutral-100"
        >
          <ShoppingBag className="w-5 h-5 text-white dark:text-neutral-900" />
        </motion.div>
        <h2 className="text-sm font-light text-neutral-900 dark:text-neutral-100 uppercase tracking-[0.15em]">
          Tóm tắt đơn hàng
        </h2>
      </div>

      {/* Coupon Code - Luxury Style */}
      <div className="mb-6 space-y-3">
        <div className="flex items-center justify-between">
          <label className="text-xs font-light text-neutral-700 dark:text-neutral-300 uppercase tracking-[0.15em]">
            Mã giảm giá
          </label>
          {activeCoupons.length > 0 && !appliedCoupon && (
            <motion.button
              onClick={() => setShowCouponList(!showCouponList)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="text-xs text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-100 transition-colors flex items-center gap-1.5"
            >
              <Tag className="w-3.5 h-3.5" />
              {activeCoupons.length} mã khả dụng
              <ChevronDown
                className={cn(
                  "w-3.5 h-3.5 transition-transform duration-300",
                  showCouponList && "rotate-180"
                )}
              />
            </motion.button>
          )}
        </div>

        {/* Available Coupons List - Luxury Style */}
        <AnimatePresence>
          {showCouponList && activeCoupons.length > 0 && !appliedCoupon && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
              className="overflow-hidden"
            >
              <div className="space-y-2 p-4 bg-neutral-50 dark:bg-neutral-900/50 border-2 border-neutral-200 dark:border-neutral-800 rounded-sm max-h-60 overflow-y-auto">
                {activeCoupons.map((coupon, index) => (
                  <motion.button
                    key={coupon.id}
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    onClick={() => handleSelectCoupon(coupon)}
                    whileHover={{ scale: 1.02, y: -2 }}
                    className="w-full text-left p-4 bg-white dark:bg-gray-900 border-2 border-neutral-200 dark:border-neutral-800 hover:border-neutral-900 dark:hover:border-neutral-100 rounded-sm transition-all duration-300 group"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <Tag className="w-4 h-4 text-neutral-900 dark:text-neutral-100" />
                          <span className="text-sm font-light text-neutral-900 dark:text-neutral-100 uppercase tracking-wide">
                            {coupon.code}
                          </span>
                        </div>
                        {coupon.expiresAt && (
                          <p className="text-xs text-neutral-500 dark:text-neutral-400 font-light">
                            HSD: {new Date(coupon.expiresAt).toLocaleDateString("vi-VN")}
                          </p>
                        )}
                      </div>
                      <div className="text-right shrink-0">
                        <span className="text-sm font-light text-green-600 dark:text-green-400">
                          {coupon.type === "PERCENT"
                            ? `-${coupon.value}%`
                            : `-${coupon.value.toLocaleString("vi-VN")}₫`}
                        </span>
                      </div>
                    </div>
                  </motion.button>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {appliedCoupon ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex items-center justify-between p-4 bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-950/20 dark:to-emerald-950/20 border-2 border-green-200 dark:border-green-800 rounded-sm"
          >
            <div className="flex items-center gap-2">
              <Tag className="w-4 h-4 text-green-600 dark:text-green-400" />
              <span className="text-xs font-light text-neutral-900 dark:text-neutral-100 uppercase tracking-wide">
                {appliedCoupon.code} -{" "}
                {appliedCoupon.type === "PERCENT"
                  ? `${appliedCoupon.value}%`
                  : `${appliedCoupon.value.toLocaleString("vi-VN")} ₫`}
              </span>
            </div>
            <motion.button
              onClick={handleRemoveCoupon}
              whileHover={{ scale: 1.1, rotate: 90 }}
              whileTap={{ scale: 0.9 }}
              className="text-neutral-400 dark:text-neutral-600 hover:text-red-500 dark:hover:text-red-400 transition-colors duration-300"
              aria-label="Xóa mã giảm giá"
            >
              <X className="w-4 h-4" />
            </motion.button>
          </motion.div>
        ) : (
          <div className="flex gap-2">
            <Input
              type="text"
              placeholder="Nhập mã giảm giá"
              value={couponCode}
              onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
              className="flex-1 rounded-sm border-2 border-neutral-200 dark:border-neutral-800 focus:border-neutral-900 dark:focus:border-neutral-100 text-xs font-light bg-white dark:bg-gray-900"
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
              className="rounded-sm text-xs font-light uppercase tracking-[0.15em] border-2 border-neutral-200 dark:border-neutral-800 hover:border-neutral-900 dark:hover:border-neutral-100 transition-all duration-300"
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

      {/* Customer Note - Luxury Style */}
      <div className="mb-6 space-y-2">
        <label className="text-xs font-light text-neutral-700 dark:text-neutral-300 uppercase tracking-[0.15em]">
          Ghi chú đơn hàng (tùy chọn)
        </label>
        <Textarea
          placeholder="Nhập ghi chú cho đơn hàng của bạn..."
          value={customerNote}
          onChange={(e) => setCustomerNote(e.target.value)}
          className="min-h-24 text-xs font-light rounded-sm border-2 border-neutral-200 dark:border-neutral-800 focus:border-neutral-900 dark:focus:border-neutral-100 resize-none bg-white dark:bg-gray-900"
          maxLength={500}
        />
        <p className="text-xs text-neutral-500 dark:text-neutral-400 font-light">
          {customerNote.length}/500 ký tự
        </p>
      </div>

      {/* Order Summary - Luxury Style */}
      <div className="space-y-4 mb-8 pb-6 border-b-2 border-neutral-200 dark:border-neutral-800">
        <div className="flex items-center justify-between text-xs font-light">
          <span className="text-neutral-600 dark:text-neutral-400 uppercase tracking-[0.15em]">
            Tạm tính
          </span>
          <Currency value={subtotal} />
        </div>

        {discount > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex items-center justify-between text-xs font-light text-green-600 dark:text-green-400"
          >
            <span className="uppercase tracking-[0.15em]">Giảm giá</span>
            <span>
              -<Currency value={discount} />
            </span>
          </motion.div>
        )}

        <div className="flex items-center justify-between text-xs font-light">
          <span className="text-neutral-600 dark:text-neutral-400 uppercase tracking-[0.15em]">
            Phí vận chuyển
          </span>
          <span>
            {shippingCost === 0 ? (
              <span className="text-green-600 dark:text-green-400 font-light">Miễn phí</span>
            ) : (
              <Currency value={shippingCost} />
            )}
          </span>
        </div>

        {subtotal < 500000 && (
          <p className="text-xs font-light text-neutral-500 dark:text-neutral-400 pt-2 border-t border-neutral-200 dark:border-neutral-800">
            Thêm <Currency value={500000 - subtotal} /> để được miễn phí vận chuyển
          </p>
        )}

        <div className="flex items-center justify-between pt-4 mt-4 border-t-2 border-neutral-900 dark:border-neutral-100">
          <div className="text-lg font-light text-neutral-900 dark:text-neutral-100 uppercase tracking-[0.15em]">
            Tổng tiền
          </div>
          <div className="text-2xl font-light text-neutral-900 dark:text-neutral-100">
            <Currency value={totalPrice} />
          </div>
        </div>
      </div>

      {/* Checkout Button - Luxury Style */}
      <Button
        disabled={items.length === 0}
        onClick={onCheckout}
        className={cn(
          "w-full rounded-sm py-4 text-sm font-light uppercase tracking-[0.15em] transition-all duration-300 flex items-center justify-center gap-2",
          items.length === 0
            ? "bg-neutral-200 dark:bg-neutral-800 text-neutral-400 dark:text-neutral-600 cursor-not-allowed border-2 border-neutral-200 dark:border-neutral-800"
            : "bg-gradient-to-r from-neutral-900 to-neutral-800 dark:from-neutral-100 dark:to-neutral-200 text-white dark:text-neutral-900 hover:from-neutral-800 hover:to-neutral-700 dark:hover:from-neutral-200 dark:hover:to-neutral-300 border-2 border-neutral-900 dark:border-neutral-100 hover:scale-105 hover:shadow-xl"
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
