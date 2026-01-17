import { useCallback } from "react";

export interface OrderItemInput {
  productId: string;
  variantId: string;
  productName: string;
  quantity: number;
  price: number;
}

export interface CreateOrderInput {
  userId: string;
  storeId: string;
  orderItems: OrderItemInput[];
  shippingAddress: string;
  phoneNumber: string;
  email: string;
  paymentMethod: "stripe" | "momo" | "vnpay" | "cod";
}

/**
 * Hook để tạo order và trừ tồn kho
 * Được gọi TRƯỚC khi thanh toán
 */
export const useCreateOrder = () => {
  const createOrder = useCallback(async (input: CreateOrderInput) => {
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL;
      if (!apiUrl) {
        throw new Error("NEXT_PUBLIC_API_URL is not configured");
      }

      const normalizedApiUrl = apiUrl.replace(/\/$/, "");
      const orderUrl = `${normalizedApiUrl}/api/orders`;

      console.log("[ORDER_CREATE] Calling:", orderUrl);
      console.log("[ORDER_CREATE] Data:", input);

      const response = await fetch(orderUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(input),
      });

      const responseText = await response.text();
      console.log("[ORDER_CREATE] Response status:", response.status);
      console.log("[ORDER_CREATE] Response text:", responseText);

      let result;
      try {
        result = JSON.parse(responseText);
      } catch (parseError) {
        throw new Error(
          `API returned invalid JSON: ${response.status} ${responseText}`,
        );
      }

      if (!response.ok) {
        throw new Error(result.message || `API error: ${response.status}`);
      }

      console.log("[ORDER_CREATE_SUCCESS]", result.data);
      return { success: true, order: result.data };
    } catch (error) {
      console.error("[ORDER_CREATE_ERROR]", error);
      return {
        success: false,
        error:
          error instanceof Error ? error.message : "Unknown error occurred",
      };
    }
  }, []);

  return { createOrder };
};
