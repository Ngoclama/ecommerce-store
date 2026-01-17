"use client";

import { useRealTimeInventory } from "@/hooks/use-real-time-inventory";
import { AlertCircle, TrendingDown, CheckCircle2 } from "lucide-react";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

interface InventoryStatusProps {
  productId: string;
  variantId?: string;
  selectedSizeId?: string;
  selectedColorId?: string;
  sizeName?: string;
  colorName?: string;
}

/**
 * Component hiển thị trạng thái tồn kho real-time
 * - Xanh: Còn hàng
 * - Vàng: Sắp hết (<=5)
 * - Đỏ: Hết hàng
 */
export const InventoryStatus: React.FC<InventoryStatusProps> = ({
  productId,
  variantId,
  selectedSizeId,
  selectedColorId,
  sizeName,
  colorName,
}) => {
  const { inventoryMap, isLoading, error, getInventory } =
    useRealTimeInventory(productId);
  const [lastStatus, setLastStatus] = useState<{
    inventory: number;
    isOutOfStock: boolean;
    isLowStock: boolean;
  } | null>(null);

  // Update status khi inventory thay đổi
  useEffect(() => {
    if (variantId) {
      const status = getInventory(variantId);
      setLastStatus({
        inventory: status.inventory,
        isOutOfStock: status.isOutOfStock,
        isLowStock: status.isLowStock,
      });
    }
  }, [variantId, inventoryMap, getInventory]);

  if (!lastStatus) {
    return null;
  }

  const { inventory, isOutOfStock, isLowStock } = lastStatus;

  // Hết hàng
  if (isOutOfStock) {
    return (
      <div className="mt-4 p-3 bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-800 rounded-lg flex items-start gap-3">
        <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400 shrink-0 mt-0.5" />
        <div className="flex-1">
          <p className="text-sm font-semibold text-red-700 dark:text-red-300">
            ❌ Hết hàng
          </p>
          <p className="text-xs text-red-600 dark:text-red-400 mt-1">
            {selectedSizeId && selectedColorId
              ? `Kích cỡ: ${sizeName}, Màu: ${colorName} hiện không còn sẵn`
              : "Sản phẩm này hiện không còn hàng. Vui lòng kiểm tra lại sau"}
          </p>
        </div>
      </div>
    );
  }

  // Sắp hết (<=5 cái)
  if (isLowStock) {
    return (
      <div className="mt-4 p-3 bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 rounded-lg flex items-start gap-3 animate-pulse">
        <TrendingDown className="w-5 h-5 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
        <div className="flex-1">
          <p className="text-sm font-semibold text-amber-700 dark:text-amber-300">
            ⚠️ Sắp hết hàng
          </p>
          <p className="text-xs text-amber-600 dark:text-amber-400 mt-1">
            Chỉ còn <span className="font-bold">{inventory} sản phẩm</span>. Mua
            ngay nếu bạn yêu thích!
          </p>
        </div>
      </div>
    );
  }

  // Còn hàng
  return (
    <div className="mt-4 p-3 bg-green-50 dark:bg-green-950/30 border border-green-200 dark:border-green-800 rounded-lg flex items-start gap-3">
      <CheckCircle2 className="w-5 h-5 text-green-600 dark:text-green-400 shrink-0 mt-0.5" />
      <div className="flex-1">
        <p className="text-sm font-semibold text-green-700 dark:text-green-300">
          ✅ Còn hàng
        </p>
        <p className="text-xs text-green-600 dark:text-green-400 mt-1">
          Còn <span className="font-bold">{inventory} sản phẩm</span> trong kho
        </p>
      </div>
    </div>
  );
};

export default InventoryStatus;
