"use client";

import Image from "next/image";
import { Tab } from "@headlessui/react";
import { cn } from "@/lib/utils";
import { Image as ImageType } from "@/types";

interface GalleryTabProps {
  image: ImageType;
}

const GalleryTab: React.FC<GalleryTabProps> = ({ image }) => {
  return (
    <Tab
      className={cn(
        "relative flex aspect-square w-24 h-24 cursor-pointer items-center justify-center rounded-md border border-white/10 bg-white/10 text-white backdrop-blur-sm transition hover:opacity-80",
        "focus:outline-none focus:ring-2 focus:ring-white/50 focus:ring-offset-2 focus:ring-offset-gray-900"
      )}
    >
      {({ selected }) => (
        <>
          <span className="absolute inset-0 aspect-square h-full w-full overflow-hidden rounded-md">
            <Image
              fill
              src={image.url}
              alt=""
              className="object-cover object-center"
            />
          </span>
          <span
            className={cn(
              "absolute inset-0 rounded-md ring-2 ring-offset-2",
              selected ? "ring-white" : "ring-transparent"
            )}
          />
        </>
      )}
    </Tab>
  );
};

export default GalleryTab;
