"use client";

import { useState, useEffect, useRef, useMemo } from "react";
import Container from "@/components/ui/container";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Separator } from "@/components/ui/separator";
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
} from "lucide-react";
import Currency from "@/components/ui/currency";
import { toast } from "sonner";
import { useRouter, useSearchParams } from "next/navigation";
import { cn } from "@/lib/utils";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";

type PaymentMethod = "cod" | "momo" | "vnpay" | "qr" | "stripe" | null;

export default function CheckoutPage() {
  const cart = useCart();
  const router = useRouter();
  const searchParams = useSearchParams();
  const { requireAuth, isAuthenticated } = useAuth();
  const [step, setStep] = useState(1);
  const [shippingMethod, setShippingMethod] = useState("standard");
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>(null);
  const [loading, setLoading] = useState(false);

  const [shippingAddress, setShippingAddress] = useState({
    fullName: "",
    phone: "",
    email: "",
    address: "",
    province: "",
    district: "",
    ward: "",
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [appliedCoupon, setAppliedCoupon] = useState<{
    code: string;
    value: number;
    type: "PERCENT" | "FIXED";
  } | null>(null);

  const [customerNote, setCustomerNote] = useState("");
  const hasProcessedPayment = useRef(false);

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

  // Calculate shipping fee based on method and subtotal (trước discount)
  const getShippingFee = () => {
    if (subtotal >= 500000) {
      return 0; // Free shipping for orders >= 500k
    }
    if (shippingMethod === "express") {
      return 50000; // Express shipping
    }
    return 30000; // Standard shipping
  };

  const shippingFee = getShippingFee();
  // Total = subtotal - discount + shipping
  const finalTotal = subtotal - discount + shippingFee;

  // Lấy giá trị từ searchParams bằng useMemo với string comparison để tránh vòng lặp
  const paymentSuccess = useMemo(
    () => searchParams.get("success"),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [searchParams.toString()]
  );
  const paymentCanceled = useMemo(
    () => searchParams.get("canceled"),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [searchParams.toString()]
  );

  // Handle success/cancel from payment
  useEffect(() => {
    // Chỉ xử lý một lần để tránh vòng lặp vô hạn
    if (hasProcessedPayment.current) {
      return;
    }

    if (paymentSuccess) {
      hasProcessedPayment.current = true;
      toast.success("Thanh toán thành công! Đơn hàng của bạn đang được xử lý.");
      // Sử dụng setTimeout để tránh cập nhật state trong quá trình render
      setTimeout(() => {
        cart.removeAll();
        router.push("/account/orders");
      }, 0);
      return;
    }

    if (paymentCanceled) {
      hasProcessedPayment.current = true;
      toast.error("Thanh toán đã bị hủy. Vui lòng thử lại.");
    }
  }, [paymentSuccess, paymentCanceled, cart, router]);

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

        const response = await axios.post(
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
              email: shippingAddress.email || undefined,
              address: shippingAddress.address,
              province: shippingAddress.province,
              district: shippingAddress.district,
              ward: shippingAddress.ward,
            },
            shippingMethod: shippingMethod,
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
          toast.success(
            "Đặt hàng thành công! Bạn sẽ thanh toán khi nhận hàng."
          );
          cart.removeAll();
          router.push("/account/orders");
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

        const response = await axios.post(
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
              email: shippingAddress.email || undefined,
              address: shippingAddress.address,
              province: shippingAddress.province,
              district: shippingAddress.district,
              ward: shippingAddress.ward,
            },
            shippingMethod: shippingMethod,
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
        } else {
          toast.error("Không thể tạo phiên thanh toán. Vui lòng thử lại.");
          setLoading(false);
        }
        return;
      }

      if (
        paymentMethod === "momo" ||
        paymentMethod === "vnpay" ||
        paymentMethod === "qr"
      ) {
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
      <div className="bg-white min-h-screen py-12">
        <Container>
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl font-light text-black mb-4 uppercase tracking-wider">
              Giỏ hàng trống
            </h1>
            <p className="text-gray-600 mb-8 font-light">
              Vui lòng thêm sản phẩm vào giỏ hàng để tiếp tục
            </p>
            <Button asChild variant="outline" className="rounded-none">
              <a href="/">Tiếp tục mua sắm</a>
            </Button>
          </div>
        </Container>
      </div>
    );
  }

  return (
    <div className="bg-white min-h-screen py-12">
      <Container>
        <div className="max-w-7xl mx-auto">
          {/* Progress Steps */}
          <div className="mb-12">
            <div className="flex items-center justify-center gap-4">
              {[1, 2, 3].map((stepNum) => (
                <div key={stepNum} className="flex items-center gap-4">
                  <div
                    className={cn(
                      "w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all duration-300 font-light text-sm",
                      step >= stepNum
                        ? "bg-black text-white border-black"
                        : "bg-white text-gray-400 border-gray-300"
                    )}
                  >
                    {step > stepNum ? (
                      <CheckCircle2 className="w-5 h-5" />
                    ) : (
                      stepNum
                    )}
                  </div>
                  {stepNum < 3 && (
                    <div
                      className={cn(
                        "w-16 h-0.5 transition-all duration-300",
                        step > stepNum ? "bg-black" : "bg-gray-300"
                      )}
                    />
                  )}
                </div>
              ))}
            </div>
            <div className="flex items-center justify-center gap-16 mt-4">
              <p className="text-xs font-light text-gray-600 uppercase tracking-wide">
                Địa chỉ
              </p>
              <p className="text-xs font-light text-gray-600 uppercase tracking-wide">
                Thanh toán
              </p>
              <p className="text-xs font-light text-gray-600 uppercase tracking-wide">
                Xác nhận
              </p>
            </div>
          </div>

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
                    transition={{ duration: 0.3 }}
                    className="bg-white p-8 border border-gray-300 rounded-none"
                  >
                    <div className="flex items-center gap-3 mb-8">
                      <div className="w-12 h-12 bg-gray-50 border border-gray-200 flex items-center justify-center rounded-none">
                        <MapPin className="w-6 h-6 text-black" />
                      </div>
                      <div>
                        <h2 className="text-2xl font-light text-black uppercase tracking-wider">
                          Địa chỉ giao hàng
                        </h2>
                        <p className="text-xs text-gray-500 font-light mt-1">
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
                              "rounded-none border-gray-300 focus-visible:ring-black h-11 font-light",
                              errors.fullName && "border-red-500"
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
                              "rounded-none border-gray-300 focus-visible:ring-black h-11 font-light",
                              errors.phone && "border-red-500"
                            )}
                          />
                          {errors.phone && (
                            <p className="text-xs text-red-500 font-light">
                              {errors.phone}
                            </p>
                          )}
                        </div>
                        <div className="space-y-2">
                          <Label
                            htmlFor="email"
                            className="text-xs font-light uppercase tracking-wide"
                          >
                            Email
                          </Label>
                          <Input
                            id="email"
                            type="email"
                            placeholder="example@email.com"
                            value={shippingAddress.email}
                            onChange={(e) => {
                              setShippingAddress({
                                ...shippingAddress,
                                email: e.target.value,
                              });
                              if (errors.email) {
                                setErrors({ ...errors, email: "" });
                              }
                            }}
                            className={cn(
                              "rounded-none border-gray-300 focus-visible:ring-black h-11 font-light",
                              errors.email && "border-red-500"
                            )}
                          />
                          {errors.email && (
                            <p className="text-xs text-red-500 font-light">
                              {errors.email}
                            </p>
                          )}
                        </div>
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
                            "rounded-none border-gray-300 focus-visible:ring-black h-11 font-light",
                            errors.address && "border-red-500"
                          )}
                        />
                        {errors.address && (
                          <p className="text-xs text-red-500 font-light">
                            {errors.address}
                          </p>
                        )}
                      </div>
                      <div className="grid md:grid-cols-3 gap-5">
                        <div className="space-y-2">
                          <Label
                            htmlFor="province"
                            className="text-xs font-light uppercase tracking-wide"
                          >
                            Tỉnh/Thành phố{" "}
                            <span className="text-red-500">*</span>
                          </Label>
                          <Input
                            id="province"
                            placeholder="Hà Nội"
                            value={shippingAddress.province}
                            onChange={(e) => {
                              setShippingAddress({
                                ...shippingAddress,
                                province: e.target.value,
                              });
                              if (errors.province) {
                                setErrors({ ...errors, province: "" });
                              }
                            }}
                            className={cn(
                              "rounded-none border-gray-300 focus-visible:ring-black h-11 font-light",
                              errors.province && "border-red-500"
                            )}
                          />
                          {errors.province && (
                            <p className="text-xs text-red-500 font-light">
                              {errors.province}
                            </p>
                          )}
                        </div>
                        <div className="space-y-2">
                          <Label
                            htmlFor="district"
                            className="text-xs font-light uppercase tracking-wide"
                          >
                            Quận/Huyện <span className="text-red-500">*</span>
                          </Label>
                          <Input
                            id="district"
                            placeholder="Đống Đa"
                            value={shippingAddress.district}
                            onChange={(e) => {
                              setShippingAddress({
                                ...shippingAddress,
                                district: e.target.value,
                              });
                              if (errors.district) {
                                setErrors({ ...errors, district: "" });
                              }
                            }}
                            className={cn(
                              "rounded-none border-gray-300 focus-visible:ring-black h-11 font-light",
                              errors.district && "border-red-500"
                            )}
                          />
                          {errors.district && (
                            <p className="text-xs text-red-500 font-light">
                              {errors.district}
                            </p>
                          )}
                        </div>
                        <div className="space-y-2">
                          <Label
                            htmlFor="ward"
                            className="text-xs font-light uppercase tracking-wide"
                          >
                            Phường/Xã <span className="text-red-500">*</span>
                          </Label>
                          <Input
                            id="ward"
                            placeholder="Trung Liệt"
                            value={shippingAddress.ward}
                            onChange={(e) => {
                              setShippingAddress({
                                ...shippingAddress,
                                ward: e.target.value,
                              });
                              if (errors.ward) {
                                setErrors({ ...errors, ward: "" });
                              }
                            }}
                            className={cn(
                              "rounded-none border-gray-300 focus-visible:ring-black h-11 font-light",
                              errors.ward && "border-red-500"
                            )}
                          />
                          {errors.ward && (
                            <p className="text-xs text-red-500 font-light">
                              {errors.ward}
                            </p>
                          )}
                        </div>
                      </div>
                      <Button
                        type="submit"
                        variant="default"
                        className="w-full rounded-none text-xs font-light uppercase tracking-wider bg-white hover:bg-gray-900 h-11 mt-6"
                      >
                        Tiếp tục
                      </Button>
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
                    {/* Shipping Method */}
                    <div className="bg-white dark:bg-gray-900 p-8 border border-gray-300 dark:border-gray-700 rounded-none">
                      <div className="flex items-center gap-3 mb-8">
                        <div className="w-12 h-12 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 flex items-center justify-center rounded-none">
                          <Truck className="w-6 h-6 text-black dark:text-white" />
                        </div>
                        <div>
                          <h2 className="text-2xl font-light text-black dark:text-white uppercase tracking-wider">
                            Phương thức vận chuyển
                          </h2>
                          <p className="text-xs text-gray-500 dark:text-gray-400 font-light mt-1">
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
                            "relative flex items-start gap-4 p-6 border-2 rounded-none cursor-pointer transition-all duration-200",
                            shippingMethod === "standard"
                              ? "border-black dark:border-white bg-gray-50 dark:bg-gray-800"
                              : "border-gray-300 dark:border-gray-700 hover:border-gray-400 dark:hover:border-gray-600 bg-white dark:bg-gray-900"
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
                                    {shippingFee === 0 && (
                                      <span className="px-2 py-0.5 bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300 text-xs font-medium uppercase tracking-wide">
                                        Miễn phí
                                      </span>
                                    )}
                                  </div>
                                  <p className="text-xs text-gray-600 dark:text-gray-400 font-light">
                                    3-5 ngày làm việc
                                  </p>
                                  <p className="text-xs text-gray-500 dark:text-gray-500 font-light mt-1">
                                    Giao hàng trong giờ hành chính
                                  </p>
                                </div>
                              </div>
                              <div className="text-right shrink-0">
                                {shippingFee === 0 ? (
                                  <span className="text-lg font-light text-green-600 dark:text-green-400">
                                    Miễn phí
                                  </span>
                                ) : (
                                  <span className="text-lg font-light text-black dark:text-white">
                                    30.000₫
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
                                    {subtotal >= 500000 && (
                                      <span className="px-2 py-0.5 bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300 text-xs font-medium uppercase tracking-wide">
                                        Miễn phí
                                      </span>
                                    )}
                                    <span className="px-2 py-0.5 bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-400 text-xs font-medium uppercase tracking-wide">
                                      Nhanh
                                    </span>
                                  </div>
                                  <p className="text-xs text-gray-600 dark:text-gray-400 font-light">
                                    1-2 ngày làm việc
                                  </p>
                                  <p className="text-xs text-gray-500 dark:text-gray-500 font-light mt-1">
                                    Giao hàng ưu tiên, hỗ trợ giao ngoài giờ
                                  </p>
                                </div>
                              </div>
                              <div className="text-right shrink-0">
                                {subtotal >= 500000 ? (
                                  <span className="text-lg font-light text-green-600 dark:text-green-400">
                                    Miễn phí
                                  </span>
                                ) : (
                                  <span className="text-lg font-light text-black dark:text-white">
                                    50.000₫
                                  </span>
                                )}
                              </div>
                            </div>
                          </Label>
                        </motion.div>
                      </RadioGroup>
                    </div>

                    {/* Payment Method */}
                    <div className="bg-white p-8 border border-gray-300 rounded-none">
                      <div className="flex items-center gap-3 mb-6">
                        <div className="w-12 h-12 bg-gray-50 border border-gray-200 flex items-center justify-center rounded-none">
                          <CreditCard className="w-6 h-6 text-black" />
                        </div>
                        <div>
                          <h2 className="text-2xl font-light text-black uppercase tracking-wider">
                            Phương thức thanh toán
                          </h2>
                          <p className="text-xs text-gray-500 font-light mt-1">
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
                        {/* COD */}
                        <div className="flex items-center space-x-3 p-5 border border-gray-300 hover:border-black transition rounded-none cursor-pointer">
                          <RadioGroupItem value="cod" id="cod" />
                          <Label
                            htmlFor="cod"
                            className="flex-1 cursor-pointer"
                          >
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-3">
                                <Wallet className="w-5 h-5 text-black" />
                                <div>
                                  <p className="font-light text-sm uppercase tracking-wider text-black">
                                    Thanh toán khi nhận hàng (COD)
                                  </p>
                                  <p className="text-xs text-gray-600 font-light mt-1">
                                    Thanh toán bằng tiền mặt khi nhận hàng
                                  </p>
                                </div>
                              </div>
                            </div>
                          </Label>
                        </div>

                        {/* Stripe */}
                        <div className="flex items-center space-x-3 p-5 border border-gray-300 hover:border-black transition rounded-none cursor-pointer">
                          <RadioGroupItem value="stripe" id="stripe" />
                          <Label
                            htmlFor="stripe"
                            className="flex-1 cursor-pointer"
                          >
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-3">
                                <Building2 className="w-5 h-5 text-black" />
                                <div>
                                  <p className="font-light text-sm uppercase tracking-wider text-black">
                                    Thẻ tín dụng/Ghi nợ (Stripe)
                                  </p>
                                  <p className="text-xs text-gray-600 font-light mt-1">
                                    Thanh toán an toàn qua Stripe
                                  </p>
                                </div>
                              </div>
                            </div>
                          </Label>
                        </div>

                        {/* Momo */}
                        <div className="flex items-center space-x-3 p-5 border border-gray-300 hover:border-black transition rounded-none cursor-pointer opacity-60">
                          <RadioGroupItem value="momo" id="momo" disabled />
                          <Label
                            htmlFor="momo"
                            className="flex-1 cursor-pointer"
                          >
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-3">
                                <Smartphone className="w-5 h-5 text-black" />
                                <div>
                                  <p className="font-light text-sm uppercase tracking-wider text-black">
                                    Ví điện tử MoMo
                                  </p>
                                  <p className="text-xs text-gray-600 font-light mt-1">
                                    Thanh toán qua ứng dụng MoMo
                                  </p>
                                </div>
                              </div>
                            </div>
                          </Label>
                        </div>

                        {/* VNPay */}
                        <div className="flex items-center space-x-3 p-5 border border-gray-300 hover:border-black transition rounded-none cursor-pointer opacity-60">
                          <RadioGroupItem value="vnpay" id="vnpay" disabled />
                          <Label
                            htmlFor="vnpay"
                            className="flex-1 cursor-pointer"
                          >
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-3">
                                <Building2 className="w-5 h-5 text-black" />
                                <div>
                                  <p className="font-light text-sm uppercase tracking-wider text-black">
                                    VNPay
                                  </p>
                                  <p className="text-xs text-gray-600 font-light mt-1">
                                    Thanh toán qua cổng VNPay
                                  </p>
                                </div>
                              </div>
                            </div>
                          </Label>
                        </div>

                        {/* QR Code */}
                        <div className="flex items-center space-x-3 p-5 border border-gray-300 hover:border-black transition rounded-none cursor-pointer opacity-60">
                          <RadioGroupItem value="qr" id="qr" disabled />
                          <Label htmlFor="qr" className="flex-1 cursor-pointer">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-3">
                                <QrCode className="w-5 h-5 text-black" />
                                <div>
                                  <p className="font-light text-sm uppercase tracking-wider text-black">
                                    Quét mã QR
                                  </p>
                                  <p className="text-xs text-gray-600 font-light mt-1">
                                    Thanh toán bằng cách quét mã QR
                                  </p>
                                </div>
                              </div>
                            </div>
                          </Label>
                        </div>
                      </RadioGroup>
                    </div>

                    {/* Customer Note */}
                    <div className="bg-white p-8 border border-gray-300 rounded-none">
                      <div className="flex items-center gap-3 mb-6">
                        <div className="w-12 h-12 bg-gray-50 border border-gray-200 flex items-center justify-center rounded-none">
                          <MapPin className="w-6 h-6 text-black" />
                        </div>
                        <div>
                          <h2 className="text-2xl font-light text-black uppercase tracking-wider">
                            Ghi chú đơn hàng
                          </h2>
                          <p className="text-xs text-gray-500 font-light mt-1">
                            Thêm ghi chú cho đơn hàng của bạn (tùy chọn)
                          </p>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Textarea
                          placeholder="Ví dụ: Giao hàng vào buổi sáng, gọi điện trước khi giao, để ở cổng..."
                          value={customerNote}
                          onChange={(e) => setCustomerNote(e.target.value)}
                          className="min-h-[100px] text-xs font-light rounded-none border-gray-300 resize-none"
                          maxLength={500}
                        />
                        <p className="text-xs text-gray-500 font-light">
                          {customerNote.length}/500 ký tự
                        </p>
                      </div>
                    </div>

                    <div className="flex gap-4">
                      <Button
                        variant="outline"
                        onClick={() => setStep(1)}
                        className="flex-1 rounded-none text-xs font-light uppercase tracking-wider border-gray-300 hover:border-black h-11"
                      >
                        <ArrowLeft className="w-4 h-4 mr-2" />
                        Quay lại
                      </Button>
                      <Button
                        onClick={handleContinueToStep3}
                        disabled={!paymentMethod}
                        variant="default"
                        className="flex-1 rounded-none text-xs font-light uppercase tracking-wider bg-white hover:bg-gray-900 h-11"
                      >
                        Tiếp tục
                      </Button>
                    </div>
                  </motion.div>
                )}

                {/* Step 3: Review & Confirm */}
                {step === 3 && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.3 }}
                    className="bg-white p-8 border border-gray-300 rounded-none"
                  >
                    <div className="flex items-center gap-3 mb-8">
                      <div className="w-12 h-12 bg-gray-50 border border-gray-200 flex items-center justify-center rounded-none">
                        <Lock className="w-6 h-6 text-black" />
                      </div>
                      <div>
                        <h2 className="text-2xl font-light text-black uppercase tracking-wider">
                          Xác nhận đơn hàng
                        </h2>
                        <p className="text-xs text-gray-500 font-light mt-1">
                          Kiểm tra lại thông tin trước khi đặt hàng
                        </p>
                      </div>
                    </div>

                    <div className="space-y-6">
                      {/* Shipping Address Summary */}
                      <div>
                        <h3 className="text-sm font-light text-black uppercase tracking-wide mb-3">
                          Địa chỉ giao hàng
                        </h3>
                        <div className="p-4 bg-gray-50 border border-gray-200 rounded-none">
                          <p className="font-light text-sm text-black">
                            {shippingAddress.fullName}
                          </p>
                          <p className="font-light text-sm text-gray-600 mt-1">
                            {shippingAddress.phone}
                          </p>
                          <p className="font-light text-sm text-gray-600 mt-1">
                            {shippingAddress.address}, {shippingAddress.ward},{" "}
                            {shippingAddress.district},{" "}
                            {shippingAddress.province}
                          </p>
                        </div>
                      </div>

                      {/* Payment Summary */}
                      <div>
                        <h3 className="text-sm font-light text-black uppercase tracking-wide mb-3">
                          Phương thức thanh toán
                        </h3>
                        <div className="p-4 bg-gray-50 border border-gray-200 rounded-none">
                          <p className="font-light text-sm text-black">
                            {paymentMethod === "cod" &&
                              "Thanh toán khi nhận hàng (COD)"}
                            {paymentMethod === "stripe" &&
                              "Thẻ tín dụng/Ghi nợ (Stripe)"}
                            {paymentMethod === "momo" && "Ví điện tử MoMo"}
                            {paymentMethod === "vnpay" && "VNPay"}
                            {paymentMethod === "qr" && "Quét mã QR"}
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="flex gap-4 mt-8">
                      <Button
                        variant="outline"
                        onClick={() => setStep(2)}
                        className="flex-1 rounded-none text-xs font-light uppercase tracking-wider border-gray-300 hover:border-black h-11"
                      >
                        <ArrowLeft className="w-4 h-4 mr-2" />
                        Quay lại
                      </Button>
                      <Button
                        onClick={handleCheckout}
                        disabled={loading}
                        variant="default"
                        className="flex-1 rounded-none text-xs font-light uppercase tracking-wider bg-white hover:bg-gray-900 h-11"
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
                              : "Thanh toán"}
                          </>
                        )}
                      </Button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Order Summary Sidebar */}
            <div className="lg:col-span-1">
              <div className="bg-white p-6 border border-gray-300 sticky top-4 rounded-none">
                <h2 className="text-sm font-light text-black mb-6 uppercase tracking-wider">
                  Tóm tắt đơn hàng
                </h2>

                <div className="space-y-4 mb-6 max-h-[400px] overflow-y-auto">
                  {cart.items.map((item) => (
                    <div
                      key={item.cartItemId}
                      className="flex gap-3 pb-4 border-b border-gray-200 last:border-0"
                    >
                      <div className="w-20 h-20 bg-gray-100 shrink-0 border border-gray-200">
                        <img
                          src={item.images?.[0]?.url || "/placeholder.svg"}
                          alt={item.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-light text-xs text-black line-clamp-2 uppercase tracking-wide">
                          {item.name}
                        </p>
                        <p className="text-xs font-light text-gray-600 mt-1">
                          {item.size?.name} / {item.color?.name}
                        </p>
                        <div className="flex items-center justify-between mt-2">
                          <div className="flex items-center gap-2 border border-gray-300">
                            <button
                              onClick={() =>
                                cart.decreaseQuantity(item.cartItemId)
                              }
                              className="p-1 hover:bg-gray-100 transition-colors"
                              disabled={item.quantity <= 1}
                            >
                              <Minus className="w-3 h-3 text-black" />
                            </button>
                            <span className="text-xs font-light text-black px-2 min-w-8 text-center">
                              {item.quantity}
                            </span>
                            <button
                              onClick={() =>
                                cart.increaseQuantity(item.cartItemId)
                              }
                              className="p-1 hover:bg-gray-100 transition-colors"
                            >
                              <Plus className="w-3 h-3 text-black" />
                            </button>
                          </div>
                          <button
                            onClick={() => cart.removeItem(item.cartItemId)}
                            className="p-1 hover:bg-red-50 transition-colors"
                          >
                            <Trash2 className="w-4 h-4 text-red-500" />
                          </button>
                        </div>
                        <p className="text-sm font-light text-black mt-2">
                          <Currency value={item.price * item.quantity} />
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                <Separator className="bg-gray-300" />

                <div className="space-y-3 mt-6">
                  <div className="flex justify-between text-gray-600 text-xs font-light">
                    <span>Tạm tính:</span>
                    <span>
                      <Currency value={subtotal} />
                    </span>
                  </div>
                  {discount > 0 && appliedCoupon && (
                    <div className="flex justify-between text-green-600 text-xs font-light">
                      <span>Giảm giá ({appliedCoupon.code}):</span>
                      <span>
                        -<Currency value={discount} />
                      </span>
                    </div>
                  )}
                  <div className="flex justify-between text-gray-600 text-xs font-light">
                    <span>
                      Phí vận chuyển (
                      {shippingMethod === "express" ? "Nhanh" : "Tiêu chuẩn"}):
                    </span>
                    <span>
                      {shippingFee === 0 ? (
                        <span className="text-black">Miễn phí</span>
                      ) : (
                        <Currency value={shippingFee} />
                      )}
                    </span>
                  </div>
                  <Separator className="bg-gray-300" />
                  <div className="flex justify-between text-base font-medium text-black">
                    <span>Tổng cộng:</span>
                    <span>
                      <Currency value={finalTotal} />
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Container>
    </div>
  );
}
