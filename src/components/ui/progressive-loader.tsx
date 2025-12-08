/**
 * Progressive Loader Component
 * Hiển thị loading state với progressive enhancement
 */

"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface ProgressiveLoaderProps {
  className?: string;
  size?: "sm" | "md" | "lg";
  variant?: "spinner" | "skeleton" | "dots";
}

export function ProgressiveLoader({
  className,
  size = "md",
  variant = "spinner",
}: ProgressiveLoaderProps) {
  const sizeClasses = {
    sm: "w-4 h-4",
    md: "w-6 h-6",
    lg: "w-8 h-8",
  };

  if (variant === "dots") {
    return (
      <div className={cn("flex items-center gap-1", className)}>
        {[0, 1, 2].map((i) => (
          <motion.div
            key={i}
            className={cn(
              "rounded-full bg-current",
              size === "sm"
                ? "w-1.5 h-1.5"
                : size === "md"
                ? "w-2 h-2"
                : "w-2.5 h-2.5"
            )}
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.5, 1, 0.5],
            }}
            transition={{
              duration: 0.6,
              repeat: Infinity,
              delay: i * 0.2,
            }}
          />
        ))}
      </div>
    );
  }

  if (variant === "skeleton") {
    return (
      <div
        className={cn(
          "animate-pulse bg-gray-200 dark:bg-gray-700 rounded",
          className
        )}
      />
    );
  }

  return (
    <motion.div
      className={cn(
        "border-2 border-current border-t-transparent rounded-full",
        sizeClasses[size],
        className
      )}
      animate={{ rotate: 360 }}
      transition={{
        duration: 0.8,
        repeat: Infinity,
        ease: "linear",
      }}
    />
  );
}


export function InlineLoader({
  text = "Đang tải...",
  className,
}: {
  text?: string;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400",
        className
      )}
    >
      <ProgressiveLoader size="sm" variant="dots" />
      <span>{text}</span>
    </div>
  );
}
