"use client";

import { useEffect, useState } from "react";
import useCart from "@/hooks/use-cart";

export default function DebugWishlist() {
  const { wishlistItems } = useCart();
  const [localStorageData, setLocalStorageData] = useState<string>("");

  useEffect(() => {
    if (typeof window !== "undefined") {
      const data = localStorage.getItem("ecommerce-cart-wishlist-storage");
      setLocalStorageData(data || "No data");
    }
  }, [wishlistItems]);

  return (
    <div className="fixed bottom-4 right-4 bg-black/90 text-white p-4 rounded-lg max-w-md text-xs z-50">
      <h3 className="font-bold mb-2">Debug Wishlist</h3>
      <div className="space-y-2">
        <div>
          <strong>Zustand wishlistItems:</strong>
          <pre className="mt-1 bg-gray-800 p-2 rounded overflow-auto max-h-40">
            {JSON.stringify(wishlistItems, null, 2)}
          </pre>
        </div>
        <div>
          <strong>LocalStorage:</strong>
          <pre className="mt-1 bg-gray-800 p-2 rounded overflow-auto max-h-40">
            {localStorageData}
          </pre>
        </div>
      </div>
    </div>
  );
}
