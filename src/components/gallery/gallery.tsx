"use client";

import Image from "next/image";
import { Tab } from "@headlessui/react";
import { cn } from "@/lib/utils";
import { Image as ImageType } from "@/types";
import {
  ChevronUp,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Share2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";

interface GalleryProps {
  images: ImageType[];
}

export default function Gallery({ images }: GalleryProps) {
  const [index, setIndex] = useState(0);

  
  useEffect(() => {
    const timer = setTimeout(() => {
      setIndex((prev) => (prev + 1) % images.length);
    }, 10000);
    return () => clearTimeout(timer);
  }, [index, images.length]);

  const next = () => setIndex((prev) => (prev + 1) % images.length);
  const prev = () =>
    setIndex((prev) => (prev - 1 + images.length) % images.length);

  return (
    <div className="flex gap-4 w-full">
      {/* Left thumbnails */}
      <div className="relative w-24 flex flex-col items-center">
        <Button
          variant="ghost"
          size="icon"
          onClick={prev}
          className="mb-2 backdrop-blur-md bg-white/80 dark:bg-gray-800/80 hover:bg-white dark:hover:bg-gray-700 text-black dark:text-white border border-gray-200 dark:border-gray-700"
        >
          <ChevronUp className="w-4 h-4" />
        </Button>

        <div className="overflow-y-scroll h-[400px] space-y-2 pr-1 custom-scrollbar">
          {images.map((img, i) => (
            <Tab
              key={i}
              onClick={() => setIndex(i)}
              className={cn(
                "relative flex aspect-square w-20 h-20 cursor-pointer items-center justify-center rounded-md border transition hover:opacity-70",
                index === i
                  ? "border-black dark:border-white bg-white dark:bg-gray-800"
                  : "border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800"
              )}
            >
              <span className="absolute inset-0 rounded-md overflow-hidden">
                <Image
                  fill
                  src={img.url}
                  alt="thumb"
                  sizes="(max-width: 640px) 80px, 100px"
                  className="object-cover"
                />
              </span>
              <span
                className={cn(
                  "absolute inset-0 rounded-md ring-2 ring-offset-2 transition",
                  index === i ? "ring-black dark:ring-white" : "ring-transparent"
                )}
              />
            </Tab>
          ))}
        </div>

        <Button
          variant="ghost"
          size="icon"
          onClick={next}
          className="mt-2 backdrop-blur-md bg-white/80 dark:bg-gray-800/80 hover:bg-white dark:hover:bg-gray-700 text-black dark:text-white border border-gray-200 dark:border-gray-700"
        >
          <ChevronDown className="w-4 h-4" />
        </Button>
      </div>

      {/* Main image */}
      <div className="relative flex-1 flex items-center justify-center">
        <Image
          src={images[index].url}
          alt="main"
          width={600}
          height={600}
          className="rounded-xl object-cover transition hover:opacity-90"
        />

        {/* Navigation buttons */}
        <Button
          variant="ghost"
          size="icon"
          onClick={prev}
          className="absolute left-2 top-1/2 -translate-y-1/2 backdrop-blur-xl bg-white/80 dark:bg-gray-800/80 hover:bg-white dark:hover:bg-gray-700 text-black dark:text-white border border-gray-200 dark:border-gray-700"
        >
          <ChevronLeft className="w-4 h-4" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          onClick={next}
          className="absolute right-2 top-1/2 -translate-y-1/2 backdrop-blur-xl bg-white/80 dark:bg-gray-800/80 hover:bg-white dark:hover:bg-gray-700 text-black dark:text-white border border-gray-200 dark:border-gray-700"
        >
          <ChevronRight className="w-4 h-4" />
        </Button>

        {/* Share box */}
        <div className="absolute bottom-4 right-4 bg-white/90 dark:bg-gray-800/90 backdrop-blur-xl px-3 py-1.5 rounded-xl flex items-center gap-2 border border-gray-200 dark:border-gray-700">
          <Share2 className="w-3.5 h-3.5 text-black dark:text-white" />
          <span className="text-black dark:text-white text-xs">Share</span>
        </div>
      </div>
    </div>
  );
}
