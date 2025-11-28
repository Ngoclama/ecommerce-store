"use client";

import React, { createContext, useContext, useState, useCallback } from "react";
import { CartAnimation } from "@/components/cart-animation";

interface CartAnimationContextType {
  triggerAnimation: (imageUrl: string, fromElement: HTMLElement | null) => void;
}

const CartAnimationContext = createContext<
  CartAnimationContextType | undefined
>(undefined);

export const CartAnimationProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [animationState, setAnimationState] = useState<{
    imageUrl: string;
    fromElement: HTMLElement | null;
    toElement: HTMLElement | null;
  } | null>(null);

  const triggerAnimation = useCallback(
    (imageUrl: string, fromElement: HTMLElement | null) => {
      if (!fromElement) {
        console.warn("[CartAnimation] fromElement is null");
        return;
      }

      // Hàm tìm cart icon với retry
      const findCartIcon = (): HTMLElement | null => {
        // Tìm cart icon element bằng aria-label
        let cartIcon = document.querySelector(
          'button[aria-label="Open shopping bag"]'
        ) as HTMLElement;

        if (!cartIcon) {
          // Fallback: tìm button có ShoppingCart icon
          const buttons = Array.from(document.querySelectorAll("button"));
          const foundButton = buttons.find((btn) => {
            const svg = btn.querySelector("svg");
            if (!svg) return false;
            // Kiểm tra nếu button có class chứa "cart" hoặc có aria-label liên quan đến cart
            const hasCartClass =
              btn.className.includes("cart") ||
              btn.getAttribute("aria-label")?.toLowerCase().includes("cart");
            return hasCartClass;
          });

          if (foundButton) {
            cartIcon = foundButton as HTMLElement;
          }
        }

        return cartIcon;
      };

      // Thử tìm cart icon ngay lập tức
      let cartIcon = findCartIcon();

      // Nếu không tìm thấy, thử lại sau một chút (có thể DOM chưa render xong)
      if (!cartIcon) {
        setTimeout(() => {
          cartIcon = findCartIcon();
          if (!cartIcon) {
            console.warn("[CartAnimation] Cart icon not found after retry");
            return;
          }

          // Debug log
          if (process.env.NODE_ENV === "development") {
            console.log("[CartAnimation] Triggering animation (after retry)", {
              fromElement,
              toElement: cartIcon,
              imageUrl,
            });
          }

          setAnimationState({
            imageUrl,
            fromElement,
            toElement: cartIcon,
          });
        }, 50);
        return;
      }

      // Debug log
      if (process.env.NODE_ENV === "development") {
        console.log("[CartAnimation] Triggering animation", {
          fromElement,
          toElement: cartIcon,
          imageUrl,
        });
      }

      setAnimationState({
        imageUrl,
        fromElement,
        toElement: cartIcon,
      });
    },
    []
  );

  const handleComplete = () => {
    setAnimationState(null);
  };

  return (
    <CartAnimationContext.Provider value={{ triggerAnimation }}>
      {children}
      {animationState && (
        <CartAnimation
          key={`${animationState.imageUrl}-${Date.now()}`}
          imageUrl={animationState.imageUrl}
          fromElement={animationState.fromElement}
          toElement={animationState.toElement}
          onComplete={handleComplete}
        />
      )}
    </CartAnimationContext.Provider>
  );
};

export const useCartAnimation = () => {
  const context = useContext(CartAnimationContext);
  // Return a no-op function if context is not available
  // This allows components to work even without the provider
  if (!context) {
    return {
      triggerAnimation: () => {
        // No-op: animation not available
        if (process.env.NODE_ENV === "development") {
          console.warn(
            "[CartAnimation] Provider not found, animation disabled"
          );
        }
      },
    };
  }
  return context;
};
