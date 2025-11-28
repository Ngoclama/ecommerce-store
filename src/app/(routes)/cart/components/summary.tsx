"use client";

import axios from "axios";
import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Currency from "@/components/ui/currency";
import useCart from "@/hooks/use-cart";
import useAuth from "@/hooks/use-auth";
import { toast } from "sonner";
import { Loader2, Tag, X } from "lucide-react";
import { cn } from "@/lib/utils";

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
      // You may need to create an API endpoint to validate coupons
      // For now, this is a placeholder
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/api/coupons?code=${couponCode}`
      );

      if (response.data && response.data.length > 0) {
        const coupon = response.data[0];
        setAppliedCoupon({
          code: coupon.code,
          value: coupon.value,
          type: coupon.type,
        });
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
    toast.info("Đã xóa mã giảm giá");
  };

  const onCheckout = () => {
    // Yêu cầu đăng nhập trước khi thanh toán
    if (!requireAuth("thanh toán")) {
      return;
    }

    // Redirect to checkout page
    window.location.href = "/checkout";
  };

  return (
    <div className="bg-white border border-gray-300 px-6 py-8 sticky top-4">
      <h2 className="text-sm font-light text-black mb-6 uppercase tracking-wider">
        Order summary
      </h2>

      {/* Coupon Code - Aigle Style */}
      <div className="mb-6 space-y-2">
        <label className="text-xs font-light text-gray-700 uppercase tracking-wider">
          Coupon code
        </label>
        {appliedCoupon ? (
          <div className="flex items-center justify-between p-3 bg-gray-50 border border-gray-300">
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
              className="text-black hover:text-gray-600"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        ) : (
          <div className="flex gap-2">
            <Input
              type="text"
              placeholder="Enter coupon code"
              value={couponCode}
              onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
              className="flex-1 rounded-none border-gray-300 text-xs font-light"
            />
            <Button
              onClick={handleApplyCoupon}
              disabled={couponLoading || !couponCode.trim()}
              size="sm"
              variant="outline"
              className="rounded-none text-xs font-light uppercase tracking-wider"
            >
              {couponLoading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                "Apply"
              )}
            </Button>
          </div>
        )}
      </div>

      {/* Order Summary - Aigle Style */}
      <div className="space-y-4">
        <div className="flex items-center justify-between text-xs font-light">
          <span className="text-gray-600">Subtotal</span>
          <Currency value={subtotal} />
        </div>

        {discount > 0 && (
          <div className="flex items-center justify-between text-xs font-light text-black">
            <span>Discount</span>
            <span>
              -<Currency value={discount} />
            </span>
          </div>
        )}

        <div className="flex items-center justify-between text-xs font-light">
          <span className="text-gray-600">Shipping</span>
          <span>
            {shippingCost === 0 ? (
              <span className="text-black">Free</span>
            ) : (
              <Currency value={shippingCost} />
            )}
          </span>
        </div>

        {subtotal < 500000 && (
          <p className="text-xs font-light text-gray-500">
            Add <Currency value={500000 - subtotal} /> more for free shipping
          </p>
        )}

        <div className="flex items-center justify-between border-t border-gray-300 pt-4">
          <div className="text-base font-light text-black uppercase tracking-wider">
            Total
          </div>
          <div className="text-lg font-light text-black">
            <Currency value={totalPrice} />
          </div>
        </div>
      </div>

      <Button
        disabled={items.length === 0}
        onClick={onCheckout}
        variant="outline"
        className="w-full mt-6 rounded-none py-3 text-xs font-light uppercase tracking-wider border-black hover:bg-black hover:text-white"
      >
        Checkout
      </Button>
    </div>
  );
};

export default Summary;
