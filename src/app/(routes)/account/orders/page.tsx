"use client";

import Container from "@/components/ui/container";
import { Package, Search, Filter } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useEffect, useRef } from "react";
import { useSearchParams } from "next/navigation";
import { toast } from "sonner";
import useCart from "@/hooks/use-cart";

export default function OrdersPage() {
  const searchParams = useSearchParams();
  const cart = useCart();
  const hasProcessedPayment = useRef(false);

  // Handle payment success callback from Stripe
  useEffect(() => {
    if (hasProcessedPayment.current) {
      return;
    }

    const paymentStatus = searchParams?.get("payment");

    if (paymentStatus === "success") {
      hasProcessedPayment.current = true;

      // Clear cart after successful payment
      cart.removeAll();

      // Clear saved data
      localStorage.removeItem("appliedCoupon");
      localStorage.removeItem("customerNote");

      toast.success("Thanh toán thành công! Đơn hàng của bạn đang được xử lý.");
    }
  }, [searchParams, cart]);

  // Mock data - sẽ thay bằng API call
  const orders = [];

  return (
    <div className="bg-white min-h-screen py-12">
      <Container>
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-12">
            <h1 className="text-4xl font-light text-black mb-2 uppercase tracking-wider">
              Đơn hàng của tôi
            </h1>
            <p className="text-gray-600 font-light">
              Xem và theo dõi đơn hàng của bạn
            </p>
          </div>

          {/* Search and Filter */}
          <div className="bg-white rounded-none p-4 mb-6 flex gap-4 border border-gray-300">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <Input
                placeholder="Tìm kiếm đơn hàng..."
                className="pl-10 rounded-none border-gray-300 focus:border-black"
              />
            </div>
            <Button variant="outline" className="gap-2 rounded-none">
              <Filter className="w-4 h-4" />
              Lọc
            </Button>
          </div>

          {/* Orders List */}
          {orders.length === 0 ? (
            <div className="bg-white rounded-none p-12 text-center border border-gray-300">
              <Package className="w-20 h-20 text-gray-300 mx-auto mb-4" />
              <h3 className="text-xl font-light text-black mb-2 uppercase tracking-wide">
                Chưa có đơn hàng
              </h3>
              <p className="text-gray-600 mb-6 font-light">
                Bạn chưa có đơn hàng nào. Hãy bắt đầu mua sắm ngay!
              </p>
              <Button asChild variant="default" className="rounded-none">
                <a href="/">Mua sắm ngay</a>
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              {/* Order items will be rendered here */}
            </div>
          )}
        </div>
      </Container>
    </div>
  );
}
