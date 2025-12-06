"use client";

import Container from "@/components/ui/container";
import {
  Package,
  ArrowLeft,
  CheckCircle2,
  Clock,
  Truck,
  XCircle,
  Calendar,
  MapPin,
  Phone,
  Mail,
  CreditCard,
  TruckIcon,
  X,
  Star,
  Loader2,
  ExternalLink,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { useRouter, useParams, useSearchParams } from "next/navigation";
import { toast } from "sonner";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import Currency from "@/components/ui/currency";
import Image from "next/image";
import Link from "next/link";
import { useAuth } from "@clerk/nextjs";

interface OrderItem {
  id: string;
  productName: string;
  quantity: number;
  price: number;
  imageUrl?: string;
  sizeName?: string;
  colorName?: string;
  materialName?: string;
  product?: {
    id: string;
    name: string;
    images?: Array<{ url: string }>;
  };
}

interface Order {
  id: string;
  orderNumber: string;
  total: number;
  subtotal: number;
  tax: number;
  discount: number;
  shippingCost?: number;
  status: string;
  isPaid: boolean;
  paymentMethod?: string;
  paymentStatus?: string;
  trackingNumber?: string;
  shippingMethod?: string;
  createdAt: string;
  updatedAt: string;
  orderItems: OrderItem[];
  store?: {
    id: string;
    name: string;
  };
  phone?: string;
  email?: string;
  address?: string;
  receiverName?: string;
  receiverPhone?: string;
  shippingAddress?: string;
  city?: string;
  postalCode?: string;
  country?: string;
  customerNote?: string;
}

const getStatusInfo = (status: string) => {
  switch (status) {
    case "PENDING":
      return {
        label: "Chờ xử lý",
        icon: Clock,
        color: "text-amber-600 dark:text-amber-400",
        bgColor: "bg-amber-50 dark:bg-amber-950",
        borderColor: "border-amber-200 dark:border-amber-800",
      };
    case "PROCESSING":
      return {
        label: "Đang xử lý",
        icon: Package,
        color: "text-blue-600 dark:text-blue-400",
        bgColor: "bg-blue-50 dark:bg-blue-950",
        borderColor: "border-blue-200 dark:border-blue-800",
      };
    case "SHIPPED":
      return {
        label: "Đã gửi hàng",
        icon: Truck,
        color: "text-purple-600 dark:text-purple-400",
        bgColor: "bg-purple-50 dark:bg-purple-950",
        borderColor: "border-purple-200 dark:border-purple-800",
      };
    case "DELIVERED":
      return {
        label: "Đã giao hàng",
        icon: CheckCircle2,
        color: "text-green-600 dark:text-green-400",
        bgColor: "bg-green-50 dark:bg-green-950",
        borderColor: "border-green-200 dark:border-green-800",
      };
    case "CANCELLED":
      return {
        label: "Đã hủy",
        icon: XCircle,
        color: "text-red-600 dark:text-red-400",
        bgColor: "bg-red-50 dark:bg-red-950",
        borderColor: "border-red-200 dark:border-red-800",
      };
    default:
      return {
        label: status,
        icon: Package,
        color: "text-gray-600 dark:text-gray-400",
        bgColor: "bg-gray-50 dark:bg-gray-950",
        borderColor: "border-gray-200 dark:border-gray-800",
      };
  }
};

const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat("vi-VN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
};

export default function OrderDetailPage() {
  const router = useRouter();
  const params = useParams();
  const searchParams = useSearchParams();
  const { isSignedIn } = useAuth();
  const orderId = params?.orderId as string;
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [cancelling, setCancelling] = useState(false);
  const fromPayment = searchParams?.get("fromPayment") === "true";

  useEffect(() => {
    if (!isSignedIn) {
      router.push("/sign-in");
      return;
    }

    if (!orderId) {
      router.push("/account/orders");
      return;
    }

    const fetchOrder = async (retryCount = 0) => {
      try {
        setLoading(true);

        // Check cache first (skip cache if from payment to get fresh data)
        const cacheKey = `order_${orderId}`;
        const cachedData = !fromPayment ? sessionStorage.getItem(cacheKey) : null;
        const cacheTime = !fromPayment ? sessionStorage.getItem(`${cacheKey}_time`) : null;

        if (cachedData && cacheTime) {
          const age = Date.now() - parseInt(cacheTime);
          if (age < 60000) {
            // 1 minute cache
            const cachedOrder = JSON.parse(cachedData);
            setOrder(cachedOrder);
            setLoading(false);
            // Fetch in background to update
            fetch(`/api/orders/${orderId}`, { cache: "no-store" })
              .then((res) => {
                if (res.ok) {
                  return res.json();
                }
                throw new Error(`HTTP ${res.status}`);
              })
              .then((orderData) => {
                const foundOrder = orderData?.id ? orderData : orderData?.order || orderData?.data;
                if (foundOrder && foundOrder.id === orderId) {
                  setOrder(foundOrder);
                  sessionStorage.setItem(cacheKey, JSON.stringify(foundOrder));
                  sessionStorage.setItem(
                    `${cacheKey}_time`,
                    Date.now().toString()
                  );
                }
              })
              .catch((err) => {
                console.warn("[ORDER_DETAIL_BACKGROUND_UPDATE]", err);
              });
            return;
          }
        }

        // For new orders (from payment), add delay and retry logic
        if (fromPayment && retryCount === 0) {
          // Wait a bit for order to be saved and user to be synced
          await new Promise((resolve) => setTimeout(resolve, 2000));
        }

        // Fetch order detail directly by orderId
        const response = await fetch(`/api/orders/${orderId}`, {
          cache: "no-store",
          headers: {
            "Content-Type": "application/json",
          },
        });

        if (!response.ok) {
          // Handle 503 Service Unavailable - retry for new orders
          if (response.status === 503 && fromPayment && retryCount < 3) {
            console.log(`[ORDER_DETAIL] Retrying fetch (attempt ${retryCount + 1}/3)...`);
            await new Promise((resolve) => setTimeout(resolve, 3000 * (retryCount + 1)));
            return fetchOrder(retryCount + 1);
          }

          // Handle 401 Unauthenticated
          if (response.status === 401) {
            toast.error("Vui lòng đăng nhập để xem đơn hàng");
            router.push("/sign-in");
            return;
          }

          // Handle 403 Forbidden (email không khớp)
          if (response.status === 403) {
            toast.error("Bạn không có quyền xem đơn hàng này. Vui lòng kiểm tra email đã nhập khi thanh toán.");
            router.push("/account/orders");
            return;
          }

          // Handle 404 Not Found
          if (response.status === 404) {
            // For new orders, retry a few times as it might not be synced yet
            if (fromPayment && retryCount < 3) {
              console.log(`[ORDER_DETAIL] Order not found, retrying (attempt ${retryCount + 1}/3)...`);
              await new Promise((resolve) => setTimeout(resolve, 3000 * (retryCount + 1)));
              return fetchOrder(retryCount + 1);
            }
            toast.error("Không tìm thấy đơn hàng. Vui lòng thử lại sau.");
            router.push("/account/orders");
            return;
          }

          let errorMessage = `HTTP ${response.status}: ${response.statusText}`;
          try {
            const errorData = await response.json();
            errorMessage = errorData?.message || errorMessage;
          } catch (parseError) {
            // If response is not JSON, try to get text
            try {
              const errorText = await response.text();
              if (errorText) {
                errorMessage = errorText;
              }
            } catch (textError) {
              // Ignore text parsing error
            }
          }
          
          const error = new Error(errorMessage);
          (error as any).status = response.status;
          (error as any).statusText = response.statusText;
          throw error;
        }

        let orderData;
        try {
          const responseText = await response.text();
          if (!responseText) {
            throw new Error("Empty response from server");
          }
          orderData = JSON.parse(responseText);
        } catch (parseError: any) {
          console.error("[ORDER_DETAIL] JSON parse error:", parseError);
          throw new Error(`Failed to parse response: ${parseError?.message || "Invalid JSON"}`);
        }

        // Handle both direct order object or wrapped response
        const foundOrder = orderData?.id ? orderData : orderData?.order || orderData?.data;

        if (!foundOrder || foundOrder.id !== orderId) {
          console.warn(`[ORDER_DETAIL] Order ${orderId} not found or invalid response`);
          
          // For new orders, retry a few times as it might not be synced yet
          if (fromPayment && retryCount < 3) {
            console.log(`[ORDER_DETAIL] Order not found, retrying (attempt ${retryCount + 1}/3)...`);
            await new Promise((resolve) => setTimeout(resolve, 3000 * (retryCount + 1)));
            return fetchOrder(retryCount + 1);
          }

          toast.error("Không tìm thấy đơn hàng. Vui lòng thử lại sau.");
          router.push("/account/orders");
          return;
        }

        setOrder(foundOrder);

        // Cache the order
        sessionStorage.setItem(cacheKey, JSON.stringify(foundOrder));
        sessionStorage.setItem(`${cacheKey}_time`, Date.now().toString());
      } catch (error: any) {
        // Log detailed error information
        const errorDetails = {
          name: error?.name,
          message: error?.message,
          stack: error?.stack,
          cause: error?.cause,
          code: error?.code,
          status: error?.status,
          statusText: error?.statusText,
          response: error?.response,
          retryCount,
          fromPayment,
          orderId,
        };
        
        console.error("[ORDER_DETAIL_FETCH_ERROR]", errorDetails);
        
        // Log the raw error if it exists
        if (error) {
          console.error("[ORDER_DETAIL_FETCH_ERROR] Raw error:", error);
          console.error("[ORDER_DETAIL_FETCH_ERROR] Error type:", typeof error);
          console.error("[ORDER_DETAIL_FETCH_ERROR] Error keys:", Object.keys(error || {}));
        }

        // Retry for network errors if from payment
        if (fromPayment && retryCount < 3 && (
          error?.message?.includes("503") ||
          error?.message?.includes("timeout") ||
          error?.message?.includes("ECONNREFUSED") ||
          error?.message?.includes("fetch failed")
        )) {
          console.log(`[ORDER_DETAIL] Network error, retrying (attempt ${retryCount + 1}/3)...`);
          await new Promise((resolve) => setTimeout(resolve, 3000 * (retryCount + 1)));
          return fetchOrder(retryCount + 1);
        }

        const errorMessage = error?.message || "Không thể tải chi tiết đơn hàng";
        toast.error(errorMessage);
        
        // Don't redirect immediately for new orders - let user see the error
        if (!fromPayment) {
          router.push("/account/orders");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [orderId, isSignedIn, router, fromPayment]);

  // Hiển thị thông báo thanh toán thành công nếu từ payment success page
  useEffect(() => {
    if (fromPayment && order) {
      const paymentMethod = searchParams?.get("method") || "thanh toán";
      const methodNames: Record<string, string> = {
        vnpay: "VNPay",
        momo: "MoMo",
        stripe: "Stripe",
        cod: "COD",
      };
      const methodName = methodNames[paymentMethod] || paymentMethod;
      toast.success(`Thanh toán ${methodName} thành công!`, {
        duration: 5000,
      });
    }
  }, [fromPayment, order, searchParams]);

  // Loading state will be handled by Next.js loading.tsx
  if (loading && !order) {
    return null; // Let Next.js loading.tsx handle it
  }

  if (!order) {
    return null;
  }

  const statusInfo = getStatusInfo(order.status);
  const StatusIcon = statusInfo.icon;

  // Cancel order function
  const handleCancelOrder = async () => {
    if (!order) return;
    if (!confirm("Bạn có chắc chắn muốn hủy đơn hàng này?")) {
      return;
    }

    try {
      setCancelling(true);

      // Use store API route (proxy to admin) instead of calling admin directly
      const response = await fetch(`/api/orders/${order.id}/cancel`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
      });

      if (!response.ok) {
        // Handle 401 - Session expired
        if (response.status === 401) {
          const errorData = await response.json().catch(() => ({}));
          const errorMessage = errorData.message || "Chưa xác thực";
          
          if (isSignedIn) {
            // User is signed in but got 401 - session expired
            toast.info("Đơn hàng đã hủy. Vui lòng tải lại trang để thay đổi.");
            // Reload page to refresh session
            setTimeout(() => {
              window.location.reload();
            }, 1500);
          } else {
            toast.error("Vui lòng đăng nhập để hủy đơn hàng");
            router.push("/sign-in");
          }
          return;
        }

        // Try to parse JSON error response
        let errorMessage = "Không thể hủy đơn hàng";
        try {
          const errorData = await response.json();
          errorMessage = errorData.message || errorData.error || errorMessage;
        } catch (parseError) {
          // If response is not JSON, try to get text
          try {
            const text = await response.text();
            errorMessage = text || errorMessage;
          } catch (textError) {
            // Fallback to default message
            console.error("[CANCEL_ORDER] Failed to parse error response:", textError);
          }
        }
        throw new Error(errorMessage);
      }

      // Parse success response
      const data = await response.json();
      toast.success(data.message || "Đã hủy đơn hàng thành công");
      
      // Clear cache for this order
      try {
        sessionStorage.removeItem(`order_${order.id}`);
        sessionStorage.removeItem(`order_${order.id}_time`);
      } catch (e) {
        console.warn("[CANCEL_ORDER] Failed to clear cache", e);
      }
      
      // Reload page after a short delay to show success message
      setTimeout(() => {
        window.location.href = "/account/orders";
      }, 1000);
    } catch (error: any) {
      console.error("[CANCEL_ORDER_ERROR]", error);
      toast.error(error.message || "Không thể hủy đơn hàng. Vui lòng thử lại sau.");
    } finally {
      setCancelling(false);
    }
  };

  // Check if order can be cancelled
  const canCancelOrder = order.status === "PENDING" || order.status === "PROCESSING";

  // Check if order can be reviewed
  const canReviewOrder = order.status === "DELIVERED";

  return (
    <div className="bg-gradient-to-br from-neutral-50 via-white to-neutral-50 dark:from-neutral-950 dark:via-gray-900 dark:to-neutral-950 min-h-screen py-12 md:py-16 lg:py-20">
      <Container>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Back Button */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="mb-8"
          >
            <Button
              variant="ghost"
              onClick={() => router.push("/account/orders")}
              className="flex items-center gap-2 text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-100 font-light uppercase tracking-wide"
            >
              <ArrowLeft className="w-4 h-4" />
              Quay lại danh sách đơn hàng
            </Button>
          </motion.div>

          {/* Success Banner nếu từ payment success */}
          {fromPayment && order && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-950/30 dark:to-emerald-950/30 border-2 border-green-200 dark:border-green-800 rounded-sm p-4 md:p-6 mb-6"
            >
              <div className="flex items-center gap-3">
                <CheckCircle2 className="w-6 h-6 text-green-600 dark:text-green-400 shrink-0" />
                <div className="flex-1">
                  <h3 className="text-base font-medium text-green-900 dark:text-green-100 mb-1">
                    Thanh toán thành công!
                  </h3>
                  <p className="text-sm text-green-700 dark:text-green-300">
                    Đơn hàng của bạn đã được xác nhận và đang được xử lý. Chúng
                    tôi sẽ gửi email xác nhận đến bạn trong giây lát.
                  </p>
                </div>
              </div>
            </motion.div>
          )}

          {/* Order Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white dark:bg-gray-900 rounded-sm border-2 border-neutral-200 dark:border-neutral-800 shadow-xl p-6 md:p-8 mb-6"
          >
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
              <div>
                <h1 className="text-2xl md:text-3xl font-light text-neutral-900 dark:text-neutral-100 uppercase tracking-wide mb-2">
                  Đơn hàng #{order.orderNumber}
                </h1>
                <div className="flex items-center gap-2 text-sm text-neutral-600 dark:text-neutral-400">
                  <Calendar className="w-4 h-4" />
                  <span>Đặt ngày: {formatDate(order.createdAt)}</span>
                </div>
              </div>
              <div className="text-right">
                <div
                  className={cn(
                    "inline-flex items-center gap-2 px-4 py-2 rounded-sm text-sm font-light uppercase tracking-wide border mb-2",
                    statusInfo.bgColor,
                    statusInfo.color,
                    statusInfo.borderColor
                  )}
                >
                  <StatusIcon className="w-4 h-4" />
                  {statusInfo.label}
                </div>
                <div className="text-2xl md:text-3xl font-light text-neutral-900 dark:text-neutral-100 mt-2">
                  <Currency value={order.total} />
                </div>
                <div className="text-xs text-neutral-500 dark:text-neutral-500 uppercase tracking-wide mt-1">
                  {order.isPaid ? (
                    <span className="text-green-600 dark:text-green-400">
                      Đã thanh toán
                    </span>
                  ) : (
                    <span className="text-amber-600 dark:text-amber-400">
                      Chưa thanh toán
                    </span>
                  )}
                </div>
              </div>
            </div>
          </motion.div>

          {/* Order Items */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white dark:bg-gray-900 rounded-sm border-2 border-neutral-200 dark:border-neutral-800 shadow-xl p-6 md:p-8 mb-6"
          >
            <h2 className="text-lg font-light text-neutral-900 dark:text-neutral-100 uppercase tracking-wide mb-6">
              Sản phẩm đã đặt
            </h2>
            <div className="space-y-4">
              {order.orderItems.map((item, index) => {
                const imageUrl =
                  item.imageUrl ||
                  item.product?.images?.[0]?.url ||
                  "/placeholder.svg";

                return (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="flex gap-4 pb-4 border-b border-neutral-100 dark:border-neutral-800 last:border-0 last:pb-0"
                  >
                    <Link
                      href={`/product/${item.product?.id || "#"}`}
                      className="relative w-24 h-24 md:w-32 md:h-32 shrink-0 bg-neutral-100 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 group/item overflow-hidden"
                    >
                      <Image
                        src={imageUrl}
                        alt={item.productName}
                        fill
                        sizes="(max-width: 768px) 96px, 128px"
                        className="object-cover group-hover/item:scale-105 transition-transform duration-300"
                      />
                    </Link>
                    <div className="flex-1 min-w-0">
                      <Link
                        href={`/product/${item.product?.id || "#"}`}
                        className="block mb-2"
                      >
                        <h3 className="text-base md:text-lg font-light text-neutral-900 dark:text-neutral-100 hover:text-neutral-600 dark:hover:text-neutral-400 transition-colors uppercase tracking-wide line-clamp-2">
                          {item.productName}
                        </h3>
                      </Link>
                      <div className="flex flex-wrap gap-2 mb-3 text-sm text-neutral-500 dark:text-neutral-500">
                        {item.sizeName && (
                          <span className="uppercase">
                            Size: {item.sizeName}
                          </span>
                        )}
                        {item.colorName && (
                          <span className="uppercase">
                            Màu: {item.colorName}
                          </span>
                        )}
                        {item.materialName && (
                          <span className="uppercase">
                            Chất liệu: {item.materialName}
                          </span>
                        )}
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="text-sm text-neutral-600 dark:text-neutral-400">
                          Số lượng:{" "}
                          <span className="font-medium text-neutral-900 dark:text-neutral-100">
                            {item.quantity}
                          </span>
                        </div>
                        <div className="text-lg font-medium text-neutral-900 dark:text-neutral-100">
                          <Currency value={(item.price || 0) * item.quantity} />
                        </div>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </motion.div>

          {/* Order Information Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            {/* Shipping Information */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-white dark:bg-gray-900 rounded-sm border-2 border-neutral-200 dark:border-neutral-800 shadow-xl p-6 md:p-8"
            >
              <h2 className="text-lg font-light text-neutral-900 dark:text-neutral-100 uppercase tracking-wide mb-4 flex items-center gap-2">
                <TruckIcon className="w-5 h-5" />
                Thông tin giao hàng
              </h2>
              <div className="space-y-3 text-sm">
                {order.receiverName && (
                  <div>
                    <span className="text-neutral-600 dark:text-neutral-400 uppercase tracking-wide">
                      Người nhận:{" "}
                    </span>
                    <span className="text-neutral-900 dark:text-neutral-100 font-medium">
                      {order.receiverName}
                    </span>
                  </div>
                )}
                {order.receiverPhone && (
                  <div className="flex items-center gap-2">
                    <Phone className="w-4 h-4 text-neutral-400" />
                    <span className="text-neutral-900 dark:text-neutral-100">
                      {order.receiverPhone}
                    </span>
                  </div>
                )}
                {(order.shippingAddress || order.address) && (
                  <div className="flex items-start gap-2">
                    <MapPin className="w-4 h-4 text-neutral-400 mt-0.5 shrink-0" />
                    <span className="text-neutral-900 dark:text-neutral-100">
                      {order.shippingAddress || order.address}
                      {order.city && `, ${order.city}`}
                      {order.postalCode && `, ${order.postalCode}`}
                      {order.country && `, ${order.country}`}
                    </span>
                  </div>
                )}
                {order.shippingMethod && (
                  <div>
                    <span className="text-neutral-600 dark:text-neutral-400 uppercase tracking-wide">
                      Phương thức:{" "}
                    </span>
                    <span className="text-neutral-900 dark:text-neutral-100 font-medium">
                      {order.shippingMethod}
                    </span>
                  </div>
                )}
                {order.trackingNumber && (
                  <div>
                    <span className="text-neutral-600 dark:text-neutral-400 uppercase tracking-wide">
                      Mã vận đơn:{" "}
                    </span>
                    <span className="text-neutral-900 dark:text-neutral-100 font-medium">
                      {order.trackingNumber}
                    </span>
                  </div>
                )}
              </div>
            </motion.div>

            {/* Payment Information */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-white dark:bg-gray-900 rounded-sm border-2 border-neutral-200 dark:border-neutral-800 shadow-xl p-6 md:p-8"
            >
              <h2 className="text-lg font-light text-neutral-900 dark:text-neutral-100 uppercase tracking-wide mb-4 flex items-center gap-2">
                <CreditCard className="w-5 h-5" />
                Thông tin thanh toán
              </h2>
              <div className="space-y-3 text-sm">
                {order.paymentMethod && (
                  <div>
                    <span className="text-neutral-600 dark:text-neutral-400 uppercase tracking-wide">
                      Phương thức:{" "}
                    </span>
                    <span className="text-neutral-900 dark:text-neutral-100 font-medium">
                      {order.paymentMethod}
                    </span>
                  </div>
                )}
                {order.paymentStatus && (
                  <div>
                    <span className="text-neutral-600 dark:text-neutral-400 uppercase tracking-wide">
                      Trạng thái:{" "}
                    </span>
                    <span
                      className={cn(
                        "font-medium",
                        order.paymentStatus === "PAID"
                          ? "text-green-600 dark:text-green-400"
                          : "text-amber-600 dark:text-amber-400"
                      )}
                    >
                      {order.paymentStatus === "PAID"
                        ? "Đã thanh toán"
                        : order.paymentStatus === "PENDING"
                        ? "Chờ thanh toán"
                        : order.paymentStatus}
                    </span>
                  </div>
                )}
                {order.email && (
                  <div className="flex items-center gap-2">
                    <Mail className="w-4 h-4 text-neutral-400" />
                    <span className="text-neutral-900 dark:text-neutral-100">
                      {order.email}
                    </span>
                  </div>
                )}
                {order.phone && (
                  <div className="flex items-center gap-2">
                    <Phone className="w-4 h-4 text-neutral-400" />
                    <span className="text-neutral-900 dark:text-neutral-100">
                      {order.phone}
                    </span>
                  </div>
                )}
              </div>
            </motion.div>
          </div>

          {/* Order Summary */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-white dark:bg-gray-900 rounded-sm border-2 border-neutral-200 dark:border-neutral-800 shadow-xl p-6 md:p-8"
          >
            <h2 className="text-lg font-light text-neutral-900 dark:text-neutral-100 uppercase tracking-wide mb-6">
              Tóm tắt đơn hàng
            </h2>
            <div className="space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-neutral-600 dark:text-neutral-400 uppercase tracking-wide">
                  Tạm tính:
                </span>
                <span className="text-neutral-900 dark:text-neutral-100 font-medium">
                  <Currency value={order.subtotal} />
                </span>
              </div>
              {order.discount > 0 && (
                <div className="flex justify-between text-sm">
                  <span className="text-neutral-600 dark:text-neutral-400 uppercase tracking-wide">
                    Giảm giá:
                  </span>
                  <span className="text-green-600 dark:text-green-400 font-medium">
                    -<Currency value={order.discount} />
                  </span>
                </div>
              )}
              {order.shippingCost && order.shippingCost > 0 && (
                <div className="flex justify-between text-sm">
                  <span className="text-neutral-600 dark:text-neutral-400 uppercase tracking-wide">
                    Phí vận chuyển:
                  </span>
                  <span className="text-neutral-900 dark:text-neutral-100 font-medium">
                    <Currency value={order.shippingCost} />
                  </span>
                </div>
              )}
              {order.tax > 0 && (
                <div className="flex justify-between text-sm">
                  <span className="text-neutral-600 dark:text-neutral-400 uppercase tracking-wide">
                    Thuế:
                  </span>
                  <span className="text-neutral-900 dark:text-neutral-100 font-medium">
                    <Currency value={order.tax} />
                  </span>
                </div>
              )}
              <div className="pt-3 border-t border-neutral-200 dark:border-neutral-800 flex justify-between">
                <span className="text-base font-light text-neutral-900 dark:text-neutral-100 uppercase tracking-wide">
                  Tổng cộng:
                </span>
                <span className="text-2xl font-light text-neutral-900 dark:text-neutral-100">
                  <Currency value={order.total} />
                </span>
              </div>
            </div>
            {order.customerNote && (
              <div className="mt-6 pt-6 border-t border-neutral-200 dark:border-neutral-800">
                <h3 className="text-sm font-light text-neutral-600 dark:text-neutral-400 uppercase tracking-wide mb-2">
                  Ghi chú:
                </h3>
                <p className="text-sm text-neutral-900 dark:text-neutral-100">
                  {order.customerNote}
                </p>
              </div>
            )}
          </motion.div>

          {/* Tracking Section */}
          {order.trackingNumber && order.status !== "DELIVERED" && order.status !== "CANCELLED" && (
            <motion.div
              id="tracking"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="bg-white dark:bg-gray-900 rounded-sm border-2 border-neutral-200 dark:border-neutral-800 shadow-xl p-6 md:p-8 mt-6"
            >
              <h2 className="text-lg font-light text-neutral-900 dark:text-neutral-100 uppercase tracking-wide mb-4 flex items-center gap-2">
                <Truck className="w-5 h-5" />
                Theo dõi đơn hàng
              </h2>
              <div className="space-y-3">
                <div className="p-4 bg-neutral-50 dark:bg-neutral-800/50 rounded-sm border border-neutral-200 dark:border-neutral-700">
                  <div className="text-sm text-neutral-600 dark:text-neutral-400 uppercase tracking-wide mb-2">
                    Mã vận đơn:
                  </div>
                  <div className="text-lg font-mono font-medium text-neutral-900 dark:text-neutral-100">
                    {order.trackingNumber}
                  </div>
                </div>
                {order.shippingMethod && (
                  <div className="text-sm">
                    <span className="text-neutral-600 dark:text-neutral-400 uppercase tracking-wide">
                      Đơn vị vận chuyển:{" "}
                    </span>
                    <span className="text-neutral-900 dark:text-neutral-100 font-medium">
                      {order.shippingMethod}
                    </span>
                  </div>
                )}
                <div className="pt-4 border-t border-neutral-200 dark:border-neutral-800">
                  <p className="text-sm text-neutral-600 dark:text-neutral-400 mb-3">
                    Bạn có thể tra cứu đơn hàng trên website của đơn vị vận chuyển bằng mã vận đơn trên.
                  </p>
                </div>
              </div>
            </motion.div>
          )}

          {/* Review Section */}
          {canReviewOrder && (
            <motion.div
              id="review"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="bg-white dark:bg-gray-900 rounded-sm border-2 border-neutral-200 dark:border-neutral-800 shadow-xl p-6 md:p-8 mt-6"
            >
              <h2 className="text-lg font-light text-neutral-900 dark:text-neutral-100 uppercase tracking-wide mb-4 flex items-center gap-2">
                <Star className="w-5 h-5" />
                Đánh giá sản phẩm
              </h2>
              <p className="text-sm text-neutral-600 dark:text-neutral-400 mb-4">
                Cảm ơn bạn đã mua sắm! Hãy chia sẻ đánh giá của bạn về sản phẩm.
              </p>
              <div className="space-y-4">
                {order.orderItems.map((item) => (
                  <div
                    key={item.id}
                    className="p-4 bg-neutral-50 dark:bg-neutral-800/50 rounded-sm border border-neutral-200 dark:border-neutral-700 flex items-center justify-between"
                  >
                    <div className="flex items-center gap-4 flex-1">
                      {item.imageUrl || item.product?.images?.[0]?.url ? (
                        <div className="relative w-16 h-16 shrink-0 bg-neutral-100 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 overflow-hidden">
                          <Image
                            src={item.imageUrl || item.product?.images?.[0]?.url || "/placeholder.svg"}
                            alt={item.productName}
                            fill
                            sizes="64px"
                            className="object-cover"
                          />
                        </div>
                      ) : null}
                      <div className="flex-1 min-w-0">
                        <h4 className="text-sm font-medium text-neutral-900 dark:text-neutral-100 mb-1 line-clamp-1">
                          {item.productName}
                        </h4>
                        <p className="text-xs text-neutral-500 dark:text-neutral-400">
                          Số lượng: {item.quantity}
                        </p>
                      </div>
                    </div>
                    <Button
                      variant="outline"
                      asChild
                      className="rounded-sm border-2 border-neutral-200 dark:border-neutral-800 hover:border-neutral-900 dark:hover:border-neutral-100 px-4 py-2 text-xs font-light uppercase tracking-[0.15em] transition-all duration-300"
                    >
                      <Link
                        href={`/product/${item.product?.id || "#"}?review=true`}
                        className="flex items-center gap-2"
                      >
                        <Star className="w-3.5 h-3.5" />
                        Đánh giá
                      </Link>
                    </Button>
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {/* Action Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
            className="mt-6 flex flex-wrap gap-3"
          >
            {/* Cancel Order Button */}
            {canCancelOrder && (
              <Button
                variant="outline"
                onClick={handleCancelOrder}
                disabled={cancelling}
                className="rounded-sm border-2 border-red-200 dark:border-red-800 hover:border-red-600 dark:hover:border-red-400 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/20 px-6 py-2.5 text-sm font-light uppercase tracking-[0.15em] transition-all duration-300 disabled:opacity-50"
              >
                {cancelling ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Đang hủy...
                  </>
                ) : (
                  <>
                    <X className="w-4 h-4 mr-2" />
                    Hủy đơn hàng
                  </>
                )}
              </Button>
            )}

            {/* Back to Orders Button */}
            <Button
              variant="outline"
              onClick={() => router.push("/account/orders")}
              className="rounded-sm border-2 border-neutral-200 dark:border-neutral-800 hover:border-neutral-900 dark:hover:border-neutral-100 px-6 py-2.5 text-sm font-light uppercase tracking-[0.15em] transition-all duration-300"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Quay lại danh sách
            </Button>
          </motion.div>
        </div>
      </Container>
    </div>
  );
}
