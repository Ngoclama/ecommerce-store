"use client";

import { useEffect, useRef, ReactNode, useState } from "react";
import { motion, useAnimationFrame, useMotionTemplate, useMotionValue } from "framer-motion";

interface InfiniteSliderProps {
  children: ReactNode;
  speed?: number;
  speedOnHover?: number;
  gap?: number;
}

export function InfiniteSlider({
  children,
  speed = 40,
  speedOnHover = 20,
  gap = 112,
}: InfiniteSliderProps) {
  const sliderRef = useRef<HTMLDivElement>(null);
  const baseX = useMotionValue(0);
  const x = useMotionTemplate`${baseX}px`;
  const [hovered, setHovered] = useState(false);

  useAnimationFrame((t, delta) => {
    let moveBy = (speed / 100) * delta;
    if (hovered) {
      moveBy = (speedOnHover / 100) * delta;
    }

    baseX.set(baseX.get() - moveBy);

    const slider = sliderRef.current;
    if (slider) {
      const childrenArray = Array.from(slider.children) as HTMLElement[];
      if (childrenArray.length > 0) {
        const totalWidth = childrenArray.reduce(
          (acc, child) => acc + child.offsetWidth + gap,
          0
        );

        if (Math.abs(baseX.get()) >= totalWidth) {
          baseX.set(0);
        }
      }
    }
  });

  return (
    <div
      ref={sliderRef}
      className="flex"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <motion.div
        className="flex"
        style={{ x }}
      >
        {children}
      </motion.div>
      <motion.div
        className="flex"
        style={{ x }}
      >
        {children}
      </motion.div>
    </div>
  );
}

