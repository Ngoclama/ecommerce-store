"use client";

import Image from "next/image";
import { Image as ImageType } from "@/types";
import { useState, useEffect, useRef, useCallback } from "react";
import {
  ChevronLeft,
  ChevronRight,
  ChevronUp,
  ChevronDown,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";

interface GalleryProps {
  images?: ImageType[];
  discountPercent?: number;
}

const Gallery: React.FC<GalleryProps> = ({
  images = [],
  discountPercent = 0,
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const thumbnailScrollRef = useRef<HTMLDivElement>(null);

  const hasMultipleImages = images.length > 1;

  // Thumbnail scroll functions với vòng lặp
  const scrollThumbnailsUp = () => {
    if (!thumbnailScrollRef.current) return;

    const container = thumbnailScrollRef.current;
    const { scrollTop, scrollHeight, clientHeight } = container;

    if (scrollTop <= 0) {
      container.scrollTo({
        top: scrollHeight - clientHeight,
        behavior: "smooth",
      });
    } else {
      container.scrollBy({
        top: -100,
        behavior: "smooth",
      });
    }
  };

  const scrollThumbnailsDown = () => {
    if (!thumbnailScrollRef.current) return;

    const container = thumbnailScrollRef.current;
    const { scrollTop, scrollHeight, clientHeight } = container;

    if (scrollTop >= scrollHeight - clientHeight - 1) {
      container.scrollTo({
        top: 0,
        behavior: "smooth",
      });
    } else {
      container.scrollBy({
        top: 100,
        behavior: "smooth",
      });
    }
  };

  const nextImage = useCallback(() => {
    if (images.length === 0) return;
    setCurrentIndex((prev) => (prev + 1) % images.length);
  }, [images.length]);

  const prevImage = useCallback(() => {
    if (images.length === 0) return;
    setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);
  }, [images.length]);

  const goToImage = (index: number) => {
    if (index >= 0 && index < images.length) {
      setCurrentIndex(index);
    }
  };

  
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (images.length === 0) return;

      if (e.key === "ArrowLeft") {
        e.preventDefault();
        prevImage();
      } else if (e.key === "ArrowRight") {
        e.preventDefault();
        nextImage();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [images.length, nextImage, prevImage]);

  if (!images.length) {
    return (
      <div className="flex items-center justify-center w-full h-full min-h-[600px]">
        <div className="w-full h-full bg-neutral-100 dark:bg-neutral-900 flex items-center justify-center border-2 border-neutral-200 dark:border-neutral-800 rounded-sm">
          <p className="text-neutral-500 dark:text-neutral-400 font-light tracking-wide uppercase text-sm">
            No Image
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full bg-white dark:bg-gray-900 flex flex-col md:flex-row gap-4 md:gap-6">
      {/* Thumbnails Sidebar - Left (Desktop) */}
      {hasMultipleImages && images.length > 1 && (
        <div className="hidden md:flex flex-col gap-3 items-center">
          {/* Scroll Up Button */}
          <motion.button
            onClick={(e) => {
              e.stopPropagation();
              e.preventDefault();
              scrollThumbnailsUp();
            }}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            className="p-2 bg-white dark:bg-gray-900 border-2 border-neutral-200 dark:border-neutral-800 hover:border-neutral-400 dark:hover:border-neutral-600 rounded-sm transition-all duration-300 z-10 relative shadow-sm hover:shadow-md"
            aria-label="Scroll up"
            type="button"
          >
            <ChevronUp className="w-4 h-4 text-neutral-700 dark:text-neutral-300" />
          </motion.button>

          {/* Thumbnails Container */}
          <div
            ref={thumbnailScrollRef}
            className="flex flex-col gap-3 overflow-y-auto max-h-[600px] scrollbar-hide px-1"
          >
            {images.map((img, idx) => (
              <motion.button
                key={img.id}
                onClick={(e) => {
                  e.stopPropagation();
                  goToImage(idx);
                }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className={cn(
                  "relative w-20 h-20 border-2 rounded-sm overflow-hidden shrink-0 transition-all duration-300",
                  idx === currentIndex
                    ? "border-neutral-900 dark:border-neutral-100 ring-2 ring-offset-2 ring-neutral-900 dark:ring-neutral-100"
                    : "border-neutral-200 dark:border-neutral-800 hover:border-neutral-400 dark:hover:border-neutral-600"
                )}
              >
                <Image
                  src={img.url}
                  alt={`Thumbnail ${idx + 1}`}
                  fill
                  sizes="80px"
                  className="object-cover"
                />
              </motion.button>
            ))}
          </div>

          {/* Scroll Down Button */}
          <motion.button
            onClick={(e) => {
              e.stopPropagation();
              e.preventDefault();
              scrollThumbnailsDown();
            }}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            className="p-2 bg-white dark:bg-gray-900 border-2 border-neutral-200 dark:border-neutral-800 hover:border-neutral-400 dark:hover:border-neutral-600 rounded-sm transition-all duration-300 z-10 relative shadow-sm hover:shadow-md"
            aria-label="Scroll down"
            type="button"
          >
            <ChevronDown className="w-4 h-4 text-neutral-700 dark:text-neutral-300" />
          </motion.button>
        </div>
      )}

      {/* Main Image Container */}
      <div className="flex-1 relative aspect-square bg-neutral-100 dark:bg-neutral-900 overflow-hidden group rounded-sm border-2 border-neutral-200 dark:border-neutral-800 cursor-zoom-in">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentIndex}
            initial={{ opacity: 0, scale: 1.05 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            whileHover={{ 
              scale: 1.1,
              transition: {
                duration: 0.6,
                ease: [0.25, 0.1, 0.25, 1],
              }
            }}
            transition={{
              duration: 0.5,
              ease: [0.25, 0.1, 0.25, 1],
            }}
            className="absolute inset-0"
          >
            <Image
              src={images[currentIndex]?.url || "/placeholder.svg"}
              alt="Product image"
              fill
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="object-cover"
              priority={currentIndex === 0}
            />
          </motion.div>
        </AnimatePresence>

        {}
        {hasMultipleImages && (
          <>
            <motion.button
              onClick={(e) => {
                e.stopPropagation();
                prevImage();
              }}
              whileHover={{ scale: 1.1, x: -5 }}
              whileTap={{ scale: 0.9 }}
              className="absolute left-6 top-1/2 -translate-y-1/2 z-10 bg-white/90 backdrop-blur-md dark:bg-neutral-900/90 hover:bg-white dark:hover:bg-neutral-800 border-2 border-neutral-200 dark:border-neutral-700 hover:border-neutral-400 dark:hover:border-neutral-600 rounded-sm p-3 opacity-0 group-hover:opacity-100 transition-all duration-300 shadow-lg"
              aria-label="Ảnh trước"
            >
              <ChevronLeft className="w-5 h-5 text-neutral-900 dark:text-neutral-100" />
            </motion.button>
            <motion.button
              onClick={(e) => {
                e.stopPropagation();
                nextImage();
              }}
              whileHover={{ scale: 1.1, x: 5 }}
              whileTap={{ scale: 0.9 }}
              className="absolute right-6 top-1/2 -translate-y-1/2 z-10 bg-white/90 backdrop-blur-md dark:bg-neutral-900/90 hover:bg-white dark:hover:bg-neutral-800 border-2 border-neutral-200 dark:border-neutral-700 hover:border-neutral-400 dark:hover:border-neutral-600 rounded-sm p-3 opacity-0 group-hover:opacity-100 transition-all duration-300 shadow-lg"
              aria-label="Ảnh sau"
            >
              <ChevronRight className="w-5 h-5 text-neutral-900 dark:text-neutral-100" />
            </motion.button>
          </>
        )}

        {}
        {hasMultipleImages && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="absolute bottom-6 right-6 bg-white/90 backdrop-blur-md dark:bg-neutral-900/90 text-neutral-900 dark:text-neutral-100 border-2 border-neutral-200 dark:border-neutral-700 px-4 py-2 text-xs rounded-sm font-light tracking-wide shadow-lg"
          >
            {currentIndex + 1} / {images.length}
          </motion.div>
        )}

        {}
        {discountPercent > 0 && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3, type: "spring" }}
            className="absolute top-6 left-6 z-10"
          >
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="px-4 py-2 bg-gradient-to-br from-red-600 to-red-700 text-white text-xs font-light uppercase tracking-wider rounded-sm shadow-lg border-2 border-red-500"
            >
              -{discountPercent}%
            </motion.div>
          </motion.div>
        )}
      </div>

      {/* Thumbnails - Mobile (Below main image) */}
      {hasMultipleImages && images.length > 1 && (
        <div className="md:hidden w-full bg-neutral-50 dark:bg-neutral-950 border-t-2 border-neutral-200 dark:border-neutral-800">
          <div className="flex gap-3 p-4 overflow-x-auto scrollbar-hide">
            {images.map((img, idx) => (
              <motion.button
                key={img.id}
                onClick={(e) => {
                  e.stopPropagation();
                  goToImage(idx);
                }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className={cn(
                  "relative w-20 h-20 border-2 rounded-sm overflow-hidden shrink-0 transition-all duration-300",
                  idx === currentIndex
                    ? "border-neutral-900 dark:border-neutral-100 ring-2 ring-offset-2 ring-neutral-900 dark:ring-neutral-100"
                    : "border-neutral-200 dark:border-neutral-800 hover:border-neutral-400 dark:hover:border-neutral-600"
                )}
              >
                <Image
                  src={img.url}
                  alt={`Thumbnail ${idx + 1}`}
                  fill
                  sizes="80px"
                  className="object-cover"
                />
              </motion.button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default Gallery;
