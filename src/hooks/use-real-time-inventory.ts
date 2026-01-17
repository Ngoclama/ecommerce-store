import { useState, useEffect, useCallback } from "react";

interface InventoryStatus {
  variantId: string;
  inventory: number;
  isOutOfStock: boolean;
  isLowStock: boolean;
  lastUpdated: Date;
}

/**
 * Hook để theo dõi tồn kho real-time
 * Cập nhật mỗi 5 giây từ API
 */
export function useRealTimeInventory(
  productId: string,
  variantIds: string[] = [],
) {
  const [inventoryMap, setInventoryMap] = useState<
    Map<string, InventoryStatus>
  >(new Map());
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch inventory từ API
  const fetchInventory = useCallback(async () => {
    if (!productId) return;

    try {
      setIsLoading(true);
      setError(null);

      // Timestamp để bypass cache
      const timestamp = Date.now();
      const baseUrl = process.env.NEXT_PUBLIC_API_URL;
      const url = `${baseUrl}/api/products/${productId}?_t=${timestamp}`;

      const response = await fetch(url, {
        method: "GET",
        headers: {
          "Cache-Control": "no-cache, no-store, must-revalidate",
          Pragma: "no-cache",
        },
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch inventory: ${response.status}`);
      }

      const product = await response.json();

      // Map variants to inventory status
      const newMap = new Map<string, InventoryStatus>();

      if (product.variants && Array.isArray(product.variants)) {
        product.variants.forEach((variant: any) => {
          const inventory = variant.inventory || 0;
          const isOutOfStock = inventory <= 0;
          const isLowStock = inventory > 0 && inventory <= 5;

          newMap.set(variant.id, {
            variantId: variant.id,
            inventory,
            isOutOfStock,
            isLowStock,
            lastUpdated: new Date(),
          });
        });
      }

      setInventoryMap(newMap);
    } catch (err) {
      console.error("[REAL_TIME_INVENTORY] Error:", err);
      setError(err instanceof Error ? err.message : "Unknown error");
    } finally {
      setIsLoading(false);
    }
  }, [productId]);

  // Poll inventory mỗi 5 giây
  useEffect(() => {
    // Fetch ngay lập tức
    fetchInventory();

    // Rồi poll mỗi 5 giây
    const interval = setInterval(() => {
      fetchInventory();
    }, 5000);

    return () => clearInterval(interval);
  }, [fetchInventory]);

  // Get inventory cho một variant cụ thể
  const getInventory = useCallback(
    (variantId: string) => {
      return (
        inventoryMap.get(variantId) || {
          variantId,
          inventory: 0,
          isOutOfStock: true,
          isLowStock: false,
          lastUpdated: new Date(),
        }
      );
    },
    [inventoryMap],
  );

  // Check xem variant còn hàng không
  const isVariantAvailable = useCallback(
    (variantId: string): boolean => {
      const status = inventoryMap.get(variantId);
      return status ? status.inventory > 0 : false;
    },
    [inventoryMap],
  );

  // Lấy tất cả variants hết hàng
  const getOutOfStockVariants = useCallback(() => {
    return Array.from(inventoryMap.values()).filter(
      (status) => status.isOutOfStock,
    );
  }, [inventoryMap]);

  return {
    inventoryMap,
    isLoading,
    error,
    getInventory,
    isVariantAvailable,
    getOutOfStockVariants,
    refetch: fetchInventory,
  };
}
