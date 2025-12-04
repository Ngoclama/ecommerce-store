"use client";

import { useEffect, useRef, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Container from "@/components/ui/container";
import { Button } from "@/components/ui/button";
import { CheckCircle2, Sparkles, ArrowRight, Package, ShoppingBag, Heart } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import useCart from "@/hooks/use-cart";
import { toast } from "sonner";

export default function PaymentSuccessPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const cart = useCart();
  const hasProcessed = useRef(false);
  const [showConfetti, setShowConfetti] = useState(true);
  const [confettiParticles, setConfettiParticles] = useState<Array<{
    id: number;
    x: number;
    y: number;
    color: string;
    delay: number;
    angle?: number;
    speed?: number;
  }>>([]);

  const orderId = searchParams?.get("orderId") || null;
  const paymentMethod = searchParams?.get("method") || "unknown";

  // Generate confetti particles with fireworks effect
  useEffect(() => {
    if (!showConfetti) return;

    const colors = [
      "#FFD700", "#FF6B6B", "#4ECDC4", "#45B7D1", "#FFA07A",
      "#98D8C8", "#F7DC6F", "#BB8FCE", "#85C1E2", "#F8B739",
      "#FF1493", "#00CED1", "#FF6347", "#32CD32", "#FF69B4"
    ];

    // Create multiple bursts of confetti
    const createBurst = (centerX: number, centerY: number, delay: number) => {
      return Array.from({ length: 30 }, (_, i) => ({
        id: Math.random() * 1000000,
        x: centerX,
        y: centerY,
        color: colors[Math.floor(Math.random() * colors.length)],
        delay: delay + Math.random() * 0.5,
        angle: (Math.PI * 2 * i) / 30,
        speed: 2 + Math.random() * 3,
      }));
    };

    // Main confetti fall
    const mainParticles = Array.from({ length: 200 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: -10,
      color: colors[Math.floor(Math.random() * colors.length)],
      delay: Math.random() * 2,
      angle: 0,
      speed: 0,
    }));

    // Fireworks bursts
    const bursts = [
      ...createBurst(20, 30, 0.5),
      ...createBurst(50, 25, 1),
      ...createBurst(80, 30, 1.5),
      ...createBurst(35, 20, 2),
      ...createBurst(65, 20, 2.5),
    ];

    setConfettiParticles([...mainParticles, ...bursts]);

    // Stop confetti after 6 seconds
    const timer = setTimeout(() => {
      setShowConfetti(false);
    }, 6000);

    return () => clearTimeout(timer);
  }, [showConfetti]);

  // Handle payment success
  useEffect(() => {
    if (hasProcessed.current) return;

    hasProcessed.current = true;

    // Clear cart
    cart.removeAll();

    // Clear saved data
    localStorage.removeItem("appliedCoupon");
    localStorage.removeItem("customerNote");

    // Show success toast
    const methodNames: Record<string, string> = {
      vnpay: "VNPay",
      momo: "MoMo",
      stripe: "Stripe",
    };

    const methodName = methodNames[paymentMethod] || "thanh toán";
    toast.success(`Thanh toán ${methodName} thành công!`, {
      duration: 3000,
    });
  }, [cart, paymentMethod]);

  return (
    <div className="bg-gradient-to-br from-neutral-50 via-white to-neutral-50 dark:from-neutral-950 dark:via-gray-900 dark:to-neutral-950 min-h-screen py-12 md:py-16 lg:py-20 relative overflow-hidden">
      {/* Confetti & Fireworks Animation */}
      <AnimatePresence>
        {showConfetti && (
          <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
            {confettiParticles.map((particle, index) => {
              // Check if it's a burst particle (has angle and speed)
              const isBurst = 'angle' in particle && particle.angle !== undefined && 'speed' in particle;
              
              if (isBurst && particle.angle !== undefined && particle.speed !== undefined) {
                // Fireworks burst effect
                const endX = particle.x + Math.cos(particle.angle) * particle.speed * 20;
                const endY = particle.y + Math.sin(particle.angle) * particle.speed * 20;
                
                return (
                  <motion.div
                    key={particle.id}
                    initial={{
                      x: `${particle.x}vw`,
                      y: `${particle.y}vh`,
                      rotate: 0,
                      scale: 1,
                      opacity: 1,
                    }}
                    animate={{
                      x: `${endX}vw`,
                      y: `${endY}vh`,
                      rotate: 720,
                      scale: [1, 1.5, 0],
                      opacity: [1, 1, 0],
                    }}
                    transition={{
                      duration: 1.5 + Math.random() * 0.5,
                      delay: particle.delay,
                      ease: "easeOut",
                    }}
                    className="absolute w-2 h-2 rounded-full"
                    style={{
                      backgroundColor: particle.color,
                      boxShadow: `0 0 15px ${particle.color}, 0 0 30px ${particle.color}`,
                    }}
                  />
                );
              }
              
              // Regular confetti fall
              return (
                <motion.div
                  key={particle.id}
                  initial={{
                    x: `${particle.x}vw`,
                    y: -10,
                    rotate: 0,
                    scale: 1,
                  }}
                  animate={{
                    y: "110vh",
                    rotate: 720 + Math.random() * 360,
                    scale: [1, 1.3, 0.9, 1],
                    x: `${particle.x + (Math.random() - 0.5) * 30}vw`,
                  }}
                  transition={{
                    duration: 3 + Math.random() * 2,
                    delay: particle.delay,
                    ease: "easeOut",
                  }}
                  className="absolute rounded-full"
                  style={{
                    width: Math.random() * 8 + 4,
                    height: Math.random() * 8 + 4,
                    backgroundColor: particle.color,
                    boxShadow: `0 0 10px ${particle.color}, 0 0 20px ${particle.color}`,
                  }}
                />
              );
            })}
          </div>
        )}
      </AnimatePresence>

      <Container>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Success Icon */}
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
                  rotate: [0, 5, -5, 0],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
                className="w-32 h-32 md:w-40 md:h-40 rounded-full bg-gradient-to-br from-green-400 via-emerald-500 to-teal-600 dark:from-green-500 dark:via-emerald-600 dark:to-teal-700 border-4 border-white dark:border-neutral-900 shadow-2xl flex items-center justify-center"
              >
                <CheckCircle2 className="w-16 h-16 md:w-20 md:h-20 text-white" />
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
                className="absolute inset-0 rounded-full bg-gradient-to-br from-green-400 to-teal-600 blur-2xl"
              />
            </div>
          </motion.div>

          {/* Thank You Message */}
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
              className="inline-flex items-center gap-3 px-6 py-3 bg-gradient-to-br from-neutral-900 to-neutral-800 dark:from-neutral-100 dark:to-neutral-200 border-2 border-neutral-900 dark:border-neutral-100 rounded-sm mb-6"
            >
              <motion.div
                animate={{ rotate: [0, 10, -10, 0] }}
                transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
              >
                <Sparkles className="w-5 h-5 text-white dark:text-neutral-900" />
              </motion.div>
              <span className="text-xs font-light text-white dark:text-neutral-900 uppercase tracking-[0.2em]">
                Thanh toán thành công
              </span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
              className="text-4xl md:text-5xl lg:text-6xl font-light text-neutral-900 dark:text-neutral-100 leading-[1.1] tracking-tight uppercase mb-6"
            >
              Cảm ơn bạn đã mua sắm!
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
              Đơn hàng của bạn đã được xác nhận và đang được xử lý.
              <br />
              Chúng tôi sẽ gửi email xác nhận đến bạn trong giây lát.
            </motion.p>

            {orderId && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.9 }}
                className="mt-6"
              >
                <p className="text-sm text-neutral-500 dark:text-neutral-500 font-light">
                  Mã đơn hàng: <span className="font-medium text-neutral-900 dark:text-neutral-100">{orderId.slice(-8).toUpperCase()}</span>
                </p>
              </motion.div>
            )}
          </motion.div>

          {/* Order Summary Card */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 1 }}
            className="bg-white dark:bg-gray-900 rounded-sm p-6 md:p-8 lg:p-10 border-2 border-neutral-200 dark:border-neutral-800 shadow-xl mb-8"
          >
            <div className="flex items-center gap-4 mb-6 pb-6 border-b-2 border-neutral-200 dark:border-neutral-800">
              <motion.div
                whileHover={{ rotate: 5 }}
                className="p-3 rounded-sm bg-gradient-to-br from-neutral-900 to-neutral-800 dark:from-neutral-100 dark:to-neutral-200 border-2 border-neutral-900 dark:border-neutral-100"
              >
                <Package className="w-6 h-6 text-white dark:text-neutral-900" />
              </motion.div>
              <h2 className="text-xl md:text-2xl font-light text-neutral-900 dark:text-neutral-100 uppercase tracking-tight">
                Thông tin đơn hàng
              </h2>
            </div>

            <div className="space-y-4">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 1.1 }}
                className="flex items-center justify-between p-4 bg-gradient-to-br from-neutral-50 to-white dark:from-neutral-900 dark:to-neutral-800 border-2 border-neutral-200 dark:border-neutral-800 rounded-sm"
              >
                <span className="text-sm font-light text-neutral-600 dark:text-neutral-400 uppercase tracking-[0.15em]">
                  Trạng thái
                </span>
                <span className="px-4 py-2 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 text-sm font-light uppercase tracking-wide rounded-sm border border-green-200 dark:border-green-800">
                  Đã thanh toán
                </span>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 1.2 }}
                className="flex items-center justify-between p-4 bg-gradient-to-br from-neutral-50 to-white dark:from-neutral-900 dark:to-neutral-800 border-2 border-neutral-200 dark:border-neutral-800 rounded-sm"
              >
                <span className="text-sm font-light text-neutral-600 dark:text-neutral-400 uppercase tracking-[0.15em]">
                  Phương thức thanh toán
                </span>
                <span className="text-sm font-light text-neutral-900 dark:text-neutral-100 uppercase tracking-wide">
                  {paymentMethod === "vnpay" && "VNPay"}
                  {paymentMethod === "momo" && "MoMo"}
                  {paymentMethod === "stripe" && "Stripe"}
                  {paymentMethod === "cod" && "COD"}
                  {!["vnpay", "momo", "stripe", "cod"].includes(paymentMethod) && "Thanh toán trực tuyến"}
                </span>
              </motion.div>
            </div>
          </motion.div>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 1.3 }}
            className="flex flex-col sm:flex-row gap-4 justify-center"
          >
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Button
                asChild
                className="inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-neutral-900 to-neutral-800 dark:from-neutral-100 dark:to-neutral-200 text-white dark:text-neutral-900 hover:from-neutral-800 hover:to-neutral-700 dark:hover:from-neutral-200 dark:hover:to-neutral-300 border-2 border-neutral-900 dark:border-neutral-100 rounded-sm text-sm font-light uppercase tracking-[0.15em] transition-all duration-300 hover:shadow-xl w-full sm:w-auto"
              >
                <Link href="/account/orders">
                  <Package className="w-4 h-4" />
                  Xem đơn hàng
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </Button>
            </motion.div>

            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Button
                asChild
                variant="outline"
                className="inline-flex items-center gap-3 px-8 py-4 border-2 border-neutral-200 dark:border-neutral-800 hover:border-neutral-900 dark:hover:border-neutral-100 rounded-sm text-sm font-light uppercase tracking-[0.15em] transition-all duration-300 w-full sm:w-auto"
              >
                <Link href="/">
                  <ShoppingBag className="w-4 h-4" />
                  Tiếp tục mua sắm
                  <Heart className="w-4 h-4" />
                </Link>
              </Button>
            </motion.div>
          </motion.div>

          {/* Additional Info */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 1.4 }}
            className="mt-12 text-center"
          >
            <p className="text-xs md:text-sm text-neutral-500 dark:text-neutral-400 font-light">
              Bạn sẽ nhận được email xác nhận đơn hàng trong vài phút tới.
              <br />
              Nếu có bất kỳ câu hỏi nào, vui lòng liên hệ với chúng tôi.
            </p>
          </motion.div>
        </div>
      </Container>
    </div>
  );
}

