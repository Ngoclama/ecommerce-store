"use client";

import { useEffect, useRef } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Container from "@/components/ui/container";
import { Button } from "@/components/ui/button";
import {
  XCircle,
  ArrowLeft,
  ShoppingBag,
  RefreshCw,
} from "lucide-react";
import { motion } from "framer-motion";
import Link from "next/link";
import useCart from "@/hooks/use-cart";
import { toast } from "sonner";

export default function PaymentFailurePage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const cart = useCart();
  const hasProcessed = useRef(false);

  const orderId = searchParams?.get("orderId") || null;
  const paymentMethod = searchParams?.get("method") || "unknown";
  const reason = searchParams?.get("reason") || "cancelled";

  // Handle payment failure
  useEffect(() => {
    if (hasProcessed.current) return;

    hasProcessed.current = true;

    // Delete order if payment was cancelled
    if (orderId) {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL;
      if (apiUrl) {
        fetch(`${apiUrl.replace(/\/$/, "")}/api/orders/${orderId}/cancel-payment`, {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
        })
          .then((res) => res.json())
          .then((data) => {
            if (data.deleted) {
              console.log("[PAYMENT_FAILURE] Order deleted:", orderId);
            }
          })
          .catch((error) => {
            console.error("[PAYMENT_FAILURE] Error deleting order:", error);
          });
      }
    }

    // Show error toast
    const methodNames: Record<string, string> = {
      vnpay: "VNPay",
      momo: "MoMo",
      stripe: "Stripe",
    };

    const methodName = methodNames[paymentMethod] || "thanh toán";
    const reasonText =
      reason === "cancelled"
        ? "đã bị hủy"
        : reason === "failed"
        ? "thất bại"
        : "đã bị hủy";

    toast.error(`Thanh toán ${methodName} ${reasonText}. Đơn hàng đã được hủy.`, {
      duration: 5000,
    });
  }, [orderId, paymentMethod, reason]);

  return (
    <div className="bg-gradient-to-br from-neutral-50 via-white to-neutral-50 dark:from-neutral-950 dark:via-gray-900 dark:to-neutral-950 min-h-screen py-12 md:py-16 lg:py-20">
      <Container>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Failure Icon */}
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.6, type: "spring", delay: 0.2 }}
            className="flex justify-center mb-8"
          >
            <div className="relative">
              <motion.div
                animate={{
                  scale: [1, 1.1, 1],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
                className="w-32 h-32 md:w-40 md:h-40 rounded-full bg-gradient-to-br from-red-400 via-red-500 to-red-600 dark:from-red-500 dark:via-red-600 dark:to-red-700 border-4 border-white dark:border-neutral-900 shadow-2xl flex items-center justify-center"
              >
                <XCircle className="w-16 h-16 md:w-20 md:h-20 text-white" />
              </motion.div>
              <motion.div
                animate={{
                  scale: [1, 1.2, 1],
                  opacity: [0.5, 0, 0.5],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
                className="absolute inset-0 rounded-full bg-gradient-to-br from-red-400 to-red-600 blur-2xl"
              />
            </div>
          </motion.div>

          {/* Error Message */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="text-center mb-12"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.5, type: "spring" }}
              className="inline-flex items-center gap-3 px-6 py-3 bg-gradient-to-br from-red-900 to-red-800 dark:from-red-100 dark:to-red-200 border-2 border-red-900 dark:border-red-100 rounded-sm mb-6"
            >
              <span className="text-xs font-light text-white dark:text-red-900 uppercase tracking-[0.2em]">
                Thanh toán thất bại
              </span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
              className="text-4xl md:text-5xl lg:text-6xl font-light text-neutral-900 dark:text-neutral-100 leading-[1.1] tracking-tight uppercase mb-6"
            >
              Thanh toán không thành công
            </motion.h1>

            <motion.div
              initial={{ opacity: 0, width: 0 }}
              animate={{ opacity: 1, width: "100%" }}
              transition={{ duration: 1, delay: 0.7 }}
              className="h-px bg-gradient-to-r from-transparent via-neutral-900 to-transparent dark:from-transparent dark:via-neutral-100 dark:to-transparent max-w-2xl mx-auto mb-6"
            />

            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.8 }}
              className="text-base md:text-lg text-neutral-600 dark:text-neutral-400 font-light max-w-2xl mx-auto leading-relaxed"
            >
              {reason === "cancelled"
                ? "Bạn đã hủy thanh toán. Đơn hàng đã được hủy và không được lưu."
                : reason === "failed"
                ? "Thanh toán thất bại. Vui lòng thử lại hoặc chọn phương thức thanh toán khác."
                : "Thanh toán không thành công. Đơn hàng đã được hủy."}
              <br />
              Vui lòng thử lại nếu bạn muốn tiếp tục mua sắm.
            </motion.p>

            {orderId && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.9 }}
                className="mt-6"
              >
                <p className="text-sm text-neutral-500 dark:text-neutral-500 font-light">
                  Mã đơn hàng:{" "}
                  <span className="font-medium text-neutral-900 dark:text-neutral-100">
                    {orderId.slice(-8).toUpperCase()}
                  </span>
                </p>
              </motion.div>
            )}
          </motion.div>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 1 }}
            className="flex flex-col sm:flex-row gap-4 justify-center"
          >
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button
                asChild
                className="inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-neutral-900 to-neutral-800 dark:from-neutral-100 dark:to-neutral-200 text-white dark:text-neutral-900 hover:from-neutral-800 hover:to-neutral-700 dark:hover:from-neutral-200 dark:hover:to-neutral-300 border-2 border-neutral-900 dark:border-neutral-100 rounded-sm text-sm font-light uppercase tracking-[0.15em] transition-all duration-300 hover:shadow-xl w-full sm:w-auto"
              >
                <Link href="/">
                  <ShoppingBag className="w-4 h-4" />
                  Tiếp tục mua sắm
                </Link>
              </Button>
            </motion.div>

            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button
                asChild
                variant="outline"
                className="inline-flex items-center gap-3 px-8 py-4 border-2 border-neutral-200 dark:border-neutral-800 hover:border-neutral-900 dark:hover:border-neutral-100 rounded-sm text-sm font-light uppercase tracking-[0.15em] transition-all duration-300 w-full sm:w-auto"
                onClick={() => router.back()}
              >
                <Link href="/checkout">
                  <RefreshCw className="w-4 h-4" />
                  Thử lại thanh toán
                </Link>
              </Button>
            </motion.div>
          </motion.div>

          {/* Additional Info */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 1.2 }}
            className="mt-12 text-center"
          >
            <p className="text-xs md:text-sm text-neutral-500 dark:text-neutral-400 font-light">
              Nếu bạn gặp vấn đề khi thanh toán, vui lòng liên hệ với chúng tôi để được hỗ trợ.
            </p>
          </motion.div>
        </div>
      </Container>
    </div>
  );
}

