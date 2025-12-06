"use client";

import Container from "@/components/ui/container";
import {
  Package,
  Search,
  Filter,
  CheckCircle2,
  ArrowRight,
  ShoppingBag,
  Truck,
  Clock,
  XCircle,
  Eye,
  Calendar,
  X,
  Star,
  ExternalLink,
  Loader2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useEffect, useRef, useState, useCallback, useMemo } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { toast } from "sonner";
import useCart from "@/hooks/use-cart";
import { motion, useInView } from "framer-motion";
import { cn } from "@/lib/utils";
import Currency from "@/components/ui/currency";
import Image from "next/image";
import Link from "next/link";
import { useAuth } from "@clerk/nextjs";
import { SkeletonOrderList } from "@/components/ui/skeleton";
import { useDebounce } from "@/hooks/use-debounce";
import { cachedFetch } from "@/lib/api-cache";
import { fetchWithRetry } from "@/lib/fetch-optimized";

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

export default function OrdersPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const cart = useCart();
  const { isSignedIn } = useAuth();
  const hasProcessedPayment = useRef(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState<string | null>(null);
  const [cancellingOrderId, setCancellingOrderId] = useState<string | null>(
    null
  );
  const headerRef = useRef(null);
  const isHeaderInView = useInView(headerRef, { once: true, amount: 0.3 });

  // Debounce search query for better performance
  const debouncedSearchQuery = useDebounce(searchQuery, 300);

  // Fetch orders with improved retry logic and error handling
  const fetchOrders = useCallback(
    async (forceRefresh = false, retryCount = 0) => {
      // Don't check isSignedIn here - let the API handle authentication
      // This prevents race conditions where isSignedIn might not be updated yet

      try {
        setLoading(true);

        // Check cache first (skip if force refresh)
        const cacheKey = "orders_cache";
        const cachedData = !forceRefresh
          ? sessionStorage.getItem(cacheKey)
          : null;
        const cacheTime = !forceRefresh
          ? sessionStorage.getItem(`${cacheKey}_time`)
          : null;

        if (cachedData && cacheTime) {
          const age = Date.now() - parseInt(cacheTime);
          if (age < 60000) {
            // 60 seconds cache (increased from 30s for better performance)
            const parsedData = JSON.parse(cachedData);
            setOrders(parsedData);
            setLoading(false);

            // Fetch in background to update
            fetch("/api/orders", { cache: "no-store" })
              .then((res) => {
                if (res.ok) {
                  return res.json();
                }
                throw new Error(`HTTP ${res.status}`);
              })
              .then((data) => {
                const ordersData = Array.isArray(data)
                  ? data
                  : data?.data || data?.orders || [];
                if (Array.isArray(ordersData)) {
                  setOrders(ordersData);
                  try {
                    sessionStorage.setItem(
                      cacheKey,
                      JSON.stringify(ordersData)
                    );
                    sessionStorage.setItem(
                      `${cacheKey}_time`,
                      Date.now().toString()
                    );
                  } catch (e) {
                    // Silent fail
                  }
                }
              })
              .catch((err) => {
                if (process.env.NODE_ENV === "development") {
                  console.warn("[ORDERS_BACKGROUND_UPDATE_ERROR]", err);
                }
              });
            return;
          }
        }

        // Clear cache if force refresh
        if (forceRefresh) {
          sessionStorage.removeItem(cacheKey);
          sessionStorage.removeItem(`${cacheKey}_time`);
        }

        console.log(
          `[ORDERS_FETCH] Fetching orders (attempt ${retryCount + 1})...`
        );

        // Fetch with retry logic - reduced timeout for faster response
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 15000); // 15s timeout (reduced from 30s)

        const response = await fetch("/api/orders", {
          method: "GET",
          cache: "no-store",
          headers: {
            "Content-Type": "application/json",
          },
          signal: controller.signal,
        });

        clearTimeout(timeoutId);

        if (!response.ok) {
          // Handle 503 - retry
          if (response.status === 503 && retryCount < 3) {
            console.log(
              `[ORDERS_FETCH] 503 Service Unavailable, retrying (${
                retryCount + 1
              }/3)...`
            );
            await new Promise((resolve) =>
              setTimeout(resolve, 2000 * (retryCount + 1))
            );
            return fetchOrders(forceRefresh, retryCount + 1);
          }

          const errorData = await response.json().catch(() => ({}));
          const errorMessage =
            errorData?.message ||
            `HTTP ${response.status}: ${response.statusText}`;

          if (response.status === 401) {
            // Only show toast and redirect if user is actually not signed in
            // This prevents showing error when there's a temporary auth issue
            if (!isSignedIn) {
              toast.error("Vui lòng đăng nhập để xem đơn hàng");
              router.push("/sign-in");
            } else {
              // User is signed in but got 401 - might be token issue
              console.warn(
                "[ORDERS_FETCH] 401 but user is signed in - possible token issue"
              );
              toast.error(
                "Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại."
              );
              // Don't redirect immediately, let user try again
            }
            return;
          }

          throw new Error(errorMessage);
        }

        const data = await response.json();

        // Handle both array and object response
        const ordersData: Order[] = Array.isArray(data)
          ? data
          : data?.data || data?.orders || [];

        console.log(
          `[ORDERS_FETCH] Successfully fetched ${ordersData.length} orders`
        );

        if (!Array.isArray(ordersData)) {
          console.warn("[ORDERS_FETCH] Invalid data format:", data);
          setOrders([]);
          toast.error("Định dạng dữ liệu đơn hàng không hợp lệ.");
          return;
        }

        setOrders(ordersData);

        // Cache the data
        try {
          sessionStorage.setItem(cacheKey, JSON.stringify(ordersData));
          sessionStorage.setItem(`${cacheKey}_time`, Date.now().toString());
        } catch (storageError) {
          console.warn("[ORDERS_FETCH] Failed to cache data", storageError);
        }
      } catch (error: any) {
        console.error("[ORDERS_FETCH_ERROR]", {
          error,
          message: error?.message,
          name: error?.name,
          retryCount,
        });

        // Retry on network errors
        if (
          retryCount < 3 &&
          (error?.name === "AbortError" ||
            error?.message?.includes("503") ||
            error?.message?.includes("timeout") ||
            error?.message?.includes("ECONNREFUSED") ||
            error?.message?.includes("fetch failed"))
        ) {
          console.log(
            `[ORDERS_FETCH] Network error, retrying (${retryCount + 1}/3)...`
          );
          await new Promise((resolve) =>
            setTimeout(resolve, 2000 * (retryCount + 1))
          );
          return fetchOrders(forceRefresh, retryCount + 1);
        }

        // Show error message
        const errorMessage =
          error?.message ||
          "Không thể tải danh sách đơn hàng. Vui lòng thử lại sau.";

        if (
          errorMessage.includes("401") ||
          errorMessage.includes("Unauthenticated")
        ) {
          // Only show toast and redirect if user is actually not signed in
          if (!isSignedIn) {
            toast.error("Vui lòng đăng nhập để xem đơn hàng");
            router.push("/sign-in");
          } else {
            // User is signed in but got auth error - might be token issue
            console.warn("[ORDERS_FETCH] Auth error but user is signed in");
            toast.error("Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.");
          }
        } else if (
          errorMessage.includes("503") ||
          errorMessage.includes("timeout")
        ) {
          toast.error("Không thể kết nối đến server. Vui lòng thử lại sau.");
        } else {
          toast.error(errorMessage);
        }

        setOrders([]);
      } finally {
        setLoading(false);
      }
    },
    [isSignedIn, router]
  );

  useEffect(() => {
    fetchOrders();

    // Nếu user đã đăng nhập, thử link các đơn hàng chưa có userId
    if (isSignedIn) {
      const linkOrders = async () => {
        try {
          // Gọi qua store API proxy (sẽ forward tới admin)
          const response = await fetch("/api/orders/link-user", {
            method: "POST",
            credentials: "include",
          });

          if (response.ok) {
            const data = await response.json();
            if (data.success && data.linkedCount > 0) {
              console.log("[ORDERS] Linked orders:", data.linkedCount);
              // Refresh orders sau khi link
              setTimeout(() => {
                fetchOrders(true);
              }, 500);
            }
          } else {
            // Không log warning nếu timeout - đây là expected behavior khi admin server chậm
            // Orders sẽ được link tự động khi query
            if (response.status !== 503) {
              console.warn("[ORDERS] Link orders failed:", response.status);
            }
          }
        } catch (error) {
          // Silent fail
          console.warn("[ORDERS] Failed to link orders:", error);
        }
      };

      // Chạy sau 1 giây để đảm bảo user đã được sync
      const timer = setTimeout(linkOrders, 1000);
      return () => clearTimeout(timer);
    }
  }, [fetchOrders, isSignedIn]);

  // Handle payment success callback from Stripe, VNPay, MoMo
  useEffect(() => {
    if (hasProcessedPayment.current) {
      return;
    }

    const paymentStatus = searchParams?.get("payment");
    const paymentMethod = searchParams?.get("method");
    const fromPayment = searchParams?.get("fromPayment") === "true";

    if (paymentStatus === "success" || fromPayment) {
      hasProcessedPayment.current = true;

      // Clear cart after successful payment
      cart.removeAll();

      // Clear saved data
      localStorage.removeItem("appliedCoupon");
      localStorage.removeItem("customerNote");

      // Clear orders cache to force refresh
      sessionStorage.removeItem("orders_cache");
      sessionStorage.removeItem("orders_cache_time");

      // Show success message based on payment method
      if (paymentMethod === "vnpay") {
        toast.success(
          "Thanh toán VNPay thành công! Đơn hàng của bạn đang được xử lý.",
          {
            duration: 5000,
          }
        );
      } else if (paymentMethod === "momo") {
        toast.success(
          "Thanh toán MoMo thành công! Đơn hàng của bạn đang được xử lý.",
          {
            duration: 5000,
          }
        );
      } else if (paymentMethod === "cod") {
        toast.success(
          "Đặt hàng thành công! Đơn hàng của bạn đang được xử lý.",
          {
            duration: 5000,
          }
        );
      } else {
        toast.success(
          "Thanh toán thành công! Đơn hàng của bạn đang được xử lý.",
          {
            duration: 5000,
          }
        );
      }

      // Force refresh orders by calling fetchOrders with forceRefresh flag
      if (isSignedIn) {
        // Clear all caches first
        sessionStorage.removeItem("orders_cache");
        sessionStorage.removeItem("orders_cache_time");
        sessionStorage.removeItem("orders_count_cache");
        sessionStorage.removeItem("orders_count_cache_time");

        // Small delay to ensure order is saved in database and user is synced
        setTimeout(() => {
          fetchOrders(true); // Force refresh, skip cache
        }, 2000); // Tăng delay lên 2 giây để đảm bảo user đã được sync
      }
    }
  }, [searchParams, cart, isSignedIn, fetchOrders]);

  // Filter orders with memoization for better performance
  const filteredOrders = useMemo(() => {
    return orders.filter((order) => {
      const matchesSearch =
        debouncedSearchQuery === "" ||
        order.orderNumber
          .toLowerCase()
          .includes(debouncedSearchQuery.toLowerCase()) ||
        order.orderItems.some((item) =>
          item.productName
            .toLowerCase()
            .includes(debouncedSearchQuery.toLowerCase())
        );

      const matchesStatus = !filterStatus || order.status === filterStatus;

      return matchesSearch && matchesStatus;
    });
  }, [orders, debouncedSearchQuery, filterStatus]);

  // Cancel order function
  const handleCancelOrder = async (orderId: string) => {
    if (!confirm("Bạn có chắc chắn muốn hủy đơn hàng này?")) {
      return;
    }

    try {
      setCancellingOrderId(orderId);
      const apiUrl = process.env.NEXT_PUBLIC_API_URL;
      if (!apiUrl) {
        toast.error("Không thể kết nối đến server");
        return;
      }

      const response = await fetch(
        `${apiUrl.replace(/\/$/, "")}/api/orders/${orderId}/cancel`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
        }
      );

      if (!response.ok) {
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
            console.error(
              "[CANCEL_ORDER] Failed to parse error response:",
              textError
            );
          }
        }
        throw new Error(errorMessage);
      }

      // Parse success response
      const data = await response.json();
      toast.success(data.message || "Đã hủy đơn hàng thành công");
      // Refresh orders
      fetchOrders(true);
    } catch (error: any) {
      console.error("[CANCEL_ORDER_ERROR]", error);
      toast.error(
        error.message || "Không thể hủy đơn hàng. Vui lòng thử lại sau."
      );
    } finally {
      setCancellingOrderId(null);
    }
  };

  // Check if order can be cancelled
  const canCancelOrder = (order: Order) => {
    return order.status === "PENDING" || order.status === "PROCESSING";
  };

  // Check if order can be reviewed
  const canReviewOrder = (order: Order) => {
    return order.status === "DELIVERED";
  };

  return (
    <div className="bg-gradient-to-br from-neutral-50 via-white to-neutral-50 dark:from-neutral-950 dark:via-gray-900 dark:to-neutral-950 min-h-screen py-12 md:py-16 lg:py-20">
      <Container>
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Luxury Header */}
          <motion.div
            ref={headerRef}
            initial={{ opacity: 0, y: 30 }}
            animate={
              isHeaderInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }
            }
            transition={{ duration: 0.8 }}
            className="mb-12 md:mb-16"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={
                isHeaderInView
                  ? { opacity: 1, scale: 1 }
                  : { opacity: 0, scale: 0.8 }
              }
              transition={{ duration: 0.6, delay: 0.2, type: "spring" }}
              className="inline-flex items-center gap-3 px-5 py-3 bg-gradient-to-br from-neutral-900 to-neutral-800 dark:from-neutral-100 dark:to-neutral-200 border-2 border-neutral-900 dark:border-neutral-100 rounded-sm mb-6"
            >
              <motion.div
                animate={{ rotate: [0, 10, -10, 0] }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              >
                <Package className="w-5 h-5 text-white dark:text-neutral-900" />
              </motion.div>
              <span className="text-xs font-light text-white dark:text-neutral-900 uppercase tracking-[0.2em]">
                Đơn hàng
              </span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={
                isHeaderInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }
              }
              transition={{ duration: 0.8, delay: 0.3 }}
              className="text-4xl md:text-5xl lg:text-6xl font-light text-neutral-900 dark:text-neutral-100 leading-[1.1] tracking-tight uppercase mb-6"
            >
              Đơn hàng của tôi
            </motion.h1>

            <motion.div
              initial={{ opacity: 0, width: 0 }}
              animate={
                isHeaderInView
                  ? { opacity: 1, width: "100%" }
                  : { opacity: 0, width: 0 }
              }
              transition={{ duration: 1, delay: 0.4 }}
              className="h-px bg-gradient-to-r from-neutral-900 via-neutral-400 to-transparent dark:from-neutral-100 dark:via-neutral-600 mb-4"
            />

            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={
                isHeaderInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 10 }
              }
              transition={{ duration: 0.8, delay: 0.5 }}
              className="text-sm md:text-base text-neutral-600 dark:text-neutral-400 font-light"
            >
              Xem và theo dõi đơn hàng của bạn
            </motion.p>

            {/* Refresh Button */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={
                isHeaderInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 10 }
              }
              transition={{ duration: 0.8, delay: 0.6 }}
              className="mt-4"
            >
              <Button
                onClick={() => fetchOrders(true)}
                disabled={loading}
                variant="outline"
                size="sm"
                className="rounded-sm border-2 border-neutral-200 dark:border-neutral-800 hover:border-neutral-900 dark:hover:border-neutral-100 px-4 py-2 text-xs font-light uppercase tracking-[0.15em] transition-all duration-300"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 mr-2 animate-spin" />
                    Đang tải...
                  </>
                ) : (
                  <>
                    <Package className="w-3.5 h-3.5 mr-2" />
                    Làm mới
                  </>
                )}
              </Button>
            </motion.div>
          </motion.div>

          {/* Search and Filter - Luxury Style */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="bg-white dark:bg-gray-900 rounded-sm p-4 md:p-6 mb-6 md:mb-8 border-2 border-neutral-200 dark:border-neutral-800 shadow-lg space-y-4"
          >
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-400 dark:text-neutral-600" />
                <Input
                  placeholder="Tìm kiếm đơn hàng..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-12 rounded-sm border-2 border-neutral-200 dark:border-neutral-800 focus:border-neutral-900 dark:focus:border-neutral-100 h-12 font-light bg-white dark:bg-gray-900 transition-all duration-300"
                />
              </div>
            </div>
            {/* Status Filter */}
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs font-light uppercase tracking-wide text-neutral-600 dark:text-neutral-400">
                Lọc theo trạng thái:
              </span>
              <Button
                variant={filterStatus === null ? "default" : "outline"}
                size="sm"
                onClick={() => setFilterStatus(null)}
                className={cn(
                  "rounded-sm h-8 px-4 text-xs font-light uppercase tracking-wide transition-all duration-300",
                  filterStatus === null
                    ? "bg-neutral-900 dark:bg-neutral-100 text-white dark:text-neutral-900 border-2 border-neutral-900 dark:border-neutral-100"
                    : "border-2 border-neutral-200 dark:border-neutral-800 hover:border-neutral-900 dark:hover:border-neutral-100"
                )}
              >
                Tất cả
              </Button>
              {[
                "PENDING",
                "PROCESSING",
                "SHIPPED",
                "DELIVERED",
                "CANCELLED",
              ].map((status) => {
                const statusInfo = getStatusInfo(status);
                const StatusIcon = statusInfo.icon;
                return (
                  <Button
                    key={status}
                    variant={filterStatus === status ? "default" : "outline"}
                    size="sm"
                    onClick={() =>
                      setFilterStatus(filterStatus === status ? null : status)
                    }
                    className={cn(
                      "rounded-sm h-8 px-4 text-xs font-light uppercase tracking-wide transition-all duration-300 flex items-center gap-1.5",
                      filterStatus === status
                        ? statusInfo.bgColor +
                            " " +
                            statusInfo.color +
                            " border-2 " +
                            statusInfo.borderColor
                        : "border-2 border-neutral-200 dark:border-neutral-800 hover:border-neutral-900 dark:hover:border-neutral-100"
                    )}
                  >
                    <StatusIcon className="w-3.5 h-3.5" />
                    {statusInfo.label}
                  </Button>
                );
              })}
            </div>
            {filteredOrders.length > 0 && (
              <div className="text-sm text-neutral-600 dark:text-neutral-400 font-light">
                Hiển thị {filteredOrders.length} / {orders.length} đơn hàng
              </div>
            )}
          </motion.div>

          {/* Orders List */}
          {loading ? (
            <SkeletonOrderList count={3} />
          ) : !isSignedIn ? (
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.7 }}
              className="bg-white dark:bg-gray-900 rounded-sm p-12 md:p-16 lg:p-20 text-center border-2 border-neutral-200 dark:border-neutral-800 shadow-xl"
            >
              <motion.h3
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.9 }}
                className="text-2xl md:text-3xl font-light text-neutral-900 dark:text-neutral-100 mb-4 uppercase tracking-tight"
              >
                Vui lòng đăng nhập
              </motion.h3>
              <motion.p
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 1.1 }}
                className="text-sm md:text-base text-neutral-600 dark:text-neutral-400 font-light mb-8 max-w-md mx-auto"
              >
                Bạn cần đăng nhập để xem đơn hàng của mình.
              </motion.p>
              <Button
                asChild
                className="inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-neutral-900 to-neutral-800 dark:from-neutral-100 dark:to-neutral-200 text-white dark:text-neutral-900 hover:from-neutral-800 hover:to-neutral-700 dark:hover:from-neutral-200 dark:hover:to-neutral-300 border-2 border-neutral-900 dark:border-neutral-100 rounded-sm text-sm font-light uppercase tracking-[0.15em] transition-all duration-300 hover:scale-105 hover:shadow-xl"
              >
                <Link href="/sign-in">Đăng nhập</Link>
              </Button>
            </motion.div>
          ) : filteredOrders.length === 0 ? (
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
                  transition={{
                    duration: 3,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
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
                  <Link href="/">
                    <ShoppingBag className="w-4 h-4" />
                    Mua sắm ngay
                    <ArrowRight className="w-4 h-4" />
                  </Link>
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
              {filteredOrders.map((order, index) => {
                const statusInfo = getStatusInfo(order.status);
                const StatusIcon = statusInfo.icon;
                const totalItems = order.orderItems.reduce(
                  (sum, item) => sum + item.quantity,
                  0
                );

                return (
                  <motion.div
                    key={order.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.8 + index * 0.1 }}
                    className="bg-white dark:bg-gray-900 rounded-sm border-2 border-neutral-200 dark:border-neutral-800 shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden group"
                  >
                    {/* Order Header */}
                    <div className="p-6 md:p-8 border-b border-neutral-200 dark:border-neutral-800 bg-gradient-to-r from-neutral-50 to-white dark:from-neutral-950 dark:to-gray-900">
                      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <h3 className="text-lg md:text-xl font-light text-neutral-900 dark:text-neutral-100 uppercase tracking-wide">
                              Đơn hàng #{order.orderNumber}
                            </h3>
                            <span
                              className={cn(
                                "inline-flex items-center gap-1.5 px-3 py-1 rounded-sm text-xs font-light uppercase tracking-wide border",
                                statusInfo.bgColor,
                                statusInfo.color,
                                statusInfo.borderColor
                              )}
                            >
                              <StatusIcon className="w-3.5 h-3.5" />
                              {statusInfo.label}
                            </span>
                          </div>
                          <div className="flex flex-wrap items-center gap-4 text-sm text-neutral-600 dark:text-neutral-400">
                            <div className="flex items-center gap-1.5">
                              <Calendar className="w-4 h-4" />
                              <span>{formatDate(order.createdAt)}</span>
                            </div>
                            <div className="flex items-center gap-1.5">
                              <Package className="w-4 h-4" />
                              <span>{totalItems} sản phẩm</span>
                            </div>
                            {order.trackingNumber && (
                              <div className="flex items-center gap-1.5">
                                <Truck className="w-4 h-4" />
                                <span>Mã vận đơn: {order.trackingNumber}</span>
                              </div>
                            )}
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-2xl md:text-3xl font-light text-neutral-900 dark:text-neutral-100 mb-1">
                            <Currency value={order.total} />
                          </div>
                          <div className="text-xs text-neutral-500 dark:text-neutral-500 uppercase tracking-wide">
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
                    </div>

                    {/* Order Items */}
                    <div className="p-6 md:p-8">
                      <div className="space-y-4">
                        {order.orderItems.map((item, itemIndex) => {
                          const imageUrl =
                            item.imageUrl ||
                            item.product?.images?.[0]?.url ||
                            "/placeholder.svg";

                          return (
                            <motion.div
                              key={item.id}
                              initial={{ opacity: 0, x: -20 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ delay: itemIndex * 0.05 }}
                              className="flex gap-4 pb-4 border-b border-neutral-100 dark:border-neutral-800 last:border-0 last:pb-0"
                            >
                              <Link
                                href={`/product/${item.product?.id || "#"}`}
                                className="relative w-20 h-20 md:w-24 md:h-24 shrink-0 bg-neutral-100 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 group/item overflow-hidden"
                              >
                                <Image
                                  src={imageUrl}
                                  alt={item.productName}
                                  fill
                                  sizes="(max-width: 768px) 80px, 96px"
                                  className="object-cover group-hover/item:scale-105 transition-transform duration-300"
                                />
                              </Link>
                              <div className="flex-1 min-w-0">
                                <Link
                                  href={`/product/${item.product?.id || "#"}`}
                                  className="block mb-1"
                                >
                                  <h4 className="text-sm md:text-base font-light text-neutral-900 dark:text-neutral-100 hover:text-neutral-600 dark:hover:text-neutral-400 transition-colors uppercase tracking-wide line-clamp-2">
                                    {item.productName}
                                  </h4>
                                </Link>
                                <div className="flex flex-wrap gap-2 mb-2">
                                  {item.sizeName && (
                                    <span className="text-xs text-neutral-500 dark:text-neutral-500 uppercase">
                                      Size: {item.sizeName}
                                    </span>
                                  )}
                                  {item.colorName && (
                                    <span className="text-xs text-neutral-500 dark:text-neutral-500 uppercase">
                                      Màu: {item.colorName}
                                    </span>
                                  )}
                                  {item.materialName && (
                                    <span className="text-xs text-neutral-500 dark:text-neutral-500 uppercase">
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
                                  <div className="text-base font-medium text-neutral-900 dark:text-neutral-100">
                                    <Currency
                                      value={(item.price || 0) * item.quantity}
                                    />
                                  </div>
                                </div>
                              </div>
                            </motion.div>
                          );
                        })}
                      </div>

                      {/* Order Footer */}
                      <div className="mt-6 pt-6 border-t border-neutral-200 dark:border-neutral-800">
                        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-4">
                          <div className="flex-1 space-y-1 text-sm text-neutral-600 dark:text-neutral-400">
                            {order.paymentMethod && (
                              <div>
                                <span className="uppercase tracking-wide">
                                  Phương thức thanh toán:{" "}
                                </span>
                                <span className="text-neutral-900 dark:text-neutral-100 font-medium">
                                  {order.paymentMethod}
                                </span>
                              </div>
                            )}
                            {order.shippingMethod && (
                              <div>
                                <span className="uppercase tracking-wide">
                                  Phương thức giao hàng:{" "}
                                </span>
                                <span className="text-neutral-900 dark:text-neutral-100 font-medium">
                                  {order.shippingMethod}
                                </span>
                              </div>
                            )}
                          </div>
                          <Link
                            href={`/account/orders/${order.id}`}
                            className="inline-flex items-center justify-center gap-2 rounded-sm border-2 border-neutral-200 dark:border-neutral-800 hover:border-neutral-900 dark:hover:border-neutral-100 px-6 py-2.5 font-light uppercase tracking-[0.15em] transition-all duration-300 group/btn text-neutral-900 dark:text-neutral-100 hover:bg-neutral-50 dark:hover:bg-neutral-900"
                          >
                            <Eye className="w-4 h-4 transition-transform duration-300 group-hover/btn:translate-x-1" />
                            Xem chi tiết
                          </Link>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex flex-wrap items-center gap-3">
                          {/* Cancel Order Button */}
                          {canCancelOrder(order) && (
                            <Button
                              variant="outline"
                              onClick={() => handleCancelOrder(order.id)}
                              disabled={cancellingOrderId === order.id}
                              className="rounded-sm border-2 border-red-200 dark:border-red-800 hover:border-red-600 dark:hover:border-red-400 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/20 px-4 py-2 text-xs font-light uppercase tracking-[0.15em] transition-all duration-300 disabled:opacity-50"
                            >
                              {cancellingOrderId === order.id ? (
                                <>
                                  <Loader2 className="w-3.5 h-3.5 mr-2 animate-spin" />
                                  Đang hủy...
                                </>
                              ) : (
                                <>
                                  <X className="w-3.5 h-3.5 mr-2" />
                                  Hủy đơn hàng
                                </>
                              )}
                            </Button>
                          )}

                          {/* Track Order Button */}
                          {order.trackingNumber &&
                            order.status !== "DELIVERED" &&
                            order.status !== "CANCELLED" && (
                              <Button
                                variant="outline"
                                asChild
                                className="rounded-sm border-2 border-blue-200 dark:border-blue-800 hover:border-blue-600 dark:hover:border-blue-400 text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-950/20 px-4 py-2 text-xs font-light uppercase tracking-[0.15em] transition-all duration-300"
                              >
                                <Link
                                  href={`/account/orders/${order.id}#tracking`}
                                  className="flex items-center gap-2"
                                >
                                  <Truck className="w-3.5 h-3.5" />
                                  Theo dõi đơn hàng
                                </Link>
                              </Button>
                            )}

                          {/* Review Products Button */}
                          {canReviewOrder(order) && (
                            <Button
                              variant="outline"
                              asChild
                              className="rounded-sm border-2 border-green-200 dark:border-green-800 hover:border-green-600 dark:hover:border-green-400 text-green-600 dark:text-green-400 hover:bg-green-50 dark:hover:bg-green-950/20 px-4 py-2 text-xs font-light uppercase tracking-[0.15em] transition-all duration-300"
                            >
                              <Link
                                href={`/account/orders/${order.id}#review`}
                                className="flex items-center gap-2"
                              >
                                <Star className="w-3.5 h-3.5" />
                                Đánh giá sản phẩm
                              </Link>
                            </Button>
                          )}
                        </div>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </motion.div>
          )}
        </div>
      </Container>
    </div>
  );
}
