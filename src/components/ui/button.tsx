import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-none text-sm font-light uppercase tracking-wider transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black focus-visible:ring-offset-2 focus-visible:ring-offset-white disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:w-4 [&_svg]:h-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default:
          "border border-black dark:border-white bg-white dark:bg-black text-black dark:text-white hover:bg-black dark:hover:bg-white hover:text-white dark:hover:text-black",
        destructive:
          "border border-red-300 dark:border-red-600 bg-white dark:bg-red-900 text-red-600 dark:text-red-300 hover:bg-red-50 dark:hover:bg-red-800",
        outline:
          "border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-black dark:text-white hover:border-black dark:hover:border-white",
        secondary:
          "border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-800 text-black dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700",
        ghost: "hover:bg-gray-100 dark:hover:bg-gray-800 text-black dark:text-white border-0",
        link: "text-black dark:text-white underline-offset-4 hover:underline border-0",
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
