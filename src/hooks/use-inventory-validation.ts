import { useState, useCallback } from "react";

interface CartItemWithVariant {
  id: string;
  productId: string;
  variantId?: string;
  quantity: number;
  productName: string;
  sizeName?: string;
  colorName?: string;
}

interface InventoryCheckResult {
  isValid: boolean;
  errors: {
    itemId: string;
    productName: string;
    reason: string; // "out_of_stock" | "insufficient_stock"
    availableQuantity: number;
    requestedQuantity: number;
  }[];
  message: string;
}

/**
 * Hook để validate tồn kho tại thời điểm checkout
 * Kiểm tra xem tất cả items có đủ hàng không
 */
export function useInventoryValidation() {
  const [isValidating, setIsValidating] = useState(false);
  const [lastCheckTime, setLastCheckTime] = useState<Date | null>(null);

  const validateCart = useCallback(
    async (items: CartItemWithVariant[]): Promise<InventoryCheckResult> => {
      if (!items || items.length === 0) {
        return {
          isValid: true,
          errors: [],
          message: "Giỏ hàng trống",
        };
      }

      try {
        setIsValidating(true);
        const baseUrl = process.env.NEXT_PUBLIC_API_URL;
        const timestamp = Date.now();

        // Fetch sản phẩm để kiểm tra inventory
        const inventoryErrors: InventoryCheckResult["errors"] = [];

        // Nhóm items theo productId
        const productGroups = new Map<string, typeof items>();
        items.forEach((item) => {
          const key = item.productId;
          if (!productGroups.has(key)) {
            productGroups.set(key, []);
          }
          productGroups.get(key)!.push(item);
        });

        // Check mỗi product
        for (const [productId, productItems] of productGroups) {
          try {
            const url = `${baseUrl}/api/products/${productId}?_t=${timestamp}`;
            const response = await fetch(url, {
              method: "GET",
              headers: {
                "Cache-Control": "no-cache, no-store, must-revalidate",
                Pragma: "no-cache",
              },
            });

            if (!response.ok) {
              // Nếu lấy API fail, coi như hết hàng để an toàn
              productItems.forEach((item) => {
                inventoryErrors.push({
                  itemId: item.id,
                  productName: item.productName,
                  reason: "out_of_stock",
                  availableQuantity: 0,
                  requestedQuantity: item.quantity,
                });
              });
              continue;
            }

            const product = await response.json();

            // Check mỗi item
            productItems.forEach((item) => {
              let availableQuantity = 0;

              if (item.variantId && product.variants) {
                // Có variant cụ thể
                const variant = product.variants.find(
                  (v: any) => v.id === item.variantId,
                );
                availableQuantity = variant?.inventory || 0;
              } else if (product.variants) {
                // Không có variant cụ thể, cộng toàn bộ
                availableQuantity = product.variants.reduce(
                  (sum: number, v: any) => sum + (v.inventory || 0),
                  0,
                );
              } else {
                availableQuantity = product.inventory || 0;
              }

              // Check nếu không đủ
              if (availableQuantity <= 0) {
                inventoryErrors.push({
                  itemId: item.id,
                  productName: item.productName,
                  reason: "out_of_stock",
                  availableQuantity: 0,
                  requestedQuantity: item.quantity,
                });
              } else if (availableQuantity < item.quantity) {
                inventoryErrors.push({
                  itemId: item.id,
                  productName: item.productName,
                  reason: "insufficient_stock",
                  availableQuantity,
                  requestedQuantity: item.quantity,
                });
              }
            });
          } catch (err) {
            console.error(
              "[INVENTORY_VALIDATION] Error checking product",
              productId,
              err,
            );
            // Lỗi → coi như hết hàng
            productItems.forEach((item) => {
              inventoryErrors.push({
                itemId: item.id,
                productName: item.productName,
                reason: "out_of_stock",
                availableQuantity: 0,
                requestedQuantity: item.quantity,
              });
            });
          }
        }

        setLastCheckTime(new Date());

        return {
          isValid: inventoryErrors.length === 0,
          errors: inventoryErrors,
          message:
            inventoryErrors.length === 0
              ? "Kiểm tra tồn kho thành công"
              : `${inventoryErrors.length} sản phẩm không đủ hàng`,
        };
      } finally {
        setIsValidating(false);
      }
    },
    [],
  );

  return {
    validateCart,
    isValidating,
    lastCheckTime,
  };
}

/**
 * Dạng thân thiện người dùng của error message
 */
export function getInventoryErrorMessage(
  reason: string,
  productName: string,
  availableQuantity: number,
  requestedQuantity: number,
): string {
  if (reason === "out_of_stock") {
    return `"${productName}" hiện không còn hàng`;
  }

  if (reason === "insufficient_stock") {
    return `"${productName}" chỉ còn ${availableQuantity} sản phẩm, nhưng bạn đã chọn ${requestedQuantity}`;
  }

  return `"${productName}" có vấn đề tồn kho`;
}
