import { cn } from "@/lib/utils";
import React from "react";

interface IconButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  icon: React.ReactNode;
  size?: "sm" | "md" | "lg";
  variant?: "default" | "ghost";
}

const IconButton = React.forwardRef<HTMLButtonElement, IconButtonProps>(
  ({ icon, size = "md", variant = "default", className, ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(
          "inline-flex items-center justify-center rounded-lg transition-all duration-200",
          size === "sm" && "w-8 h-8",
          size === "md" && "w-10 h-10",
          size === "lg" && "w-12 h-12",
          variant === "default" &&
            "bg-white hover:bg-gray-100 border border-gray-300",
          variant === "ghost" && "hover:bg-gray-100",
          className
        )}
        {...props}
      >
        {icon}
      </button>
    );
  }
);

IconButton.displayName = "IconButton";

export default IconButton;
