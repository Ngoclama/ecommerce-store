import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-none text-sm font-light uppercase tracking-wider transition-all duration-300 ease-in-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-400 focus-visible:ring-offset-2 focus-visible:ring-offset-white disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:w-4 [&_svg]:h-4 [&_svg]:shrink-0 hover:scale-[1.01] active:scale-[0.99]",
  {
    variants: {
      variant: {
        default:
          "border border-gray-400 bg-gray-400 text-white hover:bg-gray-900 hover:border-gray-900 hover:shadow-lg hover:shadow-gray-400/30 transition-all duration-300 ease-in-out dark:bg-gray-500 dark:border-gray-500 dark:hover:bg-gray-900 dark:hover:border-gray-900",
        destructive:
          "border border-red-400 bg-red-400 text-white hover:bg-red-600 hover:border-red-600 hover:shadow-lg hover:shadow-red-400/30 transition-all duration-300 ease-in-out dark:bg-red-500 dark:border-red-500 dark:hover:bg-red-700",
        outline:
          "border border-gray-400 bg-transparent text-gray-600 hover:bg-gray-900 hover:text-white hover:border-gray-900 hover:shadow-md hover:shadow-gray-400/20 transition-all duration-300 ease-in-out dark:border-gray-500 dark:text-gray-300 dark:hover:bg-gray-900 dark:hover:text-white dark:hover:border-gray-900",
        secondary:
          "border border-gray-300 bg-gray-200 text-gray-700 hover:bg-gray-900 hover:text-white hover:border-gray-900 hover:shadow-md hover:shadow-gray-300/20 transition-all duration-300 ease-in-out dark:bg-gray-600 dark:border-gray-600 dark:text-gray-200 dark:hover:bg-gray-900",
        ghost: "hover:bg-gray-200 hover:text-gray-800 text-gray-600 border-0 transition-all duration-300 ease-in-out dark:hover:bg-gray-700 dark:hover:text-gray-100 dark:text-gray-300",
        link: "text-gray-600 underline-offset-4 hover:underline hover:text-gray-800 border-0 transition-colors duration-300 ease-in-out dark:text-gray-300 dark:hover:text-gray-100",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-9 px-3 text-xs",
        lg: "h-12 px-8 text-base",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "outline",
      size: "default",
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant,
      size,
      asChild = false,
      suppressHydrationWarning,
      ...props
    },
    ref
  ) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        suppressHydrationWarning={suppressHydrationWarning}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";

export { Button, buttonVariants };
