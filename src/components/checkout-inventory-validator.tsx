"use client";

import {
  useInventoryValidation,
  getInventoryErrorMessage,
} from "@/hooks/use-inventory-validation";
import { useCallback, useEffect, useState } from "react";
import { AlertCircle, Loader2 } from "lucide-react";
import { toast } from "sonner";

interface CheckoutInventoryValidatorProps {
  cartItems: any[];
  onValidationComplete?: (isValid: boolean) => void;
  showAlert?: boolean;
}

/**
 * Component validate tồn kho trước khi checkout
 * Kiểm tra toàn bộ giỏ hàng có đủ tồn kho không
 */
export const CheckoutInventoryValidator: React.FC<
  CheckoutInventoryValidatorProps
> = ({ cartItems, onValidationComplete, showAlert = true }) => {
  const { validateCart, isValidating } = useInventoryValidation();
  const [validationResult, setValidationResult] = useState<any>(null);
  const [isChecking, setIsChecking] = useState(false);

  // Validate giỏ hàng khi component mount hoặc items thay đổi
  const checkInventory = useCallback(async () => {
    if (!cartItems || cartItems.length === 0) {
      setValidationResult(null);
      onValidationComplete?.(true);
      return;
    }

    setIsChecking(true);
    try {
      const result = await validateCart(
        cartItems.map((item) => ({
          id: item.id,
          productId: item.productId,
          variantId: item.variantId,
          quantity: item.quantity,
          productName: item.name,
          sizeName: item.sizeName,
          colorName: item.colorName,
        })),
      );

      setValidationResult(result);
      onValidationComplete?.(result.isValid);

      // Show toast nếu có lỗi
      if (!result.isValid && showAlert) {
        result.errors.forEach((error: any) => {
          const message = getInventoryErrorMessage(
            error.reason,
            error.productName,
            error.availableQuantity,
            error.requestedQuantity,
          );
          toast.error(message);
        });
      }
    } catch (err) {
      console.error("[CHECKOUT_VALIDATION] Error:", err);
      toast.error("Lỗi khi kiểm tra tồn kho. Vui lòng thử lại!");
      setValidationResult(null);
      onValidationComplete?.(false);
    } finally {
      setIsChecking(false);
    }
  }, [cartItems, validateCart, onValidationComplete, showAlert]);

  // Auto validate khi items thay đổi
  useEffect(() => {
    const timer = setTimeout(() => {
      checkInventory();
    }, 500);

    return () => clearTimeout(timer);
  }, [cartItems, checkInventory]);

  // Không display UI nếu validation hợp lệ
  if (!validationResult || validationResult.isValid) {
    return null;
  }

  // Hiển thị errors
  return (
    <div className="bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-800 rounded-lg p-4 mb-4">
      <div className="flex items-start gap-3">
        <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400 shrink-0 mt-0.5" />
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-red-700 dark:text-red-300 mb-2">
            ❌ {validationResult.errors.length} sản phẩm có vấn đề tồn kho
          </h3>
          <ul className="space-y-2">
            {validationResult.errors.map((error: any, idx: number) => (
              <li
                key={`${error.itemId}-${idx}`}
                className="text-sm text-red-600 dark:text-red-400"
              >
                <span className="font-medium">• {error.productName}:</span>{" "}
                {error.reason === "out_of_stock"
                  ? "Không còn hàng"
                  : `Chỉ còn ${error.availableQuantity}, bạn chọn ${error.requestedQuantity}`}
              </li>
            ))}
          </ul>
          <p className="text-xs text-red-500 dark:text-red-400 mt-2 italic">
            Vui lòng cập nhật giỏ hàng trước khi thanh toán
          </p>
        </div>
      </div>
    </div>
  );
};

export default CheckoutInventoryValidator;
