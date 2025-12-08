"use client";

import Image, { ImageProps } from "next/image";
import { useState } from "react";
import { cn } from "@/lib/utils";

interface OptimizedImageProps extends Omit<ImageProps, "onLoad"> {
  containerClassName?: string;
  placeholderClassName?: string;
}

export const OptimizedImage: React.FC<OptimizedImageProps> = ({
  src,
  alt,
  width,
  height,
  className,
  containerClassName,
  placeholderClassName,
  ...props
}) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);

  if (hasError) {
    return (
      <div
        className={cn(
          "bg-neutral-100 dark:bg-neutral-900 animate-pulse",
          containerClassName
        )}
        style={{
          aspectRatio: width && height ? `${width}/${height}` : "1",
        }}
      />
    );
  }

  return (
    <div
      className={cn("relative overflow-hidden", containerClassName)}
      style={{
        aspectRatio: width && height ? `${width}/${height}` : "1",
      }}
    >
      <Image
        src={src}
        alt={alt}
        width={width}
        height={height}
        loading="lazy"
        quality={75}
        className={cn(
          "transition-opacity duration-300",
          isLoaded ? "opacity-100" : "opacity-0",
          className
        )}
        onLoad={() => setIsLoaded(true)}
        onError={() => setHasError(true)}
        {...props}
      />
      {!isLoaded && (
        <div
          className={cn(
            "absolute inset-0 bg-neutral-100 dark:bg-neutral-900 animate-pulse",
            placeholderClassName
          )}
        />
      )}
    </div>
  );
};

export default OptimizedImage;
