/**
 * Optimized Animation Presets
 * Reduces over-animation and improves performance
 */

export const useReducedMotion = () => {
  if (typeof window === "undefined") return false;

  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
};

export const ANIMATION_PRESETS = {
  fadeIn: {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    transition: { duration: 0.3 },
  },

  fadeInSlow: {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    transition: { duration: 0.6 },
  },

  slideUp: {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.4 },
  },

  scaleIn: {
    initial: { opacity: 0, scale: 0.95 },
    animate: { opacity: 1, scale: 1 },
    transition: { duration: 0.3 },
  },

  hoverScale: {
    whileHover: { scale: 1.05 },
    transition: { duration: 0.2 },
  },
} as const;

/**
 * Conditional animation wrapper
 * Respects prefers-reduced-motion
 */
export const conditionalAnimation = (
  animation: any,
  disabled: boolean = false
) => {
  if (disabled || useReducedMotion()) {
    return {
      initial: animation.initial,
      animate: animation.animate,
      transition: { duration: 0 },
    };
  }
  return animation;
};

/**
 * Optimized stagger container
 * Use for lists - reduces jank
 */
export const STAGGER_CONTAINER = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.1,
    },
  },
};

/**
 * Stagger item
 */
export const STAGGER_ITEM = {
  hidden: { opacity: 0, y: 10 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.3 },
  },
};
