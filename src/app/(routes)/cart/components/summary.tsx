"use client";

import { Button } from "@/components/ui/button";
import Currency from "@/components/ui/currency";
import useCart from "@/hooks/use-cart";
import axios from "axios";
import { useSearchParams } from "next/navigation";
import { useEffect } from "react";
import { toast } from "react-hot-toast";

const Summary = () => {
  const searchParams = useSearchParams();
  const items = useCart((state) => state.items);
  const removeAll = useCart((state) => state.removeAll);
  const cart = useCart();
  const totalPrice = cart.items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  useEffect(() => {
    if (searchParams.get("success")) {
      toast.success("Payment completed.");
      removeAll();
    }
    if (searchParams.get("canceled")) {
      toast.error("Something went wrong.");
    }
  }, [searchParams, removeAll]);

  const onCheckout = async () => {
    const response = await axios.post(
      `${process.env.NEXT_PUBLIC_API_URL}/checkout`,
      {
        productIds: items.map((item) => item.id),
      }
    );

    window.location = response.data.url;
  };

  return (
    <div>
      <div className="px-4 py-6 mt-16 rounded-lg bg-gray-50 sm:p-6 lg:col-span-5 lg:mt-0 lg:p-8">
        <h2 className="text-lg font-medium text-gray-900">Order Summary</h2>
        <div className="mt-6 space-y-4">
          <div className="flex items-center justify-between pt-4 border-t border-gray-200">
            <div className="text-base font-medium text-gray-400">
              Order Total
            </div>
            <Currency value={totalPrice} />
          </div>
        </div>
        <Button
          variant="outline"
          disabled={items.length === 0}
          className="w-full mt-6"
          onClick={onCheckout}
        >
          Checkout
        </Button>
      </div>
      <div className="mt-8 rounded-xl border border-blue-200 bg-blue-50 p-4 flex items-start gap-3 shadow-sm ">
        <div className="flex-shrink-0">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5 text-blue-600"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M13 16h-1v-4h1m0-4h-1m0 12a9 9 0 110-18 9 9 0 010 18z"
            />
          </svg>
        </div>

        <p className="text-sm text-blue-800 leading-6">
          <span className="font-semibold">Chính sách mua hàng</span>
          <br />
          Hiện chúng tôi chỉ áp dụng thanh toán với đơn hàng có giá trị tối
          thiểu <span className="font-medium">40.000₫</span> trở lên.
        </p>
      </div>
    </div>
  );
};

export default Summary;
