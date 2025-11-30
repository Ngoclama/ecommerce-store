"use client";

import { cn } from "@/lib/utils";
import { CSSProperties } from "react";

interface ProgressiveBlurProps {
  className?: string;
  direction?: "left" | "right";
  blurIntensity?: number;
}

export function ProgressiveBlur({
  className,
  direction = "left",
  blurIntensity = 1,
}: ProgressiveBlurProps) {
  const lightStyle: CSSProperties = {
    background: `linear-gradient(to ${direction}, transparent, rgba(255, 255, 255, 0.8) ${
      blurIntensity * 100
    }%)`,
  };

  if (direction === "right") {
    lightStyle.background = `linear-gradient(to right, rgba(255, 255, 255, 0.8) ${
      blurIntensity * 100
    }%, transparent)`;
  }

  const darkStyle: CSSProperties = {
    background: `linear-gradient(to ${direction}, transparent, rgba(17, 24, 39, 0.8) ${
      blurIntensity * 100
    }%)`,
  };

  if (direction === "right") {
    darkStyle.background = `linear-gradient(to right, rgba(17, 24, 39, 0.8) ${
      blurIntensity * 100
    }%, transparent)`;
  }

  return (
    <>
      <div
        className={cn("absolute inset-0 dark:hidden", className)}
        style={lightStyle}
      />
      <div
        className={cn("absolute inset-0 hidden dark:block", className)}
        style={darkStyle}
      />
    </>
  );
}
