"use client";

import { ChevronRight } from "lucide-react";
import Link from "next/link";
import Container from "@/components/ui/container";

const logos = [
  {
    name: "Prada",
    src: "/Prada-Logo.png",
    height: 24,
  },
  {
    name: "Dolce and Gabbana",
    src: "/dolce.svg",
    height: 24,
  },
  {
    name: "Armani",
    src: "/emporio-armani-logo-png_seeklogo-47600.png",
    height: 24,
  },
  {
    name: "Balenciaga",
    src: "/Balenciaga-Logo-2017-present.png",
    height: 24,
  },
];

export default function LogoCloud() {
  return (
    <section className="bg-white dark:bg-gray-900 py-16 border-t border-gray-100 dark:border-gray-800">
      <Container>
        <div className="group relative m-auto max-w-5xl px-6">
          <div className="absolute inset-0 z-10 flex scale-95 items-center justify-center opacity-0 duration-500 group-hover:scale-100 group-hover:opacity-100">
            <Link
              href="/"
              className="block text-sm text-black dark:text-white duration-150 hover:opacity-75 font-light uppercase tracking-wider"
            >
              <span>Khám phá ngay</span>
              <ChevronRight className="ml-1 inline-block size-3" />
            </Link>
          </div>
          <div className="group-hover:blur-xs mx-auto mt-12 grid max-w-2xl grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-x-12 gap-y-8 transition-all duration-500 group-hover:opacity-50 sm:gap-x-16 sm:gap-y-14">
            {logos.map((logo, index) => (
              <div key={logo.name} className="flex">
                <img
                  className="mx-auto h-6 md:h-8 w-fit dark:invert opacity-60 dark:opacity-60 group-hover:opacity-100 dark:group-hover:opacity-80 transition-opacity duration-300"
                  src={logo.src}
                  alt={`${logo.name} Logo`}
                  height={logo.height}
                  width="auto"
                  loading="lazy"
                />
              </div>
            ))}
          </div>
        </div>
      </Container>
    </section>
  );
}
