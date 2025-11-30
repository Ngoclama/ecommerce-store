"use client";

import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { ReactNode } from "react";

interface PageTransitionProps {
  children: ReactNode;
}

export function PageTransition({ children }: PageTransitionProps) {
  const pathname = usePathname();

  return (
    <AnimatePresence mode="wait" initial={false}>
      <motion.div
        key={pathname}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -10 }}
        transition={{
          duration: 0.25,
          ease: [0.4, 0, 0.2, 1], // Smooth cubic-bezier easing
        }}
        style={{ willChange: "opacity, transform" }}
        className="w-full"
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
}

