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

  // Auto switch after 10s if user doesn't touch
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
          className="mb-2 backdrop-blur-md"
        >
          <ChevronUp />
        </Button>

        <div className="overflow-y-scroll h-[400px] space-y-2 pr-1 custom-scrollbar">
          {images.map((img, i) => (
            <Tab
              key={i}
              onClick={() => setIndex(i)}
              className={cn(
                "relative flex aspect-square w-20 h-20 cursor-pointer items-center justify-center rounded-md border border-white/10 bg-white/10 text-white backdrop-blur-sm transition hover:opacity-70"
              )}
            >
              <span className="absolute inset-0 rounded-md overflow-hidden">
                <Image
                  fill
                  src={img.url}
                  alt="thumb"
                  className="object-cover"
                />
              </span>
              <span
                className={cn(
                  "absolute inset-0 rounded-md ring-2 ring-offset-2 transition",
                  index === i ? "ring-white" : "ring-transparent"
                )}
              />
            </Tab>
          ))}
        </div>

        <Button
          variant="ghost"
          size="icon"
          onClick={next}
          className="mt-2 backdrop-blur-md"
        >
          <ChevronDown />
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
          className="absolute left-2 top-1/2 -translate-y-1/2 backdrop-blur-xl"
        >
          <ChevronLeft />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          onClick={next}
          className="absolute right-2 top-1/2 -translate-y-1/2 backdrop-blur-xl"
        >
          <ChevronRight />
        </Button>

        {/* Share box */}
        <div className="absolute bottom-4 right-4 bg-white/10 backdrop-blur-xl px-4 py-2 rounded-xl flex items-center gap-2">
          <Share2 className="w-4 h-4" />
          <span className="text-white text-sm">Share</span>
        </div>
      </div>
    </div>
  );
}
