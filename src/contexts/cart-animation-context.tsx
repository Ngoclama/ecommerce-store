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
        // Priority 1: Tìm bằng data attribute (most reliable)
        let cartIcon = document.querySelector(
          'button[data-cart-icon="true"]'
        ) as HTMLElement;

        // Priority 2: Tìm bằng ID
        if (!cartIcon) {
          cartIcon = document.getElementById("cart-icon-button") as HTMLElement;
        }

        // Priority 3: Tìm bằng aria-label (various languages)
        if (!cartIcon) {
          cartIcon = document.querySelector(
            'button[aria-label="Giỏ hàng"], button[aria-label="Open shopping bag"], button[aria-label="Cart"]'
          ) as HTMLElement;
        }

        // Priority 4: Fallback - tìm button có ShoppingBag/ShoppingCart icon
        if (!cartIcon) {
          const buttons = Array.from(document.querySelectorAll("button"));
          const foundButton = buttons.find((btn) => {
            const svg = btn.querySelector("svg");
            if (!svg) return false;

            // Check for cart-related aria-label (various languages)
            const ariaLabel =
              btn.getAttribute("aria-label")?.toLowerCase() || "";
            const hasCartAriaLabel =
              ariaLabel.includes("cart") ||
              ariaLabel.includes("giỏ") ||
              ariaLabel.includes("bag");

            // Check for cart-related class
            const hasCartClass = btn.className.toLowerCase().includes("cart");

            // Check if button is near cart count badge
            const hasCartBadge = btn.querySelector('span[class*="absolute"]');

            return hasCartAriaLabel || hasCartClass || hasCartBadge;
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
        // Retry với multiple attempts
        let retryCount = 0;
        const maxRetries = 5;
        const retryDelay = 50;

        const retryFindCartIcon = () => {
          retryCount++;
          cartIcon = findCartIcon();

          if (cartIcon) {
            // Debug log
            if (process.env.NODE_ENV === "development") {
              console.log(
                "[CartAnimation] Triggering animation (after retry)",
                {
                  fromElement,
                  toElement: cartIcon,
                  imageUrl,
                  retryCount,
                }
              );
            }

            setAnimationState({
              imageUrl,
              fromElement,
              toElement: cartIcon,
            });
          } else if (retryCount < maxRetries) {
            // Continue retrying
            setTimeout(retryFindCartIcon, retryDelay);
          } else {
            // Final attempt failed - log warning but don't block the add to cart action
            console.warn("[CartAnimation] Cart icon not found after retry", {
              attempts: retryCount,
              selectors: [
                'button[data-cart-icon="true"]',
                "#cart-icon-button",
                'button[aria-label="Giỏ hàng"]',
              ],
            });
            // Don't return - allow the cart to update even without animation
          }
        };

        setTimeout(retryFindCartIcon, retryDelay);
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
  if (!context) {
    return {
      triggerAnimation: () => {
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
