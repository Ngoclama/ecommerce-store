import Image from "next/image";
import { Tab } from "@headlessui/react";

import { cn } from "@/lib/utils";
import { Image as ImageType } from "@/types";

interface GalleryTabProps {
  image: ImageType;
}

const GalleryTab: React.FC<GalleryTabProps> = ({ image }) => {
  return (
    <Tab className="relative flex items-center justify-center w-full h-24 cursor-pointer aspect-square rounded-md bg-gray-100">
      {({ selected }) => (
        <div>
          <span className="absolute inset-0 w-full h-full overflow-hidden rounded-md aspect-square">
            <Image
              fill
              src={image.url}
              alt=""
              sizes="96px"
              className="object-cover object-center"
            />
          </span>
          <span
            className={cn(
              "absolute inset-0 rounded-md ring-2 ring-offset-2",
              selected ? "ring-black" : "ring-transparent"
            )}
          />
        </div>
      )}
    </Tab>
  );
};

export default GalleryTab;