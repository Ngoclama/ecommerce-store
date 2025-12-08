"use client";

import Link from "next/link";
import Image from "next/image";
import { Category, Billboard } from "@/types";
import { Search, User, Heart, ShoppingBag, Phone, MapPin } from "lucide-react";
import { useState, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useAuth, UserButton } from "@clerk/nextjs";
import useCart from "@/hooks/use-cart";
import { useWishlist } from "@/hooks/use-wishlist";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Input } from "@/components/ui/input";
import Container from "@/components/ui/container";
import { NavbarActions } from "./navbar-action";

interface MainHeaderProps {
  categories: Category[];
  billboards: Billboard[];
}

export default function MainHeader({
  categories,
  billboards,
}: MainHeaderProps) {
  const pathname = usePathname();

  
  const parentCategories = categories.filter((category) => !category.parentId);

  return (
    <header className="sticky top-0 z-50 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800">
      {/* Top Bar */}
      <div className="bg-gray-50 dark:bg-gray-950 border-b border-gray-200 dark:border-gray-800 hidden lg:block">
        <Container>
          <div className="flex items-center justify-between h-10 px-4 sm:px-6 lg:px-8 text-xs">
            <div className="flex items-center gap-6">
              <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                <Phone className="w-4 h-4 text-black dark:text-white" />
                <span>
                  Hỗ trợ:{" "}
                  <strong className="text-black dark:text-white">
                    +84 123 456 789
                  </strong>
                </span>
              </div>
              <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                <MapPin className="w-4 h-4 text-black dark:text-white" />
                <span className="hidden xl:inline">
                  300A Nguyễn Tất Thành, P.An Phú Đông, Q.12, TP.HCM
                </span>
              </div>
            </div>
            <div className="flex items-center gap-4 text-gray-600 dark:text-gray-400">
              <Link
                href="/about"
                className="hover:text-black dark:hover:text-white transition-colors font-light uppercase tracking-wide text-xs"
              >
                Về chúng tôi
              </Link>
              <span className="text-gray-400 dark:text-gray-600">|</span>
              <Link
                href="/contact"
                className="hover:text-black dark:hover:text-white transition-colors font-light uppercase tracking-wide text-xs"
              >
                Liên hệ
              </Link>
            </div>
          </div>
        </Container>
      </div>

      {/* Main Header */}
      <div className="bg-white dark:bg-gray-900">
        <Container>
          <div className="flex items-center justify-between h-16 md:h-20 px-4 sm:px-6 lg:px-8 gap-4">
            {}
            <Link href="/" className="flex items-center shrink-0">
              <div className="relative w-10 h-10 md:w-12 md:h-12">
                <Image
                  src="/logo.png"
                  alt="Logo"
                  fill
                  sizes="(max-width: 768px) 40px, 48px"
                  className="object-contain"
                  priority
                />
              </div>
            </Link>

            {/* Navigation Menu */}
            <nav className="hidden lg:flex items-center gap-6 flex-1 justify-center">
              {/* Trang chủ */}
              <Link
                href="/"
                prefetch={true}
                className="relative text-sm font-light uppercase tracking-wider text-black dark:text-white hover:text-gray-600 dark:hover:text-gray-400 transition-colors pb-1 group/nav inline-flex items-center leading-none h-6"
              >
                Trang chủ
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-black dark:bg-white group-hover/nav:w-full transition-all duration-300 ease-out will-change-[width]"></span>
              </Link>

              {/* Sản phẩm - Dropdown */}
              <div className="relative group inline-flex items-center h-6">
                <span className="relative text-sm font-light uppercase tracking-wider text-black dark:text-white hover:text-gray-600 dark:hover:text-gray-400 transition-colors pb-1 inline-flex items-center leading-none cursor-pointer">
                  Sản phẩm
                  <svg
                    className="w-4 h-4 ml-1 transition-transform duration-300 group-hover:rotate-180"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                  <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-black dark:bg-white group-hover:w-full transition-all duration-300 ease-out will-change-[width]"></span>
                </span>

                {parentCategories.length > 0 && (
                  <div className="absolute left-1/2 -translate-x-1/2 top-full pt-4 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 ease-out pointer-events-none group-hover:pointer-events-auto">
                    {/* Hover bridge */}
                    <div className="absolute top-0 left-0 right-0 h-4" />

                    {/* Dropdown content */}
                    <div className="bg-white dark:bg-gray-900 border-t-2 border-black dark:border-white shadow-2xl min-w-[700px] max-w-5xl">
                      <div className="grid grid-cols-4 gap-x-12 gap-y-8 p-10">
                        {parentCategories.map((category) => (
                          <div key={category.id} className="space-y-4">
                            {/* Parent Category - Underlined Header */}
                            <Link
                              href={`/category/${category.id}`}
                              prefetch={true}
                              className="group/parent block"
                            >
                              <h3 className="text-sm font-bold uppercase tracking-wide text-black dark:text-white border-b-2 border-black dark:border-white pb-2 group-hover/parent:text-gray-600 dark:group-hover/parent:text-gray-400 transition-colors duration-200">
                                {category.name}
                              </h3>
                            </Link>

                            {/* Children Categories */}
                            {category.children &&
                              category.children.length > 0 && (
                                <ul className="space-y-2.5">
                                  {category.children.map((child) => (
                                    <li key={child.id}>
                                      <Link
                                        href={`/category/${child.id}`}
                                        prefetch={true}
                                        className="group/child block text-sm text-gray-700 dark:text-gray-300 hover:text-black dark:hover:text-white transition-all duration-200 relative pl-0 hover:pl-2"
                                      >
                                        <span className="inline-block transition-transform duration-200">
                                          {child.name}
                                        </span>
                                        <span className="absolute left-0 top-1/2 -translate-y-1/2 w-0 h-px bg-black dark:bg-white opacity-0 group-hover/child:w-1 group-hover/child:opacity-100 transition-all duration-200" />
                                      </Link>
                                    </li>
                                  ))}
                                </ul>
                              )}
                          </div>
                        ))}
                      </div>

                      {}
                      <div className="border-t border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-950 px-10 py-4">
                        <Link
                          href="/categories"
                          className="text-sm font-medium text-black dark:text-white hover:text-gray-600 dark:hover:text-gray-400 transition-colors inline-flex items-center gap-2 group/footer"
                        >
                          <span>Xem tất cả danh mục</span>
                          <svg
                            className="w-4 h-4 transition-transform duration-200 group-hover/footer:translate-x-1"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M17 8l4 4m0 0l-4 4m4-4H3"
                            />
                          </svg>
                        </Link>
                      </div>
                    </div>
                  </div>
                )}
              </div>
              {}
              <Link
                href="/products/new"
                prefetch={true}
                className="relative text-sm font-light uppercase tracking-wider text-black dark:text-white hover:text-gray-600 dark:hover:text-gray-400 transition-colors pb-1 group/nav inline-flex items-center leading-none h-6"
              >
                New
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-black dark:bg-white group-hover/nav:w-full transition-all duration-300 ease-out will-change-[width]"></span>
              </Link>

              {}
              <Link
                href="/blog"
                prefetch={true}
                className="relative text-sm font-light uppercase tracking-wider text-black dark:text-white hover:text-gray-600 dark:hover:text-gray-400 transition-colors pb-1 group/nav inline-flex items-center leading-none h-6"
              >
                Blog
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-black dark:bg-white group-hover/nav:w-full transition-all duration-300 ease-out will-change-[width]"></span>
              </Link>

              {/* Bộ sưu tập - Dropdown từ billboards */}
              {billboards.length > 0 && (
                <div className="relative group inline-flex items-center h-6">
                  <Link
                    href="/categories"
                    prefetch={true}
                    className="relative text-sm font-light uppercase tracking-wider text-black dark:text-white hover:text-gray-600 dark:hover:text-gray-400 transition-colors pb-1 group/nav inline-flex items-center leading-none"
                  >
                    Bộ sưu tập
                    <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-black dark:bg-white group-hover/nav:w-full transition-all duration-300 ease-out will-change-[width]"></span>
                  </Link>
                  <div className="absolute left-0 top-full mt-2 w-56 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-none shadow-xl opacity-0 invisible scale-95 -translate-y-2 group-hover:opacity-100 group-hover:visible group-hover:scale-100 group-hover:translate-y-0 pointer-events-none group-hover:pointer-events-auto z-50 transition-all duration-300 ease-out will-change-[opacity,transform]">
                    {}
                    <div className="absolute -top-2 left-0 right-0 h-2" />
                    <div className="py-2">
                      {billboards.map((billboard) => (
                        <Link
                          key={billboard.id}
                          href={`/billboard/${billboard.id}`}
                          prefetch={true}
                          className="block px-4 py-2 text-sm font-light text-black dark:text-white hover:bg-gray-50 dark:hover:bg-gray-800 transition-all duration-200 transform hover:translate-x-1"
                        >
                          {billboard.label}
                        </Link>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Hệ thống cửa hàng */}
              <Link
                href="/stores"
                prefetch={true}
                className="relative text-sm font-light uppercase tracking-wider text-black dark:text-white hover:text-gray-600 dark:hover:text-gray-400 transition-colors pb-1 group/nav inline-flex items-center leading-none h-6"
              >
                Hệ thống cửa hàng
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-black dark:bg-white group-hover/nav:w-full transition-all duration-300 ease-out will-change-[width]"></span>
              </Link>
            </nav>

            {}
            <NavbarActions />
          </div>
        </Container>
      </div>
    </header>
  );
}
