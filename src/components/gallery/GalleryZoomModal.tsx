"use client";

import Image from "next/image";
import { X, ChevronLeft, ChevronRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useRef } from "react";
import { cn } from "@/lib/utils";

interface Props {
  images: { url: string }[];
  index: number;
  open: boolean;
  onClose: () => void;
  onNext: () => void;
  onPrev: () => void;
}

export default function GalleryZoomModal({
  images,
  index,
  open,
  onClose,
  onNext,
  onPrev,
}: Props) {
  const [scale, setScale] = useState(1);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [startDrag, setStartDrag] = useState<{ x: number; y: number } | null>(
    null
  );
  const [origin, setOrigin] = useState({ x: 50, y: 50 }); // default center

  const containerRef = useRef<HTMLDivElement | null>(null);
  const resetKey = `${index}-${open}`;

  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    if (!containerRef.current) return;

    const rect = containerRef.current.getBoundingClientRect();
    const offsetX = e.clientX - rect.left;
    const offsetY = e.clientY - rect.top;

    // set transform origin theo con trỏ
    setOrigin({
      x: (offsetX / rect.width) * 100,
      y: (offsetY / rect.height) * 100,
    });

    setScale((prev) => {
      const next = Math.min(Math.max(prev + (e.deltaY > 0 ? -0.1 : 0.1), 1), 4);
      if (next === 1) setPosition({ x: 0, y: 0 });
      return next;
    });
  };

  const handleDoubleClick = (e: React.MouseEvent) => {
    if (!containerRef.current) return;

    const rect = containerRef.current.getBoundingClientRect();
    const offsetX = e.clientX - rect.left;
    const offsetY = e.clientY - rect.top;

    setOrigin({
      x: (offsetX / rect.width) * 100,
      y: (offsetY / rect.height) * 100,
    });

    setScale(scale > 1 ? 1 : 2);
    if (scale > 1) setPosition({ x: 0, y: 0 });
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    if (scale <= 1) return;
    setIsDragging(true);
    setStartDrag({ x: e.clientX - position.x, y: e.clientY - position.y });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
    setStartDrag(null);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!containerRef.current) return;

    const rect = containerRef.current.getBoundingClientRect();
    const offsetX = e.clientX - rect.left;
    const offsetY = e.clientY - rect.top;

    // Smooth pan khi chưa drag
    if (scale > 1 && !isDragging) {
      const moveX =
        (offsetX / rect.width - 0.5) * (scale - 1) * rect.width * -1;
      const moveY =
        (offsetY / rect.height - 0.5) * (scale - 1) * rect.height * -1;
      setPosition({ x: moveX, y: moveY });
    }

    // Drag
    if (isDragging && startDrag) {
      setPosition({
        x: e.clientX - startDrag.x,
        y: e.clientY - startDrag.y,
      });
    }
  };

  const currentImage = images?.[index];
  if (!currentImage) return null;

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onMouseDown={(e) => e.target === e.currentTarget && onClose()}
        >
          {/* Nút đóng */}
          <button
            onClick={onClose}
            className="absolute top-6 right-6 z-50 p-2 rounded-full bg-black/40 hover:bg-black/60"
          >
            <X className="text-white" size={28} />
          </button>

          {/* Nút prev */}
          <button
            onClick={onPrev}
            className="absolute left-4 top-1/2 -translate-y-1/2 z-50 p-3 rounded-full bg-black/40 hover:bg-black/60 disabled:opacity-50"
            disabled={images.length <= 1}
          >
            <ChevronLeft className="text-white" size={36} />
          </button>

          {/* Nút next */}
          <button
            onClick={onNext}
            className="absolute right-4 top-1/2 -translate-y-1/2 z-50 p-3 rounded-full bg-black/40 hover:bg-black/60 disabled:opacity-50"
            disabled={images.length <= 1}
          >
            <ChevronRight className="text-white" size={36} />
          </button>

          {/* Container ảnh */}
          <motion.div
            ref={containerRef}
            className={cn(
              "relative w-full max-w-5xl h-[90vh] overflow-hidden",
              scale > 1
                ? isDragging
                  ? "cursor-grabbing"
                  : "cursor-zoom-out"
                : "cursor-zoom-in"
            )}
            key={resetKey}
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            transition={{ duration: 0.2 }}
            onWheel={handleWheel}
            onDoubleClick={handleDoubleClick}
            onMouseDown={handleMouseDown}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
            onMouseMove={handleMouseMove}
          >
            <motion.div
              className="relative w-full h-full"
              style={{
                transform: `translate(${position.x}px, ${position.y}px) scale(${scale})`,
                transformOrigin: `${origin.x}% ${origin.y}%`,
              }}
              transition={
                isDragging
                  ? { duration: 0 }
                  : { duration: 0.2, ease: "easeOut" }
              }
            >
              <Image
                src={currentImage.url}
                alt="zoom"
                fill
                className="object-contain select-none"
              />
            </motion.div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
