"use client";

import Image from "next/image";
import { Tab } from "@headlessui/react";
import { Image as ImageType } from "@/types";
import GalleryTab from "./gallery-tab";
import { useState } from "react";
import GalleryZoomModal from "./GalleryZoomModal";

interface GalleryProps {
  images?: ImageType[];
}

const Gallery: React.FC<GalleryProps> = ({ images = [] }) => {
  const [zoomOpen, setZoomOpen] = useState(false);
  const [zoomIndex, setZoomIndex] = useState(0);

  if (!images.length) {
    return (
      <div className="flex items-center justify-center w-full h-full">
        <div className="w-full h-full rounded-lg bg-gray-200 flex items-center justify-center">
          <p className="text-gray-500">No Image</p>
        </div>
      </div>
    );
  }
  
  return (
    <>
      <Tab.Group as="div" className="flex flex-col-reverse">
        <div className="hidden w-full max-w-2xl mx-auto mt-6 sm:block lg:max-w-none">
          <Tab.List className="grid grid-cols-4 gap-6">
            {images.map((image) => (
              <GalleryTab key={image.id} image={image} />
            ))}
          </Tab.List>
        </div>
        <Tab.Panels className="w-full aspect-square">
          {images.map((image, i) => (
            <Tab.Panel key={image.id}>
              <div
                className="relative w-full h-full overflow-hidden cursor-zoom-in aspect-square sm:rounded-lg"
                onClick={() => {
                  setZoomIndex(i);
                  setZoomOpen(true);
                }}
              >
                <Image
                  fill
                  src={image.url}
                  alt={"Image"}
                  className="object-cover object-center"
                />
              </div>
            </Tab.Panel>
          ))}
        </Tab.Panels>
      </Tab.Group>
      <GalleryZoomModal
        images={images}
        index={zoomIndex}
        open={zoomOpen}
        onClose={() => setZoomOpen(false)}
        onNext={() => setZoomIndex((i) => (i + 1) % images.length)}
        onPrev={() =>
          setZoomIndex((i) => (i - 1 + images.length) % images.length)
        }
      />
    </>
  );
};

export default Gallery;
