"use client";

import { useState, useEffect } from "react";
import Container from "@/components/ui/container";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Separator } from "@/components/ui/separator";
import useCart from "@/hooks/use-cart";
import useAuth from "@/hooks/use-auth";
import { MapPin, Truck, CreditCard, Lock, Loader2 } from "lucide-react";
import Currency from "@/components/ui/currency";
import { toast } from "sonner";
import { useRouter, useSearchParams } from "next/navigation";
import { cn } from "@/lib/utils";
import axios from "axios";

export default function CheckoutPage() {
  const cart = useCart();
  const router = useRouter();
  const searchParams = useSearchParams();
  const { requireAuth, isAuthenticated } = useAuth();
  const [step, setStep] = useState(1);
  const [shippingMethod, setShippingMethod] = useState("standard");
  const [loading, setLoading] = useState(false);

  // Shipping address form state
  const [shippingAddress, setShippingAddress] = useState({
    fullName: "",
    phone: "",
    address: "",
    province: "",
    district: "",
    ward: "",
  });

  // Validation errors
  const [errors, setErrors] = useState<Record<string, string>>({});

  const totalPrice = cart.items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  // Calculate shipping fee based on method and total
  const getShippingFee = () => {
    if (totalPrice >= 500000) {
      return 0; // Free shipping for orders >= 500k
    }
    if (shippingMethod === "express") {
      return 50000; // Express shipping
    }
    return 30000; // Standard shipping
  };

  const shippingFee = getShippingFee();
  const finalTotal = totalPrice + shippingFee;

  // Handle success/cancel from Stripe
  useEffect(() => {
    if (searchParams.get("success")) {
      toast.success("Thanh toán thành công! Đơn hàng của bạn đang được xử lý.");
      cart.removeAll();
      router.push("/account/orders");
    }

    if (searchParams.get("canceled")) {
      toast.error("Thanh toán đã bị hủy. Vui lòng thử lại.");
    }
  }, [searchParams, cart, router]);

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
    } else {
      toast.error("Vui lòng điền đầy đủ thông tin địa chỉ giao hàng");
    }
  };

  const handleCheckout = async () => {
    // Validate cart
    if (cart.items.length === 0) {
      toast.error("Giỏ hàng trống");
      return;
    }

    // Require authentication
    if (!requireAuth("thanh toán")) {
      return;
    }

    // Validate shipping address again
    if (!validateShippingAddress()) {
      toast.error("Vui lòng kiểm tra lại thông tin địa chỉ giao hàng");
      setStep(1);
      return;
    }

    setLoading(true);

    try {
      // Call Stripe checkout API
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/api/checkout`,
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
            address: shippingAddress.address,
            province: shippingAddress.province,
            district: shippingAddress.district,
            ward: shippingAddress.ward,
          },
          shippingMethod: shippingMethod,
        }
      );

      if (response.data.url) {
        // Redirect to Stripe checkout
        window.location.href = response.data.url;
      } else {
        toast.error("Không thể tạo phiên thanh toán. Vui lòng thử lại.");
      }
    } catch (error: any) {
      console.error("[CHECKOUT_ERROR]", error);
      let errorMessage =
        "Có lỗi xảy ra khi thanh toán. Vui lòng kiểm tra lại tồn kho và trạng thái sản phẩm.";

      if (error.response?.data) {
        if (typeof error.response.data === "string") {
          errorMessage = error.response.data;
        } else if (error.response.data.message) {
          errorMessage = error.response.data.message;
        }
      } else if (error.message) {
        errorMessage = error.message;
      }

      toast.error(errorMessage);
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
        <div className="max-w-6xl mx-auto">
          <h1 className="text-4xl font-light text-black mb-8 uppercase tracking-wider">
            Thanh toán
          </h1>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-6">
              {/* Step 1: Shipping Address */}
              {step === 1 && (
                <div className="bg-white p-6 border border-gray-300 rounded-none">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-10 h-10 bg-gray-100 flex items-center justify-center rounded-none">
                      <MapPin className="w-5 h-5 text-black" />
                    </div>
                    <h2 className="text-xl font-light text-black uppercase tracking-wider">
                      Địa chỉ giao hàng
                    </h2>
                  </div>

                  <form
                    onSubmit={(e) => {
                      e.preventDefault();
                      handleContinueToStep2();
                    }}
                    className="space-y-4"
                  >
                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="fullName">
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
                            "rounded-none border-gray-300 focus-visible:ring-black",
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
                        <Label htmlFor="phone">
                          Số điện thoại <span className="text-red-500">*</span>
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
                            "rounded-none border-gray-300 focus-visible:ring-black",
                            errors.phone && "border-red-500"
                          )}
                        />
                        {errors.phone && (
                          <p className="text-xs text-red-500 font-light">
                            {errors.phone}
                          </p>
                        )}
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="address">
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
                          "rounded-none border-gray-300 focus-visible:ring-black",
                          errors.address && "border-red-500"
                        )}
                      />
                      {errors.address && (
                        <p className="text-xs text-red-500 font-light">
                          {errors.address}
                        </p>
                      )}
                    </div>
                    <div className="grid md:grid-cols-3 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="province">
                          Tỉnh/Thành phố <span className="text-red-500">*</span>
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
                            "rounded-none border-gray-300 focus-visible:ring-black",
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
                        <Label htmlFor="district">
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
                            "rounded-none border-gray-300 focus-visible:ring-black",
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
                        <Label htmlFor="ward">
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
                            "rounded-none border-gray-300 focus-visible:ring-black",
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
                      className="w-full rounded-none text-xs font-light uppercase tracking-wider border-black hover:bg-gray-800"
                    >
                      Tiếp tục
                    </Button>
                  </form>
                </div>
              )}

              {/* Step 2: Shipping Method */}
              {step === 2 && (
                <div className="bg-white p-6 border border-gray-300 rounded-none">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-10 h-10 bg-gray-100 flex items-center justify-center rounded-none">
                      <Truck className="w-5 h-5 text-black" />
                    </div>
                    <h2 className="text-xl font-light text-black uppercase tracking-wider">
                      Phương thức vận chuyển
                    </h2>
                  </div>

                  <RadioGroup
                    value={shippingMethod}
                    onValueChange={setShippingMethod}
                    className="space-y-4"
                  >
                    <div className="flex items-center space-x-2 p-4 border border-gray-300 hover:border-black transition rounded-none">
                      <RadioGroupItem value="standard" id="standard" />
                      <Label
                        htmlFor="standard"
                        className="flex-1 cursor-pointer"
                      >
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="font-light text-sm uppercase tracking-wider text-black">
                              Giao hàng tiêu chuẩn
                            </p>
                            <p className="text-xs text-gray-600 font-light">
                              3-5 ngày làm việc
                            </p>
                          </div>
                          <span className="font-light text-black text-sm">
                            {shippingFee === 0 ? "Miễn phí" : "30.000₫"}
                          </span>
                        </div>
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2 p-4 border border-gray-300 hover:border-black transition rounded-none">
                      <RadioGroupItem value="express" id="express" />
                      <Label
                        htmlFor="express"
                        className="flex-1 cursor-pointer"
                      >
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="font-light text-sm uppercase tracking-wider text-black">
                              Giao hàng nhanh
                            </p>
                            <p className="text-xs text-gray-600 font-light">
                              1-2 ngày làm việc
                            </p>
                          </div>
                          <span className="font-light text-black text-sm">
                            {totalPrice >= 500000 ? "Miễn phí" : "50.000₫"}
                          </span>
                        </div>
                      </Label>
                    </div>
                  </RadioGroup>

                  <div className="flex gap-4 mt-6">
                    <Button
                      variant="outline"
                      onClick={() => setStep(1)}
                      className="flex-1 rounded-none text-xs font-light uppercase tracking-wider border-gray-300 hover:border-black"
                    >
                      Quay lại
                    </Button>
                    <Button
                      onClick={handleCheckout}
                      disabled={loading}
                      variant="default"
                      className="flex-1 rounded-none text-xs font-light uppercase tracking-wider border-black hover:bg-gray-800"
                    >
                      {loading ? (
                        <>
                          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                          Đang xử lý...
                        </>
                      ) : (
                        <>
                          <Lock className="w-4 h-4 mr-2" />
                          Thanh toán với Stripe
                        </>
                      )}
                    </Button>
                  </div>
                </div>
              )}
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <div className="bg-white p-6 border border-gray-300 sticky top-4 rounded-none">
                <h2 className="text-sm font-light text-black mb-6 uppercase tracking-wider">
                  Tóm tắt đơn hàng
                </h2>

                <div className="space-y-4 mb-6">
                  {cart.items.map((item) => (
                    <div key={item.cartItemId} className="flex gap-3">
                      <div className="w-16 h-16 bg-gray-100 shrink-0 border border-gray-200">
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
                        <p className="text-xs font-light text-gray-600">
                          {item.size?.name} / {item.color?.name} x{" "}
                          {item.quantity}
                        </p>
                        <p className="text-sm font-light text-black mt-1">
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
                      <Currency value={totalPrice} />
                    </span>
                  </div>
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
                  <div className="flex justify-between text-base font-light text-black">
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
