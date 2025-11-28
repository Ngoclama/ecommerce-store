"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { createPortal } from "react-dom";

interface CartAnimationProps {
  imageUrl: string;
  fromElement: HTMLElement | null;
  toElement: HTMLElement | null;
  onComplete: () => void;
}

export const CartAnimation: React.FC<CartAnimationProps> = ({
  imageUrl,
  fromElement,
  toElement,
  onComplete,
}) => {
  const [positions, setPositions] = useState<{
    start: { x: number; y: number };
    end: { x: number; y: number };
  } | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!fromElement || !toElement || !mounted) return;

    // Sử dụng requestAnimationFrame để đảm bảo DOM đã render xong
    const updatePositions = () => {
      const fromRect = fromElement.getBoundingClientRect();
      const toRect = toElement.getBoundingClientRect();

      const startPos = {
        x: fromRect.left + fromRect.width / 2,
        y: fromRect.top + fromRect.height / 2,
      };
      const endPos = {
        x: toRect.left + toRect.width / 2,
        y: toRect.top + toRect.height / 2,
      };

      if (process.env.NODE_ENV === "development") {
        console.log("[CartAnimation] Positions calculated", {
          startPos,
          endPos,
        });
      }

      setPositions({
        start: startPos,
        end: endPos,
      });
    };

    // Sử dụng requestAnimationFrame để đảm bảo layout đã được tính toán
    requestAnimationFrame(() => {
      requestAnimationFrame(updatePositions);
    });
  }, [fromElement, toElement, mounted]);

  if (!mounted || !fromElement || !toElement || !positions) {
    if (process.env.NODE_ENV === "development") {
      console.log("[CartAnimation] Not rendering:", {
        mounted,
        hasFromElement: !!fromElement,
        hasToElement: !!toElement,
        hasPositions: !!positions,
      });
    }
    return null;
  }

  if (process.env.NODE_ENV === "development") {
    console.log(
      "[CartAnimation] Rendering animation with positions:",
      positions
    );
  }

  return createPortal(
    <AnimatePresence>
      <motion.div
        key="cart-animation"
        initial={{
          x: positions.start.x,
          y: positions.start.y,
          scale: 1,
          opacity: 1,
        }}
        animate={{
          x: positions.end.x,
          y: positions.end.y,
          scale: 0.3,
          opacity: 0.8,
        }}
        exit={{
          scale: 0,
          opacity: 0,
        }}
        transition={{
          duration: 0.6,
          ease: [0.25, 0.46, 0.45, 0.94],
        }}
        onAnimationStart={() => {
          if (process.env.NODE_ENV === "development") {
            console.log("[CartAnimation] Animation started");
          }
        }}
        onAnimationComplete={onComplete}
        className="fixed z-[9999] pointer-events-none"
        style={{
          left: 0,
          top: 0,
          transform: "translate(-50%, -50%)",
        }}
      >
        <div className="relative w-16 h-16 rounded-lg overflow-hidden border-2 border-gray-300 shadow-lg bg-white">
          <Image
            src={imageUrl}
            alt="Product"
            fill
            className="object-cover"
            unoptimized
          />
        </div>
      </motion.div>
    </AnimatePresence>,
    document.body
  );
};
