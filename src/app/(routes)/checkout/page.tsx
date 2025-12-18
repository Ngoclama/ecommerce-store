"use client";

import { useState, useEffect, useRef, useMemo } from "react";
import Container from "@/components/ui/container";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Separator } from "@/components/ui/separator";
import Link from "next/link";
import useCart from "@/hooks/use-cart";
import useAuth from "@/hooks/use-auth";
import {
  MapPin,
  Truck,
  CreditCard,
  Lock,
  Loader2,
  Plus,
  Minus,
  Trash2,
  Wallet,
  QrCode,
  Smartphone,
  Building2,
  ArrowLeft,
  CheckCircle2,
  ShoppingBag,
} from "lucide-react";
import Currency from "@/components/ui/currency";
import { toast } from "sonner";
import { useRouter, useSearchParams } from "next/navigation";
import { cn } from "@/lib/utils";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { vietnamProvinces } from "@/lib/vietnam-address";
import {
  calculateShippingWithDetails,
  type ShippingCalculation,
} from "@/lib/shipping-calculator";

type PaymentMethod = "cod" | "momo" | "vnpay" | "qr" | "stripe" | null;

export default function CheckoutPage() {
  const cart = useCart();
  const router = useRouter();
  const searchParams = useSearchParams();
  const { requireAuth, user } = useAuth();
  const [step, setStep] = useState(1);
  const [shippingMethod, setShippingMethod] = useState("standard");
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>(null);
  const [loading, setLoading] = useState(false);

  // Get email from Clerk user
  const userEmail = user?.emailAddresses?.[0]?.emailAddress || "";

  const [shippingAddress, setShippingAddress] = useState({
    fullName: "",
    phone: "",
    email: userEmail, // Auto-fill from Clerk
    address: "",
    province: "",
    district: "",
    ward: "",
  });

  // Update email when user changes
  useEffect(() => {
    if (userEmail) {
      setShippingAddress((prev) => ({
        ...prev,
        email: userEmail,
      }));
    }
  }, [userEmail]);

  // State for cascading address selection
  const [selectedProvinceCode, setSelectedProvinceCode] = useState("");
  const [selectedDistrictCode, setSelectedDistrictCode] = useState("");
  const [selectedWardCode, setSelectedWardCode] = useState("");
  const [availableDistricts, setAvailableDistricts] = useState<any[]>([]);
  const [availableWards, setAvailableWards] = useState<any[]>([]);

  const [errors, setErrors] = useState<Record<string, string>>({});

  const [appliedCoupon, setAppliedCoupon] = useState<{
    code: string;
    value: number;
    type: "PERCENT" | "FIXED";
  } | null>(null);

  const [customerNote, setCustomerNote] = useState("");
  const hasProcessedPayment = useRef(false);

  // Handle province change
  const handleProvinceChange = (provinceCode: string) => {
    setSelectedProvinceCode(provinceCode);
    const province = vietnamProvinces.find(
      (p) => String(p.code) === provinceCode
    );
    if (province) {
      setShippingAddress({
        ...shippingAddress,
        province: province.name,
        district: "",
        ward: "",
      });
      setAvailableDistricts(province.districts);
      setAvailableWards([]);
      setSelectedDistrictCode("");
      setSelectedWardCode("");
    }
  };

  // Handle district change
  const handleDistrictChange = (districtCode: string) => {
    setSelectedDistrictCode(districtCode);
    const district = availableDistricts.find(
      (d) => String(d.code) === districtCode
    );
    if (district) {
      setShippingAddress({
        ...shippingAddress,
        district: district.name,
        ward: "",
      });
      setAvailableWards(district.wards);
      setSelectedWardCode("");
    }
  };

  // Handle ward change
  const handleWardChange = (wardCode: string) => {
    setSelectedWardCode(wardCode);
    const ward = availableWards.find((w) => String(w.code) === wardCode);
    if (ward) {
      setShippingAddress({
        ...shippingAddress,
        ward: ward.name,
      });
    }
  };

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

  const subtotal = cart.items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  const discount = appliedCoupon
    ? appliedCoupon.type === "PERCENT"
      ? (subtotal * appliedCoupon.value) / 100
      : appliedCoupon.value
    : 0;

  // ━━━ TÍNH PHÍ SHIP THEO ĐỊA CHỈ ━━━
  const shippingCalculation: ShippingCalculation | null = useMemo(() => {
    // Chỉ tính khi đã chọn tỉnh
    if (!selectedProvinceCode) {
      return null;
    }

    return calculateShippingWithDetails(
      selectedProvinceCode,
      shippingMethod as "standard" | "express",
      subtotal
    );
  }, [selectedProvinceCode, shippingMethod, subtotal]);

  const shippingFee = shippingCalculation?.actualFee || 0;

  // Total = subtotal - discount + shipping
  const finalTotal = subtotal - discount + shippingFee;

  // Lấy giá trị từ searchParams
  const paymentSuccess = searchParams?.get("success") || null;
  const paymentCanceled = searchParams?.get("canceled") || null;
  const momoPayment = searchParams?.get("momo") || null;

  // Handle success/cancel from payment
  useEffect(() => {
    // Chỉ xử lý một lần để tránh vòng lặp vô hạn
    if (hasProcessedPayment.current) {
      return;
    }

    if (paymentSuccess) {
      hasProcessedPayment.current = true;
      const orderId = searchParams?.get("orderId") || "";
      const method = searchParams?.get("method") || "stripe";
      setTimeout(() => {
        cart.removeAll();
        router.push(`/payment/success?orderId=${orderId}&method=${method}`);
      }, 0);
      return;
    }

    // Handle MoMo payment callback
    if (momoPayment === "success") {
      hasProcessedPayment.current = true;
      const orderId = searchParams?.get("orderId") || "";
      setTimeout(() => {
        cart.removeAll();
        router.push(`/payment/success?orderId=${orderId}&method=momo`);
      }, 0);
      return;
    }

    if (paymentCanceled) {
      hasProcessedPayment.current = true;
      const orderId = searchParams?.get("orderId");
      const method = searchParams?.get("method") || "stripe";

      // Redirect to payment failure page
      if (orderId) {
        router.push(
          `/payment/failure?orderId=${orderId}&method=${method}&reason=cancelled`
        );
      } else {
        router.push(`/payment/failure?method=${method}&reason=cancelled`);
      }
    }
  }, [paymentSuccess, paymentCanceled, momoPayment, cart, router]);

  // Validate shipping address
  const validateShippingAddress = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!shippingAddress.fullName.trim()) {
      newErrors.fullName = "Vui lòng nhập họ và tên";
    }

    if (!shippingAddress.phone.trim()) {
      newErrors.phone = "Vui lòng nhập số điện thoại";
    } else if (
      !/^[0-9]{10,11}$/.test(shippingAddress.phone.replace(/\s/g, ""))
    ) {
      newErrors.phone = "Số điện thoại không hợp lệ (10-11 số)";
    }

    if (!shippingAddress.address.trim()) {
      newErrors.address = "Vui lòng nhập địa chỉ";
    }

    if (!shippingAddress.province.trim()) {
      newErrors.province = "Vui lòng nhập tỉnh/thành phố";
    }

    if (!shippingAddress.district.trim()) {
      newErrors.district = "Vui lòng nhập quận/huyện";
    }

    if (!shippingAddress.ward.trim()) {
      newErrors.ward = "Vui lòng nhập phường/xã";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleContinueToStep2 = () => {
    if (validateShippingAddress()) {
      setStep(2);
      // Scroll về đầu trang
      window.scrollTo({ top: 0, behavior: "smooth" });
    } else {
      toast.error("Vui lòng điền đầy đủ thông tin địa chỉ giao hàng");
    }
  };

  const handleContinueToStep3 = () => {
    if (!paymentMethod) {
      toast.error("Vui lòng chọn phương thức thanh toán");
      return;
    }
    setStep(3);
    // Scroll về đầu trang
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleCheckout = async () => {
    if (cart.items.length === 0) {
      toast.error("Giỏ hàng trống");
      return;
    }

    if (!requireAuth("thanh toán")) {
      return;
    }

    if (!validateShippingAddress()) {
      toast.error("Vui lòng kiểm tra lại thông tin địa chỉ giao hàng");
      setStep(1);
      return;
    }

    if (!paymentMethod) {
      toast.error("Vui lòng chọn phương thức thanh toán");
      setStep(2);
      return;
    }

    if (!shippingCalculation) {
      toast.error("Vui lòng chọn tỉnh/thành để tính phí vận chuyển");
      setStep(1);
      return;
    }

    // Scroll về đầu trang trước khi thanh toán
    window.scrollTo({ top: 0, behavior: "smooth" });

    setLoading(true);

    try {
      if (paymentMethod === "cod") {
        const apiUrl = process.env.NEXT_PUBLIC_API_URL;
        if (!apiUrl) {
          console.error("[CHECKOUT] NEXT_PUBLIC_API_URL is not configured");
          toast.error("Cấu hình API không hợp lệ. Vui lòng liên hệ hỗ trợ.");
          setLoading(false);
          return;
        }

        // Normalize API URL (remove trailing slash, ensure proper format)
        const normalizedApiUrl = apiUrl.replace(/\/$/, "");
        const checkoutUrl = `${normalizedApiUrl}/api/checkout`;

        console.log("[CHECKOUT] Calling API:", checkoutUrl);

        const response = await axios.post<{
          success?: boolean;
          message?: string;
          orderId?: string;
        }>(
          checkoutUrl,
          {
            items: cart.items.map((item) => ({
              productId: item.id,
              quantity: item.quantity,
              sizeId: item.size?.id,
              colorId: item.color?.id,
              materialId: item.material?.id,
            })),
            shippingAddress: {
              fullName: shippingAddress.fullName,
              phone: shippingAddress.phone,
              email: userEmail || shippingAddress.email || undefined, // Prioritize Clerk email
              address: shippingAddress.address,
              province: shippingAddress.province,
              district: shippingAddress.district,
              ward: shippingAddress.ward,
            },
            shippingMethod: shippingMethod,
            shippingCost: shippingFee,
            shippingDetails: shippingCalculation,
            paymentMethod: "COD",
            coupon: appliedCoupon
              ? {
                  code: appliedCoupon.code,
                  value: appliedCoupon.value,
                  type: appliedCoupon.type,
                }
              : null,
            customerNote: customerNote.trim() || null,
          },
          {
            withCredentials: true,
            timeout: 30000, // 30 seconds timeout
            headers: {
              "Content-Type": "application/json",
            },
          }
        );

        if (response.data.success) {
          cart.removeAll();
          router.push(
            `/payment/success?orderId=${response.data.orderId || ""}&method=cod`
          );
        } else {
          toast.error(response.data.message || "Có lỗi xảy ra khi đặt hàng");
        }
        return;
      }

      if (paymentMethod === "stripe") {
        const apiUrl = process.env.NEXT_PUBLIC_API_URL;
        if (!apiUrl) {
          console.error("[CHECKOUT] NEXT_PUBLIC_API_URL is not configured");
          toast.error("Cấu hình API không hợp lệ. Vui lòng liên hệ hỗ trợ.");
          setLoading(false);
          return;
        }

        // Normalize API URL (remove trailing slash, ensure proper format)
        const normalizedApiUrl = apiUrl.replace(/\/$/, "");
        const checkoutUrl = `${normalizedApiUrl}/api/checkout`;

        console.log("[CHECKOUT] Calling API:", checkoutUrl);

        const response = await axios.post<{
          url?: string;
          success?: boolean;
          message?: string;
          orderId?: string;
        }>(
          checkoutUrl,
          {
            items: cart.items.map((item) => ({
              productId: item.id,
              quantity: item.quantity,
              sizeId: item.size?.id,
              colorId: item.color?.id,
              materialId: item.material?.id,
            })),
            shippingAddress: {
              fullName: shippingAddress.fullName,
              phone: shippingAddress.phone,
              email: userEmail || shippingAddress.email || undefined, // Prioritize Clerk email
              address: shippingAddress.address,
              province: shippingAddress.province,
              district: shippingAddress.district,
              ward: shippingAddress.ward,
            },
            shippingMethod: shippingMethod,
            shippingCost: shippingFee,
            shippingDetails: shippingCalculation,
            paymentMethod: "STRIPE",
            coupon: appliedCoupon
              ? {
                  code: appliedCoupon.code,
                  value: appliedCoupon.value,
                  type: appliedCoupon.type,
                }
              : null,
            customerNote: customerNote.trim() || null,
          },
          {
            withCredentials: true,
            timeout: 30000, // 30 seconds timeout
            headers: {
              "Content-Type": "application/json",
            },
          }
        );

        if (response.data?.url) {
          window.location.href = response.data.url;
        } else if (response.data?.success) {
          // Đơn hàng miễn phí hoàn toàn (total = 0)
          const orderId = response.data.orderId || "";
          cart.removeAll();
          router.push(`/payment/success?orderId=${orderId}&method=stripe`);
        } else {
          toast.error(
            response.data?.message ||
              "Không thể tạo phiên thanh toán. Vui lòng thử lại."
          );
          setLoading(false);
        }
        return;
      }

      if (paymentMethod === "momo") {
        const apiUrl = process.env.NEXT_PUBLIC_API_URL;
        if (!apiUrl) {
          console.error("[CHECKOUT] NEXT_PUBLIC_API_URL is not configured");
          toast.error("Cấu hình API không hợp lệ. Vui lòng liên hệ hỗ trợ.");
          setLoading(false);
          return;
        }

        // Normalize API URL (remove trailing slash, ensure proper format)
        const normalizedApiUrl = apiUrl.replace(/\/$/, "");
        const checkoutUrl = `${normalizedApiUrl}/api/checkout`;

        console.log("[CHECKOUT] Calling API:", checkoutUrl);

        const response = await axios.post<{
          success?: boolean;
          payUrl?: string;
          deeplink?: string;
          qrCodeUrl?: string;
          message?: string;
          orderId?: string;
        }>(
          checkoutUrl,
          {
            items: cart.items.map((item) => ({
              productId: item.id,
              quantity: item.quantity,
              sizeId: item.size?.id,
              colorId: item.color?.id,
              materialId: item.material?.id,
            })),
            shippingAddress: {
              fullName: shippingAddress.fullName,
              phone: shippingAddress.phone,
              email: userEmail || shippingAddress.email || undefined, // Prioritize Clerk email
              address: shippingAddress.address,
              province: shippingAddress.province,
              district: shippingAddress.district,
              ward: shippingAddress.ward,
            },
            shippingMethod: shippingMethod,
            shippingCost: shippingFee,
            shippingDetails: shippingCalculation,
            paymentMethod: "MOMO",
            coupon: appliedCoupon
              ? {
                  code: appliedCoupon.code,
                  value: appliedCoupon.value,
                  type: appliedCoupon.type,
                }
              : null,
            customerNote: customerNote.trim() || null,
          },
          {
            withCredentials: true,
            timeout: 30000, // 30 seconds timeout
            headers: {
              "Content-Type": "application/json",
            },
          }
        );

        if (response.data?.payUrl) {
          // Redirect to MoMo payment page
          window.location.href = response.data.payUrl;
        } else if (response.data?.success) {
          // Đơn hàng miễn phí hoàn toàn (total = 0)
          const orderId = response.data.orderId || "";
          cart.removeAll();
          router.push(`/payment/success?orderId=${orderId}&method=momo`);
        } else {
          toast.error(
            response.data?.message ||
              "Không thể tạo thanh toán MoMo. Vui lòng thử lại."
          );
          setLoading(false);
        }
        return;
      }

      if (paymentMethod === "vnpay") {
        const apiUrl = process.env.NEXT_PUBLIC_API_URL;
        if (!apiUrl) {
          console.error("[CHECKOUT] NEXT_PUBLIC_API_URL is not configured");
          toast.error("Cấu hình API không hợp lệ. Vui lòng liên hệ hỗ trợ.");
          setLoading(false);
          return;
        }

        const normalizedApiUrl = apiUrl.replace(/\/$/, "");
        const checkoutUrl = `${normalizedApiUrl}/api/checkout`;

        console.log("[CHECKOUT] Calling VNPay API:", checkoutUrl);

        const response = await axios.post<{
          success?: boolean;
          paymentUrl?: string;
          orderId?: string;
          message?: string;
        }>(
          checkoutUrl,
          {
            items: cart.items.map((item) => ({
              productId: item.id,
              quantity: item.quantity,
              sizeId: item.size?.id,
              colorId: item.color?.id,
              materialId: item.material?.id,
            })),
            shippingAddress: {
              fullName: shippingAddress.fullName,
              phone: shippingAddress.phone,
              email: userEmail || shippingAddress.email || undefined, // Prioritize Clerk email
              address: shippingAddress.address,
              province: shippingAddress.province,
              district: shippingAddress.district,
              ward: shippingAddress.ward,
            },
            shippingMethod: shippingMethod,
            shippingCost: shippingFee,
            shippingDetails: shippingCalculation,
            paymentMethod: "VNPAY",
            coupon: appliedCoupon
              ? {
                  code: appliedCoupon.code,
                  value: appliedCoupon.value,
                  type: appliedCoupon.type,
                }
              : null,
            customerNote: customerNote.trim() || null,
          },
          {
            withCredentials: true,
            timeout: 30000,
            headers: {
              "Content-Type": "application/json",
            },
          }
        );

        if (response.data?.paymentUrl) {
          window.location.href = response.data.paymentUrl;
        } else if (response.data?.success) {
          const orderId = response.data.orderId || "";
          cart.removeAll();
          router.push(`/payment/success?orderId=${orderId}&method=vnpay`);
        } else {
          toast.error(
            response.data?.message ||
              "Không thể tạo thanh toán VNPay. Vui lòng thử lại."
          );
          setLoading(false);
        }
        return;
      }

      if (paymentMethod === "qr") {
        toast.info(
          "Tính năng thanh toán này đang được phát triển. Vui lòng chọn phương thức khác."
        );
        setLoading(false);
        return;
      }
    } catch (error: any) {
      console.error("[CHECKOUT_ERROR]", error);
      let errorMessage =
        "Có lỗi xảy ra khi thanh toán. Vui lòng kiểm tra lại tồn kho và trạng thái sản phẩm.";

      // Network errors
      if (error.code === "ECONNABORTED" || error.message?.includes("timeout")) {
        errorMessage =
          "Kết nối quá lâu. Vui lòng kiểm tra kết nối mạng và thử lại.";
      } else if (
        error.code === "ERR_NETWORK" ||
        error.message?.includes("Network Error") ||
        error.message?.includes("Failed to fetch")
      ) {
        const apiUrl = process.env.NEXT_PUBLIC_API_URL;
        errorMessage = `Lỗi kết nối mạng. Vui lòng kiểm tra:\n- Kết nối internet của bạn\n- API URL: ${
          apiUrl || "Chưa được cấu hình"
        }\n- CORS settings trên server`;

        // Log detailed error for debugging
        console.error("[CHECKOUT_NETWORK_ERROR]", {
          apiUrl,
          errorCode: error.code,
          errorMessage: error.message,
          stack: error.stack,
        });
      } else if (error.response) {
        // Server responded with error status
        if (error.response.status === 0) {
          errorMessage =
            "Không thể kết nối đến server. Vui lòng kiểm tra NEXT_PUBLIC_API_URL.";
        } else if (error.response.status >= 500) {
          errorMessage =
            "Lỗi server. Vui lòng thử lại sau hoặc liên hệ hỗ trợ.";
        } else if (error.response.data) {
          if (typeof error.response.data === "string") {
            errorMessage = error.response.data;
          } else if (error.response.data.message) {
            errorMessage = error.response.data.message;
          }
        } else {
          errorMessage = `Lỗi ${error.response.status}: ${
            error.response.statusText || "Unknown error"
          }`;
        }
      } else if (error.message) {
        errorMessage = error.message;
      }

      toast.error(errorMessage, {
        duration: 5000,
      });
    } finally {
      setLoading(false);
    }
  };

  if (cart.items.length === 0) {
    return (
      <div className="bg-linear-to-br from-neutral-50 via-white to-neutral-50 dark:from-neutral-950 dark:via-gray-900 dark:to-neutral-950 min-h-screen py-12 md:py-16 lg:py-20">
        <Container>
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="max-w-4xl mx-auto text-center py-20 md:py-32"
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.2, type: "spring" }}
              className="inline-flex items-center justify-center w-24 h-24 rounded-sm bg-linear-to-br from-neutral-900 to-neutral-800 dark:from-neutral-100 dark:to-neutral-200 border-2 border-neutral-900 dark:border-neutral-100 mb-8"
            >
              <ShoppingBag className="w-12 h-12 text-white dark:text-neutral-900" />
            </motion.div>
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="text-3xl md:text-4xl lg:text-5xl font-light text-neutral-900 dark:text-neutral-100 uppercase tracking-tight mb-4"
            >
              Giỏ hàng trống
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="text-sm md:text-base text-neutral-600 dark:text-neutral-400 font-light mb-8"
            >
              Vui lòng thêm sản phẩm vào giỏ hàng để tiếp tục
            </motion.p>
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.5 }}
            >
              <Button
                asChild
                className="inline-flex items-center gap-3 px-8 py-4 bg-linear-to-r from-neutral-900 to-neutral-800 dark:from-neutral-100 dark:to-neutral-200 text-white dark:text-neutral-900 hover:from-neutral-800 hover:to-neutral-700 dark:hover:from-neutral-200 dark:hover:to-neutral-300 border-2 border-neutral-900 dark:border-neutral-100 rounded-sm text-sm font-light uppercase tracking-[0.15em] transition-all duration-300 hover:scale-105 hover:shadow-xl"
              >
                <Link href="/">Tiếp tục mua sắm</Link>
              </Button>
            </motion.div>
          </motion.div>
        </Container>
      </div>
    );
  }

  return (
    <div className="bg-linear-to-br from-neutral-50 via-white to-neutral-50 dark:from-neutral-950 dark:via-gray-900 dark:to-neutral-950 min-h-screen py-12 md:py-16 lg:py-20">
      <Container>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Luxury Progress Steps */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="mb-12 md:mb-16"
          >
            <div className="flex items-center justify-center gap-6 md:gap-8">
              {[1, 2, 3].map((stepNum) => (
                <motion.div
                  key={stepNum}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5, delay: stepNum * 0.1 }}
                  className="flex items-center gap-6 md:gap-8"
                >
                  <motion.div
                    whileHover={{ scale: 1.1 }}
                    className={cn(
                      "w-12 h-12 md:w-14 md:h-14 rounded-sm flex items-center justify-center border-2 transition-all duration-300 font-light text-sm md:text-base",
                      step >= stepNum
                        ? "bg-linear-to-br from-neutral-900 to-neutral-800 dark:from-neutral-100 dark:to-neutral-200 text-white dark:text-neutral-900 border-neutral-900 dark:border-neutral-100 shadow-lg"
                        : "bg-white dark:bg-gray-900 text-neutral-400 dark:text-neutral-600 border-neutral-300 dark:border-neutral-700"
                    )}
                  >
                    {step > stepNum ? (
                      <CheckCircle2 className="w-6 h-6 md:w-7 md:h-7" />
                    ) : (
                      stepNum
                    )}
                  </motion.div>
                  {stepNum < 3 && (
                    <motion.div
                      initial={{ scaleX: 0 }}
                      animate={{ scaleX: 1 }}
                      transition={{ duration: 0.5, delay: stepNum * 0.1 + 0.2 }}
                      className={cn(
                        "w-16 md:w-24 h-0.5 transition-all duration-300",
                        step > stepNum
                          ? "bg-linear-to-r from-neutral-900 to-neutral-800 dark:from-neutral-100 dark:to-neutral-200"
                          : "bg-neutral-300 dark:bg-neutral-700"
                      )}
                    />
                  )}
                </motion.div>
              ))}
            </div>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.5 }}
              className="flex items-center justify-center gap-12 md:gap-20 mt-6"
            >
              <p className="text-xs md:text-sm font-light text-neutral-600 dark:text-neutral-400 uppercase tracking-[0.15em]">
                Địa chỉ
              </p>
              <p className="text-xs md:text-sm font-light text-neutral-600 dark:text-neutral-400 uppercase tracking-[0.15em]">
                Thanh toán
              </p>
              <p className="text-xs md:text-sm font-light text-neutral-600 dark:text-neutral-400 uppercase tracking-[0.15em]">
                Xác nhận
              </p>
            </motion.div>
          </motion.div>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-6">
              {/* Step 1: Shipping Address */}
              <AnimatePresence mode="wait">
                {step === 1 && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.5 }}
                    className="bg-white dark:bg-gray-900 p-6 md:p-8 lg:p-10 border-2 border-neutral-200 dark:border-neutral-800 rounded-sm shadow-xl"
                  >
                    <div className="flex items-center gap-4 mb-8 pb-6 border-b-2 border-neutral-200 dark:border-neutral-800">
                      <motion.div
                        whileHover={{ rotate: 5 }}
                        className="p-3 rounded-sm bg-linear-to-br from-neutral-900 to-neutral-800 dark:from-neutral-100 dark:to-neutral-200 border-2 border-neutral-900 dark:border-neutral-100"
                      >
                        <MapPin className="w-6 h-6 md:w-7 md:h-7 text-white dark:text-neutral-900" />
                      </motion.div>
                      <div>
                        <h2 className="text-2xl md:text-3xl font-light text-neutral-900 dark:text-neutral-100 uppercase tracking-tight">
                          Địa chỉ giao hàng
                        </h2>
                        <p className="text-xs md:text-sm text-neutral-600 dark:text-neutral-400 font-light mt-2">
                          Vui lòng điền đầy đủ thông tin để nhận hàng
                        </p>
                      </div>
                    </div>

                    <form
                      onSubmit={(e) => {
                        e.preventDefault();
                        handleContinueToStep2();
                      }}
                      className="space-y-5"
                    >
                      <div className="grid md:grid-cols-2 gap-5">
                        <div className="space-y-2">
                          <Label
                            htmlFor="fullName"
                            className="text-xs font-light uppercase tracking-wide"
                          >
                            Họ và tên <span className="text-red-500">*</span>
                          </Label>
                          <Input
                            id="fullName"
                            placeholder="Nguyễn Văn A"
                            value={shippingAddress.fullName}
                            onChange={(e) => {
                              setShippingAddress({
                                ...shippingAddress,
                                fullName: e.target.value,
                              });
                              if (errors.fullName) {
                                setErrors({ ...errors, fullName: "" });
                              }
                            }}
                            className={cn(
                              "rounded-sm border-2 border-neutral-200 dark:border-neutral-800 focus:border-neutral-900 dark:focus:border-neutral-100 h-12 font-light bg-white dark:bg-gray-900 transition-all duration-300",
                              errors.fullName &&
                                "border-red-500 dark:border-red-500"
                            )}
                          />
                          {errors.fullName && (
                            <p className="text-xs text-red-500 font-light">
                              {errors.fullName}
                            </p>
                          )}
                        </div>
                        <div className="space-y-2">
                          <Label
                            htmlFor="phone"
                            className="text-xs font-light uppercase tracking-wide"
                          >
                            Số điện thoại{" "}
                            <span className="text-red-500">*</span>
                          </Label>
                          <Input
                            id="phone"
                            placeholder="0901234567"
                            value={shippingAddress.phone}
                            onChange={(e) => {
                              setShippingAddress({
                                ...shippingAddress,
                                phone: e.target.value,
                              });
                              if (errors.phone) {
                                setErrors({ ...errors, phone: "" });
                              }
                            }}
                            className={cn(
                              "rounded-sm border-2 border-neutral-200 dark:border-neutral-800 focus:border-neutral-900 dark:focus:border-neutral-100 h-12 font-light bg-white dark:bg-gray-900 transition-all duration-300",
                              errors.phone &&
                                "border-red-500 dark:border-red-500"
                            )}
                          />
                          {errors.phone && (
                            <p className="text-xs text-red-500 font-light">
                              {errors.phone}
                            </p>
                          )}
                        </div>
                        {/* Email is automatically taken from Clerk user account - Hidden from UI */}
                      </div>
                      <div className="space-y-2">
                        <Label
                          htmlFor="address"
                          className="text-xs font-light uppercase tracking-wide"
                        >
                          Địa chỉ <span className="text-red-500">*</span>
                        </Label>
                        <Input
                          id="address"
                          placeholder="Số nhà, tên đường"
                          value={shippingAddress.address}
                          onChange={(e) => {
                            setShippingAddress({
                              ...shippingAddress,
                              address: e.target.value,
                            });
                            if (errors.address) {
                              setErrors({ ...errors, address: "" });
                            }
                          }}
                          className={cn(
                            "rounded-sm border-2 border-neutral-200 dark:border-neutral-800 focus:border-neutral-900 dark:focus:border-neutral-100 h-12 font-light bg-white dark:bg-gray-900 transition-all duration-300",
                            errors.address &&
                              "border-red-500 dark:border-red-500"
                          )}
                        />
                        {errors.address && (
                          <p className="text-xs text-red-500 font-light">
                            {errors.address}
                          </p>
                        )}
                      </div>
                      <div className="grid md:grid-cols-3 gap-5">
                        {/* Tỉnh/Thành phố */}
                        <div className="space-y-2">
                          <Label
                            htmlFor="province"
                            className="text-xs font-light uppercase tracking-wide"
                          >
                            Tỉnh/Thành phố{" "}
                            <span className="text-red-500">*</span>
                          </Label>
                          <Select
                            value={selectedProvinceCode}
                            onValueChange={(value) => {
                              handleProvinceChange(value);
                              if (errors.province) {
                                setErrors({ ...errors, province: "" });
                              }
                            }}
                          >
                            <SelectTrigger
                              className={cn(
                                "rounded-sm border-2 border-neutral-200 dark:border-neutral-800 focus:border-neutral-900 dark:focus:border-neutral-100 h-12 font-light bg-white dark:bg-gray-900 transition-all duration-300",
                                errors.province &&
                                  "border-red-500 dark:border-red-500"
                              )}
                            >
                              <SelectValue placeholder="Chọn tỉnh/thành phố" />
                            </SelectTrigger>
                            <SelectContent className="max-h-[300px]">
                              {vietnamProvinces.map((province) => (
                                <SelectItem
                                  key={province.code}
                                  value={String(province.code)}
                                  className="font-light"
                                >
                                  {province.name}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          {errors.province && (
                            <p className="text-xs text-red-500 font-light">
                              {errors.province}
                            </p>
                          )}
                        </div>

                        {/* Quận/Huyện */}
                        <div className="space-y-2">
                          <Label
                            htmlFor="district"
                            className="text-xs font-light uppercase tracking-wide"
                          >
                            Quận/Huyện <span className="text-red-500">*</span>
                          </Label>
                          <Select
                            value={selectedDistrictCode}
                            onValueChange={(value) => {
                              handleDistrictChange(value);
                              if (errors.district) {
                                setErrors({ ...errors, district: "" });
                              }
                            }}
                            disabled={!selectedProvinceCode}
                          >
                            <SelectTrigger
                              className={cn(
                                "rounded-sm border-2 border-neutral-200 dark:border-neutral-800 focus:border-neutral-900 dark:focus:border-neutral-100 h-12 font-light bg-white dark:bg-gray-900 transition-all duration-300",
                                errors.district &&
                                  "border-red-500 dark:border-red-500",
                                !selectedProvinceCode &&
                                  "opacity-50 cursor-not-allowed"
                              )}
                            >
                              <SelectValue placeholder="Chọn quận/huyện" />
                            </SelectTrigger>
                            <SelectContent className="max-h-[300px]">
                              {availableDistricts.map((district) => (
                                <SelectItem
                                  key={district.code}
                                  value={String(district.code)}
                                  className="font-light"
                                >
                                  {district.name}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          {errors.district && (
                            <p className="text-xs text-red-500 font-light">
                              {errors.district}
                            </p>
                          )}
                        </div>

                        {/* Phường/Xã */}
                        <div className="space-y-2">
                          <Label
                            htmlFor="ward"
                            className="text-xs font-light uppercase tracking-wide"
                          >
                            Phường/Xã <span className="text-red-500">*</span>
                          </Label>
                          <Select
                            value={selectedWardCode}
                            onValueChange={(value) => {
                              handleWardChange(value);
                              if (errors.ward) {
                                setErrors({ ...errors, ward: "" });
                              }
                            }}
                            disabled={!selectedDistrictCode}
                          >
                            <SelectTrigger
                              className={cn(
                                "rounded-sm border-2 border-neutral-200 dark:border-neutral-800 focus:border-neutral-900 dark:focus:border-neutral-100 h-12 font-light bg-white dark:bg-gray-900 transition-all duration-300",
                                errors.ward &&
                                  "border-red-500 dark:border-red-500",
                                !selectedDistrictCode &&
                                  "opacity-50 cursor-not-allowed"
                              )}
                            >
                              <SelectValue placeholder="Chọn phường/xã" />
                            </SelectTrigger>
                            <SelectContent className="max-h-[300px]">
                              {availableWards.map((ward) => (
                                <SelectItem
                                  key={ward.code}
                                  value={String(ward.code)}
                                  className="font-light"
                                >
                                  {ward.name}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          {errors.ward && (
                            <p className="text-xs text-red-500 font-light">
                              {errors.ward}
                            </p>
                          )}
                        </div>
                      </div>
                      <motion.div
                        whileHover={{ scale: 1.01 }}
                        whileTap={{ scale: 0.99 }}
                      >
                        <Button
                          type="submit"
                          variant="default"
                          className="w-full rounded-sm text-sm font-light uppercase tracking-[0.15em] bg-linear-to-r from-neutral-900 to-neutral-800 dark:from-neutral-100 dark:to-neutral-200 text-white dark:text-neutral-900 hover:from-neutral-800 hover:to-neutral-700 dark:hover:from-neutral-200 dark:hover:to-neutral-300 border-2 border-neutral-900 dark:border-neutral-100 h-12 mt-6 transition-all duration-300 hover:shadow-xl"
                        >
                          Tiếp tục
                        </Button>
                      </motion.div>
                    </form>
                  </motion.div>
                )}

                {/* Step 2: Shipping Method & Payment */}
                {step === 2 && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.3 }}
                    className="space-y-6"
                  >
                    {/* Shipping Method - Luxury Style */}
                    <div className="bg-white dark:bg-gray-900 p-6 md:p-8 lg:p-10 border-2 border-neutral-200 dark:border-neutral-800 rounded-sm shadow-xl">
                      <div className="flex items-center gap-4 mb-8 pb-6 border-b-2 border-neutral-200 dark:border-neutral-800">
                        <motion.div
                          whileHover={{ rotate: 5 }}
                          className="p-3 rounded-sm bg-linear-to-br from-neutral-900 to-neutral-800 dark:from-neutral-100 dark:to-neutral-200 border-2 border-neutral-900 dark:border-neutral-100"
                        >
                          <Truck className="w-6 h-6 md:w-7 md:h-7 text-white dark:text-neutral-900" />
                        </motion.div>
                        <div>
                          <h2 className="text-2xl md:text-3xl font-light text-neutral-900 dark:text-neutral-100 uppercase tracking-tight">
                            Phương thức vận chuyển
                          </h2>
                          <p className="text-xs md:text-sm text-neutral-600 dark:text-neutral-400 font-light mt-2">
                            Chọn cách giao hàng phù hợp với bạn
                          </p>
                        </div>
                      </div>

                      <RadioGroup
                        value={shippingMethod}
                        onValueChange={setShippingMethod}
                        className="space-y-4"
                      >
                        {/* Standard Shipping */}
                        <motion.div
                          whileHover={{ scale: 1.01 }}
                          whileTap={{ scale: 0.99 }}
                          className={cn(
                            "relative flex items-start gap-4 p-6 md:p-8 border-2 rounded-sm cursor-pointer transition-all duration-300 shadow-lg hover:shadow-xl",
                            shippingMethod === "standard"
                              ? "border-neutral-900 dark:border-neutral-100 bg-linear-to-br from-neutral-50 to-white dark:from-neutral-900 dark:to-neutral-800"
                              : "border-neutral-200 dark:border-neutral-800 hover:border-neutral-400 dark:hover:border-neutral-600 bg-white dark:bg-gray-900"
                          )}
                          onClick={() => setShippingMethod("standard")}
                        >
                          <div className="shrink-0 mt-1">
                            <RadioGroupItem
                              value="standard"
                              id="standard"
                              className="border-gray-400 dark:border-gray-600"
                            />
                          </div>
                          <Label
                            htmlFor="standard"
                            className="flex-1 cursor-pointer"
                          >
                            <div className="flex items-start justify-between gap-4">
                              <div className="flex items-start gap-4 flex-1">
                                <div className="w-12 h-12 bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 flex items-center justify-center rounded-none shrink-0">
                                  <Truck className="w-6 h-6 text-black dark:text-white" />
                                </div>
                                <div className="flex-1">
                                  <div className="flex items-center gap-2 mb-1">
                                    <p className="font-light text-sm uppercase tracking-wider text-black dark:text-white">
                                      Giao hàng tiêu chuẩn
                                    </p>
                                    {shippingCalculation?.isFreeShipping && (
                                      <span className="px-2 py-0.5 bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300 text-xs font-medium uppercase tracking-wide">
                                        Miễn phí
                                      </span>
                                    )}
                                  </div>
                                  <p className="text-xs text-gray-600 dark:text-gray-400 font-light">
                                    {shippingCalculation?.estimatedDays ||
                                      "3-5 ngày làm việc"}
                                  </p>
                                  {shippingCalculation &&
                                    !shippingCalculation.isFreeShipping &&
                                    shippingCalculation.remainingForFreeShipping >
                                      0 && (
                                      <p className="text-xs text-amber-600 dark:text-amber-400 font-light mt-1">
                                        Mua thêm{" "}
                                        <Currency
                                          value={
                                            shippingCalculation.remainingForFreeShipping
                                          }
                                        />{" "}
                                        để miễn phí ship
                                      </p>
                                    )}
                                </div>
                              </div>
                              <div className="text-right shrink-0">
                                {shippingCalculation?.isFreeShipping ? (
                                  <span className="text-lg font-light text-green-600 dark:text-green-400">
                                    Miễn phí
                                  </span>
                                ) : shippingCalculation ? (
                                  <Currency
                                    value={shippingCalculation.originalFee}
                                  />
                                ) : (
                                  <span className="text-sm text-gray-500">
                                    Chọn tỉnh/thành
                                  </span>
                                )}
                              </div>
                            </div>
                          </Label>
                        </motion.div>

                        {/* Express Shipping */}
                        <motion.div
                          whileHover={{ scale: 1.01 }}
                          whileTap={{ scale: 0.99 }}
                          className={cn(
                            "relative flex items-start gap-4 p-6 border-2 rounded-none cursor-pointer transition-all duration-200",
                            shippingMethod === "express"
                              ? "border-black dark:border-white bg-gray-50 dark:bg-gray-800"
                              : "border-gray-300 dark:border-gray-700 hover:border-gray-400 dark:hover:border-gray-600 bg-white dark:bg-gray-900"
                          )}
                          onClick={() => setShippingMethod("express")}
                        >
                          <div className="shrink-0 mt-1">
                            <RadioGroupItem
                              value="express"
                              id="express"
                              className="border-gray-400 dark:border-gray-600"
                            />
                          </div>
                          <Label
                            htmlFor="express"
                            className="flex-1 cursor-pointer"
                          >
                            <div className="flex items-start justify-between gap-4">
                              <div className="flex items-start gap-4 flex-1">
                                <div className="w-12 h-12 bg-orange-100 dark:bg-orange-900/30 border border-orange-200 dark:border-orange-800 flex items-center justify-center rounded-none shrink-0">
                                  <Truck className="w-6 h-6 text-orange-600 dark:text-orange-400" />
                                </div>
                                <div className="flex-1">
                                  <div className="flex items-center gap-2 mb-1">
                                    <p className="font-light text-sm uppercase tracking-wider text-black dark:text-white">
                                      Giao hàng nhanh
                                    </p>
                                    {shippingCalculation?.isFreeShipping && (
                                      <span className="px-2 py-0.5 bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300 text-xs font-medium uppercase tracking-wide">
                                        Miễn phí
                                      </span>
                                    )}
                                  </div>
                                  <p className="text-xs text-gray-600 dark:text-gray-400 font-light">
                                    {shippingMethod === "express" &&
                                    shippingCalculation
                                      ? shippingCalculation.estimatedDays
                                      : "1-2 ngày làm việc"}
                                  </p>
                                  {shippingCalculation &&
                                    !shippingCalculation.isFreeShipping &&
                                    shippingCalculation.remainingForFreeShipping >
                                      0 && (
                                      <p className="text-xs text-amber-600 dark:text-amber-400 font-light mt-1">
                                        Mua thêm{" "}
                                        <Currency
                                          value={
                                            shippingCalculation.remainingForFreeShipping
                                          }
                                        />{" "}
                                        để miễn phí ship
                                      </p>
                                    )}
                                </div>
                              </div>
                              <div className="text-right shrink-0">
                                {shippingMethod === "express" &&
                                shippingCalculation?.isFreeShipping ? (
                                  <span className="text-lg font-light text-green-600 dark:text-green-400">
                                    Miễn phí
                                  </span>
                                ) : shippingCalculation ? (
                                  <Currency
                                    value={
                                      shippingCalculation.shippingMethod ===
                                      "express"
                                        ? shippingCalculation.originalFee
                                        : shippingCalculation.originalFee * 1.67
                                    }
                                  />
                                ) : (
                                  <span className="text-sm text-gray-500">
                                    Chọn tỉnh/thành
                                  </span>
                                )}
                              </div>
                            </div>
                          </Label>
                        </motion.div>
                      </RadioGroup>
                    </div>

                    {/* Payment Method - Luxury Style */}
                    <div className="bg-white dark:bg-gray-900 p-6 md:p-8 lg:p-10 border-2 border-neutral-200 dark:border-neutral-800 rounded-sm shadow-xl">
                      <div className="flex items-center gap-4 mb-8 pb-6 border-b-2 border-neutral-200 dark:border-neutral-800">
                        <motion.div
                          whileHover={{ rotate: 5 }}
                          className="p-3 rounded-sm bg-linear-to-br from-neutral-900 to-neutral-800 dark:from-neutral-100 dark:to-neutral-200 border-2 border-neutral-900 dark:border-neutral-100"
                        >
                          <CreditCard className="w-6 h-6 md:w-7 md:h-7 text-white dark:text-neutral-900" />
                        </motion.div>
                        <div>
                          <h2 className="text-2xl md:text-3xl font-light text-neutral-900 dark:text-neutral-100 uppercase tracking-tight">
                            Phương thức thanh toán
                          </h2>
                          <p className="text-xs md:text-sm text-neutral-600 dark:text-neutral-400 font-light mt-2">
                            Chọn cách thanh toán bạn muốn sử dụng
                          </p>
                        </div>
                      </div>

                      <RadioGroup
                        value={paymentMethod || ""}
                        onValueChange={(value) =>
                          setPaymentMethod(value as PaymentMethod)
                        }
                        className="space-y-4"
                      >
                        {/* COD - Luxury Style */}
                        <motion.div
                          whileHover={{ scale: 1.01, y: -2 }}
                          whileTap={{ scale: 0.99 }}
                          className={cn(
                            "flex items-center gap-4 p-6 md:p-8 border-2 rounded-sm cursor-pointer transition-all duration-300 shadow-lg hover:shadow-xl",
                            paymentMethod === "cod"
                              ? "border-neutral-900 dark:border-neutral-100 bg-linear-to-br from-neutral-50 to-white dark:from-neutral-900 dark:to-neutral-800"
                              : "border-neutral-200 dark:border-neutral-800 hover:border-neutral-400 dark:hover:border-neutral-600 bg-white dark:bg-gray-900"
                          )}
                          onClick={() => setPaymentMethod("cod")}
                        >
                          <RadioGroupItem
                            value="cod"
                            id="cod"
                            className="shrink-0"
                          />
                          <Label
                            htmlFor="cod"
                            className="flex-1 cursor-pointer"
                          >
                            <div className="flex items-center gap-4">
                              <div className="p-2 rounded-sm bg-neutral-100 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700">
                                <Wallet className="w-5 h-5 md:w-6 md:h-6 text-neutral-900 dark:text-neutral-100" />
                              </div>
                              <div>
                                <p className="font-light text-sm md:text-base uppercase tracking-[0.15em] text-neutral-900 dark:text-neutral-100">
                                  Thanh toán khi nhận hàng (COD)
                                </p>
                                <p className="text-xs md:text-sm text-neutral-600 dark:text-neutral-400 font-light mt-1">
                                  Thanh toán bằng tiền mặt khi nhận hàng
                                </p>
                              </div>
                            </div>
                          </Label>
                        </motion.div>

                        {/* Stripe - Luxury Style */}
                        <motion.div
                          whileHover={{ scale: 1.01, y: -2 }}
                          whileTap={{ scale: 0.99 }}
                          className={cn(
                            "flex items-center gap-4 p-6 md:p-8 border-2 rounded-sm cursor-pointer transition-all duration-300 shadow-lg hover:shadow-xl",
                            paymentMethod === "stripe"
                              ? "border-neutral-900 dark:border-neutral-100 bg-linear-to-br from-neutral-50 to-white dark:from-neutral-900 dark:to-neutral-800"
                              : "border-neutral-200 dark:border-neutral-800 hover:border-neutral-400 dark:hover:border-neutral-600 bg-white dark:bg-gray-900"
                          )}
                          onClick={() => setPaymentMethod("stripe")}
                        >
                          <RadioGroupItem
                            value="stripe"
                            id="stripe"
                            className="shrink-0"
                          />
                          <Label
                            htmlFor="stripe"
                            className="flex-1 cursor-pointer"
                          >
                            <div className="flex items-center gap-4">
                              <div className="p-2 rounded-sm bg-neutral-100 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700">
                                <Building2 className="w-5 h-5 md:w-6 md:h-6 text-neutral-900 dark:text-neutral-100" />
                              </div>
                              <div>
                                <p className="font-light text-sm md:text-base uppercase tracking-[0.15em] text-neutral-900 dark:text-neutral-100">
                                  Thẻ tín dụng/Ghi nợ (Stripe)
                                </p>
                                <p className="text-xs md:text-sm text-neutral-600 dark:text-neutral-400 font-light mt-1">
                                  Thanh toán an toàn qua Stripe
                                </p>
                              </div>
                            </div>
                          </Label>
                        </motion.div>

                        {/* Momo - Luxury Style */}
                        <motion.div
                          whileHover={{ scale: 1.01, y: -2 }}
                          whileTap={{ scale: 0.99 }}
                          className={cn(
                            "flex items-center gap-4 p-6 md:p-8 border-2 rounded-sm cursor-pointer transition-all duration-300 shadow-lg hover:shadow-xl",
                            paymentMethod === "momo"
                              ? "border-neutral-900 dark:border-neutral-100 bg-linear-to-br from-neutral-50 to-white dark:from-neutral-900 dark:to-neutral-800"
                              : "border-neutral-200 dark:border-neutral-800 hover:border-neutral-400 dark:hover:border-neutral-600 bg-white dark:bg-gray-900"
                          )}
                          onClick={() => setPaymentMethod("momo")}
                        >
                          <RadioGroupItem
                            value="momo"
                            id="momo"
                            className="shrink-0"
                          />
                          <Label
                            htmlFor="momo"
                            className="flex-1 cursor-pointer"
                          >
                            <div className="flex items-center gap-4">
                              <div className="p-2 rounded-sm bg-pink-100 dark:bg-pink-900/30 border border-pink-200 dark:border-pink-800">
                                <Smartphone className="w-5 h-5 md:w-6 md:h-6 text-pink-600 dark:text-pink-400" />
                              </div>
                              <div>
                                <p className="font-light text-sm md:text-base uppercase tracking-[0.15em] text-neutral-900 dark:text-neutral-100">
                                  Ví điện tử MoMo
                                </p>
                                <p className="text-xs md:text-sm text-neutral-600 dark:text-neutral-400 font-light mt-1">
                                  Thanh toán qua ứng dụng MoMo
                                </p>
                              </div>
                            </div>
                          </Label>
                        </motion.div>

                        {/* VNPay - Luxury Style */}
                        <motion.div
                          whileHover={{ scale: 1.01, y: -2 }}
                          whileTap={{ scale: 0.99 }}
                          className={cn(
                            "flex items-center gap-4 p-6 md:p-8 border-2 rounded-sm cursor-pointer transition-all duration-300 shadow-lg hover:shadow-xl",
                            paymentMethod === "vnpay"
                              ? "border-neutral-900 dark:border-neutral-100 bg-linear-to-br from-neutral-50 to-white dark:from-neutral-900 dark:to-neutral-800"
                              : "border-neutral-200 dark:border-neutral-800 hover:border-neutral-400 dark:hover:border-neutral-600 bg-white dark:bg-gray-900"
                          )}
                          onClick={() => setPaymentMethod("vnpay")}
                        >
                          <RadioGroupItem
                            value="vnpay"
                            id="vnpay"
                            className="shrink-0"
                          />
                          <Label
                            htmlFor="vnpay"
                            className="flex-1 cursor-pointer"
                          >
                            <div className="flex items-center gap-4">
                              <div className="p-2 rounded-sm bg-blue-100 dark:bg-blue-900/30 border border-blue-200 dark:border-blue-800">
                                <Building2 className="w-5 h-5 md:w-6 md:h-6 text-blue-600 dark:text-blue-400" />
                              </div>
                              <div>
                                <p className="font-light text-sm md:text-base uppercase tracking-[0.15em] text-neutral-900 dark:text-neutral-100">
                                  VNPay
                                </p>
                                <p className="text-xs md:text-sm text-neutral-600 dark:text-neutral-400 font-light mt-1">
                                  Thanh toán qua cổng VNPay
                                  (ATM/Visa/MasterCard)
                                </p>
                              </div>
                            </div>
                          </Label>
                        </motion.div>

                        {/* QR Code - Luxury Style */}
                        <motion.div className="flex items-center gap-4 p-6 md:p-8 border-2 border-neutral-200 dark:border-neutral-800 rounded-sm cursor-not-allowed opacity-60 bg-neutral-50 dark:bg-neutral-900">
                          <RadioGroupItem
                            value="qr"
                            id="qr"
                            disabled
                            className="shrink-0"
                          />
                          <Label
                            htmlFor="qr"
                            className="flex-1 cursor-not-allowed"
                          >
                            <div className="flex items-center gap-4">
                              <div className="p-2 rounded-sm bg-neutral-200 dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-700">
                                <QrCode className="w-5 h-5 md:w-6 md:h-6 text-neutral-400 dark:text-neutral-600" />
                              </div>
                              <div>
                                <p className="font-light text-sm md:text-base uppercase tracking-[0.15em] text-neutral-400 dark:text-neutral-600">
                                  Quét mã QR
                                </p>
                                <p className="text-xs md:text-sm text-neutral-500 dark:text-neutral-500 font-light mt-1">
                                  Thanh toán bằng cách quét mã QR
                                </p>
                              </div>
                            </div>
                          </Label>
                        </motion.div>
                      </RadioGroup>
                    </div>

                    {/* Customer Note - Luxury Style */}
                    <div className="bg-white dark:bg-gray-900 p-6 md:p-8 lg:p-10 border-2 border-neutral-200 dark:border-neutral-800 rounded-sm shadow-xl">
                      <div className="flex items-center gap-4 mb-6 pb-6 border-b-2 border-neutral-200 dark:border-neutral-800">
                        <motion.div
                          whileHover={{ rotate: 5 }}
                          className="p-3 rounded-sm bg-linear-to-br from-neutral-900 to-neutral-800 dark:from-neutral-100 dark:to-neutral-200 border-2 border-neutral-900 dark:border-neutral-100"
                        >
                          <MapPin className="w-6 h-6 md:w-7 md:h-7 text-white dark:text-neutral-900" />
                        </motion.div>
                        <div>
                          <h2 className="text-2xl md:text-3xl font-light text-neutral-900 dark:text-neutral-100 uppercase tracking-tight">
                            Ghi chú đơn hàng
                          </h2>
                          <p className="text-xs md:text-sm text-neutral-600 dark:text-neutral-400 font-light mt-2">
                            Thêm ghi chú cho đơn hàng của bạn (tùy chọn)
                          </p>
                        </div>
                      </div>

                      <div className="space-y-3">
                        <Textarea
                          placeholder="Ví dụ: Giao hàng vào buổi sáng, gọi điện trước khi giao, để ở cổng..."
                          value={customerNote}
                          onChange={(e) => setCustomerNote(e.target.value)}
                          className="min-h-[120px] text-sm font-light rounded-sm border-2 border-neutral-200 dark:border-neutral-800 focus:border-neutral-900 dark:focus:border-neutral-100 resize-none bg-white dark:bg-gray-900 transition-all duration-300"
                          maxLength={500}
                        />
                        <p className="text-xs text-neutral-500 dark:text-neutral-400 font-light">
                          {customerNote.length}/500 ký tự
                        </p>
                      </div>
                    </div>

                    <div className="flex gap-4">
                      <motion.div
                        whileHover={{ scale: 1.01 }}
                        whileTap={{ scale: 0.99 }}
                        className="flex-1"
                      >
                        <Button
                          variant="outline"
                          onClick={() => setStep(1)}
                          className="w-full rounded-sm text-sm font-light uppercase tracking-[0.15em] border-2 border-neutral-200 dark:border-neutral-800 hover:border-neutral-900 dark:hover:border-neutral-100 h-12 transition-all duration-300"
                        >
                          <ArrowLeft className="w-4 h-4 mr-2" />
                          Quay lại
                        </Button>
                      </motion.div>
                      <motion.div
                        whileHover={{ scale: 1.01 }}
                        whileTap={{ scale: 0.99 }}
                        className="flex-1"
                      >
                        <Button
                          onClick={handleContinueToStep3}
                          disabled={!paymentMethod}
                          className={cn(
                            "w-full rounded-sm text-sm font-light uppercase tracking-[0.15em] h-12 transition-all duration-300",
                            !paymentMethod
                              ? "bg-neutral-200 dark:bg-neutral-800 text-neutral-400 dark:text-neutral-600 cursor-not-allowed border-2 border-neutral-200 dark:border-neutral-800"
                              : "bg-linear-to-r from-neutral-900 to-neutral-800 dark:from-neutral-100 dark:to-neutral-200 text-white dark:text-neutral-900 hover:from-neutral-800 hover:to-neutral-700 dark:hover:from-neutral-200 dark:hover:to-neutral-300 border-2 border-neutral-900 dark:border-neutral-100 hover:shadow-xl"
                          )}
                        >
                          Tiếp tục
                        </Button>
                      </motion.div>
                    </div>
                  </motion.div>
                )}

                {/* Step 3: Review & Confirm - Luxury Style */}
                {step === 3 && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.5 }}
                    className="bg-white dark:bg-gray-900 p-6 md:p-8 lg:p-10 border-2 border-neutral-200 dark:border-neutral-800 rounded-sm shadow-xl"
                  >
                    <div className="flex items-center gap-4 mb-8 pb-6 border-b-2 border-neutral-200 dark:border-neutral-800">
                      <motion.div
                        whileHover={{ rotate: 5 }}
                        className="p-3 rounded-sm bg-linear-to-br from-neutral-900 to-neutral-800 dark:from-neutral-100 dark:to-neutral-200 border-2 border-neutral-900 dark:border-neutral-100"
                      >
                        <Lock className="w-6 h-6 md:w-7 md:h-7 text-white dark:text-neutral-900" />
                      </motion.div>
                      <div>
                        <h2 className="text-2xl md:text-3xl font-light text-neutral-900 dark:text-neutral-100 uppercase tracking-tight">
                          Xác nhận đơn hàng
                        </h2>
                        <p className="text-xs md:text-sm text-neutral-600 dark:text-neutral-400 font-light mt-2">
                          Kiểm tra lại thông tin trước khi đặt hàng
                        </p>
                      </div>
                    </div>

                    <div className="space-y-6">
                      {/* Shipping Address Summary - Luxury Style */}
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.1 }}
                      >
                        <h3 className="text-sm md:text-base font-light text-neutral-900 dark:text-neutral-100 uppercase tracking-[0.15em] mb-4">
                          Địa chỉ giao hàng
                        </h3>
                        <div className="p-5 md:p-6 bg-linear-to-br from-neutral-50 to-white dark:from-neutral-900 dark:to-neutral-800 border-2 border-neutral-200 dark:border-neutral-800 rounded-sm">
                          <p className="font-light text-sm md:text-base text-neutral-900 dark:text-neutral-100">
                            {shippingAddress.fullName}
                          </p>
                          <p className="font-light text-sm md:text-base text-neutral-600 dark:text-neutral-400 mt-2">
                            {shippingAddress.phone}
                          </p>
                          <p className="font-light text-sm md:text-base text-neutral-600 dark:text-neutral-400 mt-2">
                            {shippingAddress.address}
                            {shippingAddress.ward &&
                              `, ${shippingAddress.ward}`}
                            {shippingAddress.district &&
                              `, ${shippingAddress.district}`}
                            {shippingAddress.province &&
                              `, ${shippingAddress.province}`}
                          </p>
                        </div>
                      </motion.div>

                      {/* Payment Summary - Luxury Style */}
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.2 }}
                      >
                        <h3 className="text-sm md:text-base font-light text-neutral-900 dark:text-neutral-100 uppercase tracking-[0.15em] mb-4">
                          Phương thức thanh toán
                        </h3>
                        <div className="p-5 md:p-6 bg-linear-to-br from-neutral-50 to-white dark:from-neutral-900 dark:to-neutral-800 border-2 border-neutral-200 dark:border-neutral-800 rounded-sm">
                          <p className="font-light text-sm md:text-base text-neutral-900 dark:text-neutral-100">
                            {paymentMethod === "cod" &&
                              "Thanh toán khi nhận hàng (COD)"}
                            {paymentMethod === "stripe" &&
                              "Thẻ tín dụng/Ghi nợ (Stripe)"}
                            {paymentMethod === "momo" && "Ví điện tử MoMo"}
                            {paymentMethod === "vnpay" &&
                              "Cổng thanh toán VNPay"}
                            {paymentMethod === "qr" && "Quét mã QR"}
                          </p>
                        </div>
                      </motion.div>
                    </div>

                    <div className="flex gap-4 mt-8">
                      <motion.div
                        whileHover={{ scale: 1.01 }}
                        whileTap={{ scale: 0.99 }}
                        className="flex-1"
                      >
                        <Button
                          variant="outline"
                          onClick={() => setStep(2)}
                          className="w-full rounded-sm text-sm font-light uppercase tracking-[0.15em] border-2 border-neutral-200 dark:border-neutral-800 hover:border-neutral-900 dark:hover:border-neutral-100 h-12 transition-all duration-300"
                        >
                          <ArrowLeft className="w-4 h-4 mr-2" />
                          Quay lại
                        </Button>
                      </motion.div>
                      <motion.div
                        whileHover={{ scale: 1.01 }}
                        whileTap={{ scale: 0.99 }}
                        className="flex-1"
                      >
                        <Button
                          onClick={handleCheckout}
                          disabled={loading}
                          className="w-full rounded-sm text-sm font-light uppercase tracking-[0.15em] bg-linear-to-r from-neutral-900 to-neutral-800 dark:from-neutral-100 dark:to-neutral-200 text-white dark:text-neutral-900 hover:from-neutral-800 hover:to-neutral-700 dark:hover:from-neutral-200 dark:hover:to-neutral-300 border-2 border-neutral-900 dark:border-neutral-100 h-12 transition-all duration-300 hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          {loading ? (
                            <>
                              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                              Đang xử lý...
                            </>
                          ) : (
                            <>
                              <Lock className="w-4 h-4 mr-2" />
                              {paymentMethod === "cod"
                                ? "Đặt hàng"
                                : paymentMethod === "momo"
                                ? "Thanh toán MoMo"
                                : paymentMethod === "vnpay"
                                ? "Thanh toán VNPay"
                                : "Thanh toán"}
                            </>
                          )}
                        </Button>
                      </motion.div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Order Summary Sidebar - Luxury Style */}
            <div className="lg:col-span-1">
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
                className="bg-white dark:bg-gray-900 p-6 md:p-8 border-2 border-neutral-200 dark:border-neutral-800 sticky top-4 rounded-sm shadow-xl"
              >
                <div className="flex items-center gap-3 mb-6 pb-6 border-b-2 border-neutral-200 dark:border-neutral-800">
                  <motion.div
                    whileHover={{ rotate: 5 }}
                    className="p-2 rounded-sm bg-linear-to-br from-neutral-900 to-neutral-800 dark:from-neutral-100 dark:to-neutral-200 border-2 border-neutral-900 dark:border-neutral-100"
                  >
                    <ShoppingBag className="w-5 h-5 text-white dark:text-neutral-900" />
                  </motion.div>
                  <h2 className="text-sm md:text-base font-light text-neutral-900 dark:text-neutral-100 uppercase tracking-[0.15em]">
                    Tóm tắt đơn hàng
                  </h2>
                </div>

                <div className="space-y-4 mb-6 max-h-[400px] overflow-y-auto">
                  {cart.items.map((item, index) => (
                    <motion.div
                      key={item.cartItemId}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3, delay: index * 0.05 }}
                      className="flex gap-3 pb-4 border-b-2 border-neutral-200 dark:border-neutral-800 last:border-0"
                    >
                      <motion.div
                        whileHover={{ scale: 1.05 }}
                        className="w-20 h-20 md:w-24 md:h-24 bg-neutral-100 dark:bg-neutral-900 shrink-0 border-2 border-neutral-200 dark:border-neutral-800 rounded-sm overflow-hidden"
                      >
                        <img
                          src={item.images?.[0]?.url || "/placeholder.svg"}
                          alt={item.name}
                          className="w-full h-full object-cover"
                        />
                      </motion.div>
                      <div className="flex-1 min-w-0">
                        <p className="font-light text-xs md:text-sm text-neutral-900 dark:text-neutral-100 line-clamp-2 uppercase tracking-wide">
                          {item.name}
                        </p>
                        <p className="text-xs font-light text-neutral-600 dark:text-neutral-400 mt-1">
                          {item.size?.name} / {item.color?.name}
                        </p>
                        <div className="flex items-center justify-between mt-3">
                          <div className="flex items-center gap-2 border-2 border-neutral-200 dark:border-neutral-800 rounded-sm">
                            <motion.button
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.9 }}
                              onClick={() =>
                                cart.decreaseQuantity(item.cartItemId)
                              }
                              className="p-1.5 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors rounded-sm"
                              disabled={item.quantity <= 1}
                            >
                              <Minus className="w-3 h-3 text-neutral-900 dark:text-neutral-100" />
                            </motion.button>
                            <span className="text-xs font-light text-neutral-900 dark:text-neutral-100 px-2 min-w-8 text-center">
                              {item.quantity}
                            </span>
                            <motion.button
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.9 }}
                              onClick={() =>
                                cart.increaseQuantity(item.cartItemId)
                              }
                              className="p-1.5 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors rounded-sm"
                            >
                              <Plus className="w-3 h-3 text-neutral-900 dark:text-neutral-100" />
                            </motion.button>
                          </div>
                          <motion.button
                            whileHover={{ scale: 1.1, rotate: 5 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={() => cart.removeItem(item.cartItemId)}
                            className="p-1.5 hover:bg-red-50 dark:hover:bg-red-950/20 transition-colors rounded-sm"
                          >
                            <Trash2 className="w-4 h-4 text-red-500 dark:text-red-400" />
                          </motion.button>
                        </div>
                        <p className="text-sm md:text-base font-light text-neutral-900 dark:text-neutral-100 mt-3">
                          <Currency value={item.price * item.quantity} />
                        </p>
                      </div>
                    </motion.div>
                  ))}
                </div>

                <div className="h-px bg-linear-to-r from-transparent via-neutral-200 to-transparent dark:via-neutral-800 my-6" />

                <div className="space-y-4 mt-6">
                  <div className="flex justify-between text-neutral-600 dark:text-neutral-400 text-xs md:text-sm font-light">
                    <span className="uppercase tracking-[0.15em]">
                      Tạm tính:
                    </span>
                    <span>
                      <Currency value={subtotal} />
                    </span>
                  </div>
                  {discount > 0 && appliedCoupon && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="flex justify-between text-green-600 dark:text-green-400 text-xs md:text-sm font-light"
                    >
                      <span className="uppercase tracking-[0.15em]">
                        Giảm giá ({appliedCoupon.code}):
                      </span>
                      <span>
                        -<Currency value={discount} />
                      </span>
                    </motion.div>
                  )}
                  <div className="flex justify-between text-neutral-600 dark:text-neutral-400 text-xs md:text-sm font-light">
                    <span className="uppercase tracking-[0.15em]">
                      Phí vận chuyển (
                      {shippingMethod === "express" ? "Nhanh" : "Tiêu chuẩn"}):
                    </span>
                    <span>
                      {shippingFee === 0 ? (
                        <span className="text-green-600 dark:text-green-400 font-light">
                          Miễn phí
                        </span>
                      ) : (
                        <Currency value={shippingFee} />
                      )}
                    </span>
                  </div>
                  <div className="h-px bg-linear-to-r from-transparent via-neutral-900 to-transparent dark:via-neutral-100 my-4" />
                  <div className="flex justify-between text-base md:text-lg font-light text-neutral-900 dark:text-neutral-100">
                    <span className="uppercase tracking-[0.15em]">
                      Tổng cộng:
                    </span>
                    <span>
                      <Currency value={finalTotal} />
                    </span>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </Container>
    </div>
  );
}
