"use client";

import Container from "@/components/ui/container";
import { Package, Search, Filter, CheckCircle2, ArrowRight, ShoppingBag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useEffect, useRef, useState } from "react";
import { useSearchParams } from "next/navigation";
import { toast } from "sonner";
import useCart from "@/hooks/use-cart";
import { motion, useInView } from "framer-motion";
import { cn } from "@/lib/utils";

export default function OrdersPage() {
  const searchParams = useSearchParams();
  const cart = useCart();
  const hasProcessedPayment = useRef(false);
  const [searchQuery, setSearchQuery] = useState("");
  const headerRef = useRef(null);
  const isHeaderInView = useInView(headerRef, { once: true, amount: 0.3 });

  // Handle payment success callback from Stripe, VNPay, MoMo
  useEffect(() => {
    if (hasProcessedPayment.current) {
      return;
    }

    const paymentStatus = searchParams?.get("payment");
    const paymentMethod = searchParams?.get("method");

    if (paymentStatus === "success") {
      hasProcessedPayment.current = true;

      // Clear cart after successful payment
      cart.removeAll();

      // Clear saved data
      localStorage.removeItem("appliedCoupon");
      localStorage.removeItem("customerNote");

      // Show success message based on payment method
      if (paymentMethod === "vnpay") {
        toast.success("Thanh toán VNPay thành công! Đơn hàng của bạn đang được xử lý.", {
          duration: 5000,
        });
      } else if (paymentMethod === "momo") {
        toast.success("Thanh toán MoMo thành công! Đơn hàng của bạn đang được xử lý.", {
          duration: 5000,
        });
      } else {
        toast.success("Thanh toán thành công! Đơn hàng của bạn đang được xử lý.", {
          duration: 5000,
        });
      }
    }
  }, [searchParams, cart]);

  // Mock data - sẽ thay bằng API call
  const orders: any[] = [];

  return (
    <div className="bg-gradient-to-br from-neutral-50 via-white to-neutral-50 dark:from-neutral-950 dark:via-gray-900 dark:to-neutral-950 min-h-screen py-12 md:py-16 lg:py-20">
      <Container>
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Luxury Header */}
          <motion.div
            ref={headerRef}
            initial={{ opacity: 0, y: 30 }}
            animate={isHeaderInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
            transition={{ duration: 0.8 }}
            className="mb-12 md:mb-16"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={isHeaderInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.8 }}
              transition={{ duration: 0.6, delay: 0.2, type: "spring" }}
              className="inline-flex items-center gap-3 px-5 py-3 bg-gradient-to-br from-neutral-900 to-neutral-800 dark:from-neutral-100 dark:to-neutral-200 border-2 border-neutral-900 dark:border-neutral-100 rounded-sm mb-6"
            >
              <motion.div
                animate={{ rotate: [0, 10, -10, 0] }}
                transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
              >
                <Package className="w-5 h-5 text-white dark:text-neutral-900" />
              </motion.div>
              <span className="text-xs font-light text-white dark:text-neutral-900 uppercase tracking-[0.2em]">
                Đơn hàng
              </span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={isHeaderInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="text-4xl md:text-5xl lg:text-6xl font-light text-neutral-900 dark:text-neutral-100 leading-[1.1] tracking-tight uppercase mb-6"
            >
              Đơn hàng của tôi
            </motion.h1>

            <motion.div
              initial={{ opacity: 0, width: 0 }}
              animate={isHeaderInView ? { opacity: 1, width: "100%" } : { opacity: 0, width: 0 }}
              transition={{ duration: 1, delay: 0.4 }}
              className="h-px bg-gradient-to-r from-neutral-900 via-neutral-400 to-transparent dark:from-neutral-100 dark:via-neutral-600 mb-4"
            />

            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={isHeaderInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 10 }}
              transition={{ duration: 0.8, delay: 0.5 }}
              className="text-sm md:text-base text-neutral-600 dark:text-neutral-400 font-light"
            >
              Xem và theo dõi đơn hàng của bạn
            </motion.p>
          </motion.div>

          {/* Search and Filter - Luxury Style */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="bg-white dark:bg-gray-900 rounded-sm p-4 md:p-6 mb-6 md:mb-8 flex flex-col sm:flex-row gap-4 border-2 border-neutral-200 dark:border-neutral-800 shadow-lg"
          >
            <div className="flex-1 relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-400 dark:text-neutral-600" />
              <Input
                placeholder="Tìm kiếm đơn hàng..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-12 rounded-sm border-2 border-neutral-200 dark:border-neutral-800 focus:border-neutral-900 dark:focus:border-neutral-100 h-12 font-light bg-white dark:bg-gray-900 transition-all duration-300"
              />
            </div>
            <motion.div
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Button
                variant="outline"
                className="gap-2 rounded-sm border-2 border-neutral-200 dark:border-neutral-800 hover:border-neutral-900 dark:hover:border-neutral-100 h-12 px-6 font-light uppercase tracking-[0.15em] transition-all duration-300"
              >
                <Filter className="w-4 h-4" />
                Lọc
              </Button>
            </motion.div>
          </motion.div>

          {/* Orders List */}
          {orders.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.7 }}
              className="bg-white dark:bg-gray-900 rounded-sm p-12 md:p-16 lg:p-20 text-center border-2 border-neutral-200 dark:border-neutral-800 shadow-xl"
            >
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.6, delay: 0.8, type: "spring" }}
                className="inline-flex items-center justify-center w-24 h-24 md:w-28 md:h-28 rounded-sm bg-gradient-to-br from-neutral-900 to-neutral-800 dark:from-neutral-100 dark:to-neutral-200 border-2 border-neutral-900 dark:border-neutral-100 mb-8"
              >
                <motion.div
                  animate={{ rotate: [0, 10, -10, 0] }}
                  transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                >
                  <Package className="w-12 h-12 md:w-14 md:h-14 text-white dark:text-neutral-900" />
                </motion.div>
              </motion.div>

              <motion.h3
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.9 }}
                className="text-2xl md:text-3xl font-light text-neutral-900 dark:text-neutral-100 mb-4 uppercase tracking-tight"
              >
                Chưa có đơn hàng
              </motion.h3>

              <motion.div
                initial={{ opacity: 0, width: 0 }}
                animate={{ opacity: 1, width: "100%" }}
                transition={{ duration: 1, delay: 1 }}
                className="h-px bg-gradient-to-r from-transparent via-neutral-900 to-transparent dark:from-transparent dark:via-neutral-100 dark:to-transparent max-w-md mx-auto mb-6"
              />

              <motion.p
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 1.1 }}
                className="text-sm md:text-base text-neutral-600 dark:text-neutral-400 font-light mb-8 max-w-md mx-auto"
              >
                Bạn chưa có đơn hàng nào. Hãy bắt đầu mua sắm ngay!
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 1.2 }}
              >
                <Button
                  asChild
                  className="inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-neutral-900 to-neutral-800 dark:from-neutral-100 dark:to-neutral-200 text-white dark:text-neutral-900 hover:from-neutral-800 hover:to-neutral-700 dark:hover:from-neutral-200 dark:hover:to-neutral-300 border-2 border-neutral-900 dark:border-neutral-100 rounded-sm text-sm font-light uppercase tracking-[0.15em] transition-all duration-300 hover:scale-105 hover:shadow-xl"
                >
                  <a href="/">
                    <ShoppingBag className="w-4 h-4" />
                    Mua sắm ngay
                    <ArrowRight className="w-4 h-4" />
                  </a>
                </Button>
              </motion.div>
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.7 }}
              className="space-y-4 md:space-y-6"
            >
              {/* Order items will be rendered here */}
              {orders.map((order, index) => (
                <motion.div
                  key={order.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.8 + index * 0.1 }}
                  className="bg-white dark:bg-gray-900 rounded-sm p-6 md:p-8 border-2 border-neutral-200 dark:border-neutral-800 shadow-lg hover:shadow-xl transition-all duration-300"
                >
                  {/* Order content will be here */}
                </motion.div>
              ))}
            </motion.div>
          )}
        </div>
      </Container>
    </div>
  );
}
