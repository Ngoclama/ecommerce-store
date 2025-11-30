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

    // Nếu đang ở đầu, scroll đến cuối (loop)
    if (scrollTop <= 0) {
      container.scrollTo({
        top: scrollHeight - clientHeight,
        behavior: "smooth",
      });
    } else {
      // Scroll lên bình thường
      container.scrollBy({
        top: -80,
        behavior: "smooth",
      });
    }
  };

  const scrollThumbnailsDown = () => {
    if (!thumbnailScrollRef.current) return;

    const container = thumbnailScrollRef.current;
    const { scrollTop, scrollHeight, clientHeight } = container;

    // Nếu đang ở cuối, scroll đến đầu (loop)
    if (scrollTop >= scrollHeight - clientHeight - 1) {
      container.scrollTo({
        top: 0,
        behavior: "smooth",
      });
    } else {
      // Scroll xuống bình thường
      container.scrollBy({
        top: 80,
        behavior: "smooth",
      });
    }
  };

  // Keyboard navigation với vòng lặp
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
  }, [images.length]);

  if (!images.length) {
    return (
      <div className="flex items-center justify-center w-full h-full">
        <div className="w-full h-full bg-gray-100 flex items-center justify-center border border-gray-300 rounded-none">
          <p className="text-gray-500 font-light">No Image</p>
        </div>
      </div>
    );
  }

  const nextImage = useCallback(() => {
    if (images.length === 0) return;
    setCurrentIndex((prev) => {
      // Loop: nếu đang ở ảnh cuối, quay về ảnh đầu
      return (prev + 1) % images.length;
    });
  }, [images.length]);

  const prevImage = useCallback(() => {
    if (images.length === 0) return;
    setCurrentIndex((prev) => {
      // Loop: nếu đang ở ảnh đầu, quay về ảnh cuối
      return (prev - 1 + images.length) % images.length;
    });
  }, [images.length]);

  const goToImage = (index: number) => {
    if (index >= 0 && index < images.length) {
      setCurrentIndex(index);
    }
  };

  // Keyboard navigation với vòng lặp
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

  return (
    <div className="w-full bg-gray-50 flex flex-col md:flex-row gap-3 p-3">
      {/* Thumbnails Sidebar - Left (Desktop) */}
      {hasMultipleImages && images.length > 1 && (
        <div className="hidden md:flex flex-col gap-2 items-center">
          {/* Scroll Up Button - Vòng lặp */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              e.preventDefault();
              scrollThumbnailsUp();
            }}
            className="p-1.5 bg-white border border-gray-300 rounded-none hover:bg-gray-50 transition-colors z-10 relative"
            aria-label="Scroll up"
            type="button"
          >
            <ChevronUp className="w-4 h-4 text-black" />
          </button>

          {/* Thumbnails Container */}
          <div
            ref={thumbnailScrollRef}
            className="flex flex-col gap-2 overflow-y-auto max-h-[600px] scrollbar-hide"
          >
            {images.map((img, idx) => (
              <button
                key={img.id}
                onClick={(e) => {
                  e.stopPropagation();
                  goToImage(idx);
                }}
                className={cn(
                  "relative w-16 h-16 border-2 rounded-none overflow-hidden shrink-0 transition-all",
                  idx === currentIndex
                    ? "border-black"
                    : "border-gray-300 hover:border-gray-400"
                )}
              >
                <Image
                  src={img.url}
                  alt={`Thumbnail ${idx + 1}`}
                  fill
                  sizes="(max-width: 640px) 60px, 100px"
                  className="object-cover"
                />
              </button>
            ))}
          </div>

          {/* Scroll Down Button - Vòng lặp */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              e.preventDefault();
              scrollThumbnailsDown();
            }}
            className="p-1.5 bg-white border border-gray-300 rounded-none hover:bg-gray-50 transition-colors z-10 relative"
            aria-label="Scroll down"
            type="button"
          >
            <ChevronDown className="w-4 h-4 text-black" />
          </button>
        </div>
      )}

      {/* Main Image Container */}
      <div className="flex-1 relative aspect-square bg-gray-100 overflow-hidden group">
        <Image
          src={images[currentIndex]?.url || "/placeholder.svg"}
          alt="Product image"
          fill
          sizes="(max-width: 1024px) 100vw, 50vw"
          className="object-cover transition-opacity duration-500"
          priority={currentIndex === 0}
        />

        {/* Navigation Arrows */}
        {hasMultipleImages && (
          <>
            <button
              onClick={(e) => {
                e.stopPropagation();
                prevImage();
              }}
              className="absolute left-4 top-1/2 -translate-y-1/2 z-10 p-2 bg-white/90 hover:bg-white border border-gray-300 rounded-none opacity-0 group-hover:opacity-100 transition-opacity"
              aria-label="Ảnh trước"
            >
              <ChevronLeft className="w-5 h-5 text-black" />
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                nextImage();
              }}
              className="absolute right-4 top-1/2 -translate-y-1/2 z-10 p-2 bg-white/90 hover:bg-white border border-gray-300 rounded-none opacity-0 group-hover:opacity-100 transition-opacity"
              aria-label="Ảnh sau"
            >
              <ChevronRight className="w-5 h-5 text-black" />
            </button>
          </>
        )}

        {/* Image Counter */}
        {hasMultipleImages && (
          <div className="absolute bottom-4 right-4 bg-white/90 text-black border border-gray-300 px-3 py-1 text-xs rounded-none font-light">
            {currentIndex + 1} / {images.length}
          </div>
        )}

        {/* Discount Badge */}
        {discountPercent > 0 && (
          <div className="absolute top-4 left-4 z-10">
            <span className="px-2 py-1 bg-black text-white text-xs font-light uppercase rounded-none">
              -{discountPercent}%
            </span>
          </div>
        )}
      </div>

      {/* Thumbnails - Mobile (Below main image) */}
      {hasMultipleImages && images.length > 1 && (
        <div className="md:hidden w-full bg-gray-50 border-t border-gray-200">
          <div className="flex gap-2 p-4 overflow-x-auto">
            {images.map((img, idx) => (
              <button
                key={img.id}
                onClick={(e) => {
                  e.stopPropagation();
                  goToImage(idx);
                }}
                className={cn(
                  "relative w-16 h-16 border-2 rounded-none overflow-hidden shrink-0 transition-all",
                  idx === currentIndex
                    ? "border-black"
                    : "border-gray-300 hover:border-gray-400"
                )}
              >
                <Image
                  src={img.url}
                  alt={`Thumbnail ${idx + 1}`}
                  fill
                  sizes="(max-width: 640px) 60px, 100px"
                  className="object-cover"
                />
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default Gallery;
