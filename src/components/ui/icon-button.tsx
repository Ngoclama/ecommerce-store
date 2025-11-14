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
          "inline-flex items-center justify-center rounded-full transition-all duration-200",
          "hover:scale-110 active:scale-95",
          size === "sm" && "w-8 h-8",
          size === "md" && "w-10 h-10",
          size === "lg" && "w-12 h-12",
          variant === "default" &&
            "bg-card hover:bg-muted border border-border shadow-sm hover:shadow-md",
          variant === "ghost" && "hover:bg-muted",
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
