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

      // Sử dụng API route proxy trong store thay vì gọi trực tiếp admin
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

      // Kiểm tra response format
      if (
        response.data &&
        Array.isArray(response.data) &&
        response.data.length > 0
      ) {
        const coupon = response.data[0];

        // Validate coupon data
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
        // Lưu coupon vào localStorage để truyền sang checkout
        localStorage.setItem("appliedCoupon", JSON.stringify(couponData));
        toast.success("Áp dụng mã giảm giá thành công!");
        setCouponCode("");
      } else if (
        response.data &&
        typeof response.data === "object" &&
        "success" in response.data &&
        response.data.success === false
      ) {
        // API trả về error message
        const message =
          ("message" in response.data &&
            typeof response.data.message === "string" &&
            response.data.message) ||
          "";
        // Kiểm tra nếu mã đã hết hạn
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
      // Xử lý lỗi chi tiết hơn
      if (error.response) {
        // Server trả về error response
        const status = error.response.status;
        const message =
          error.response.data?.message || error.response.data?.error || "";

        if (status === 404) {
          // 404 có thể là endpoint không tồn tại hoặc coupon không tìm thấy/hết hạn
          // Kiểm tra nếu message chứa "expired" hoặc "hết hạn" - đây là mã hết hạn, chỉ toast không log error
          const isExpired =
            message.toLowerCase().includes("expired") ||
            message.toLowerCase().includes("hết hạn") ||
            message.toLowerCase().includes("not found or expired");

          if (isExpired) {
            // Mã hết hạn - chỉ toast, không log error
            toast.error("Mã này đã hết hạn sử dụng");
          } else {
            // Lỗi thực sự (endpoint không tồn tại, server error) - log error
            if (process.env.NODE_ENV === "development") {
              console.error(
                "[COUPON_APPLY_ERROR] 404 - URL:",
                error.config?.url
              );
              console.error(
                "[COUPON_APPLY_ERROR] Response:",
                error.response.data
              );
              console.error(
                "[COUPON_APPLY_ERROR] Admin server should be running on port 3000"
              );
            }

            if (message) {
              toast.error(message);
            } else {
              toast.error(
                "Mã giảm giá không tồn tại. Vui lòng kiểm tra lại mã hoặc đảm bảo admin server đang chạy."
              );
            }
          }
        } else if (status === 400) {
          toast.error(message || "Mã giảm giá không hợp lệ");
        } else {
          // Lỗi server (500, etc.) - log error
          if (process.env.NODE_ENV === "development") {
            console.error(
              "[COUPON_APPLY_ERROR] Server error:",
              status,
              error.response.data
            );
          }
          toast.error(message || "Không thể áp dụng mã giảm giá");
        }
      } else if (error.request) {
        // Request được gửi nhưng không nhận được response - đây là lỗi network, log error
        if (process.env.NODE_ENV === "development") {
          console.error(
            "[COUPON_APPLY_ERROR] No response - URL:",
            error.config?.url
          );
          console.error(
            "[COUPON_APPLY_ERROR] Check if admin server is running on port 3000"
          );
        }
        toast.error(
          "Không thể kết nối đến server. Vui lòng đảm bảo admin server đang chạy."
        );
      } else {
        // Lỗi khác - log error
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
    // Xóa coupon khỏi localStorage
    localStorage.removeItem("appliedCoupon");
    toast.info("Đã xóa mã giảm giá");
  };

  const handleSelectCoupon = async (coupon: Coupon) => {
    // Validate coupon data before applying
    if (!coupon.code || !coupon.value || !coupon.type) {
      toast.error("Dữ liệu mã giảm giá không hợp lệ");
      return;
    }

    // Directly apply the selected coupon
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

  // Reset mã giảm giá và ghi chú khi giỏ hàng thay đổi (thêm/xóa sản phẩm)
  useEffect(() => {
    // Tạo một key duy nhất từ danh sách items để detect thay đổi
    const itemsKey = items
      .map((item) => item.cartItemId)
      .sort()
      .join(",");

    // Chỉ reset khi items thực sự thay đổi (không phải lần đầu mount)
    if (prevItemsRef.current && prevItemsRef.current !== itemsKey) {
      setAppliedCoupon(null);
      setCustomerNote("");
      setCouponCode("");
      // Xóa khỏi localStorage
      localStorage.removeItem("appliedCoupon");
      localStorage.removeItem("customerNote");
    }

    // Lưu key hiện tại
    prevItemsRef.current = itemsKey;
  }, [items]);

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
        <div className="flex items-center justify-between">
          <label className="text-xs font-light text-gray-700 uppercase tracking-wide">
            Mã giảm giá
          </label>
          {activeCoupons.length > 0 && !appliedCoupon && (
            <button
              onClick={() => setShowCouponList(!showCouponList)}
              className="text-xs text-gray-600 hover:text-black transition-colors flex items-center gap-1"
            >
              <Tag className="w-3 h-3" />
              {activeCoupons.length} mã khả dụng
              <ChevronDown
                className={cn(
                  "w-3 h-3 transition-transform",
                  showCouponList && "rotate-180"
                )}
              />
            </button>
          )}
        </div>

        {/* Available Coupons List */}
        <AnimatePresence>
          {showCouponList && activeCoupons.length > 0 && !appliedCoupon && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="overflow-hidden"
            >
              <div className="space-y-2 p-3 bg-gray-50 border border-gray-200 max-h-60 overflow-y-auto">
                {activeCoupons.map((coupon) => (
                  <button
                    key={coupon.id}
                    onClick={() => handleSelectCoupon(coupon)}
                    className="w-full text-left p-3 bg-white border border-gray-200 hover:border-black transition-all group"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <Tag className="w-3.5 h-3.5 text-black" />
                          <span className="text-sm font-medium text-black">
                            {coupon.code}
                          </span>
                        </div>
                        <p className="text-xs text-gray-500">
                          {coupon.expiresAt &&
                            `HSD: ${new Date(
                              coupon.expiresAt
                            ).toLocaleDateString("vi-VN")}`}
                        </p>
                      </div>
                      <div className="text-right shrink-0">
                        <span className="text-sm font-semibold text-green-600">
                          {coupon.type === "PERCENT"
                            ? `-${coupon.value}%`
                            : `-${coupon.value.toLocaleString("vi-VN")}₫`}
                        </span>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

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
          className="min-h-20 text-xs font-light rounded-none border-gray-300 resize-none"
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
