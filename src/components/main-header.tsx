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

interface MainHeaderProps {
  categories: Category[];
  billboards: Billboard[];
}

export default function MainHeader({
  categories,
  billboards,
}: MainHeaderProps) {
  const router = useRouter();
  const pathname = usePathname();
  const cart = useCart();
  const { isSignedIn } = useAuth();
  const { getAllWishlistItems } = useWishlist();
  const [searchQuery, setSearchQuery] = useState("");
  const [mounted, setMounted] = useState(false);
  const [wishlistCount, setWishlistCount] = useState(0);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (isSignedIn) {
      getAllWishlistItems().then((items) => setWishlistCount(items.length));
    } else {
      setWishlistCount(cart.wishlistItems.length);
    }
  }, [isSignedIn, getAllWishlistItems, cart.wishlistItems]);

  // Build category tree
  const categoryTree = categories.reduce((acc, category) => {
    if (!category.parentId) {
      // Parent category
      acc[category.id] = {
        ...category,
        children: categories.filter((c) => c.parentId === category.id),
      };
    }
    return acc;
  }, {} as Record<string, Category & { children: Category[] }>);

  const parentCategories = Object.values(categoryTree);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery("");
    }
  };

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
                  Hotline:{" "}
                  <strong className="text-black dark:text-white">
                    +84 0123456789
                  </strong>
                </span>
              </div>
              <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                <MapPin className="w-4 h-4 text-black dark:text-white" />
                <span className="hidden xl:inline">
                  CS1: ĐẠI HỌC NGUYỄN TẤT THÀNH - Q12 - TP.HCM
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
            {/* Logo */}
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
                <Link
                  href="/categories"
                  prefetch={true}
                  className="relative text-sm font-light uppercase tracking-wider text-black dark:text-white hover:text-gray-600 dark:hover:text-gray-400 transition-colors pb-1 group/nav inline-flex items-center leading-none"
                >
                  Sản phẩm
                  <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-black dark:bg-white group-hover/nav:w-full transition-all duration-300 ease-out will-change-[width]"></span>
                </Link>
                {parentCategories.length > 0 && (
                  <div className="absolute left-1/2 -translate-x-1/2 top-full mt-2 w-auto min-w-[600px] max-w-[800px] bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-none shadow-xl opacity-0 invisible scale-95 -translate-y-2 group-hover:opacity-100 group-hover:visible group-hover:scale-100 group-hover:translate-y-0 pointer-events-none group-hover:pointer-events-auto z-50 transition-all duration-300 ease-out will-change-[opacity,transform]">
                    {/* Hover bridge to prevent dropdown from closing when moving mouse */}
                    <div className="absolute -top-2 left-0 right-0 h-2" />
                    <div className="p-6">
                      <div className="grid grid-cols-4 gap-8">
                        {parentCategories.map((category) => (
                          <div key={category.id} className="group/sub">
                            <Link
                              href={`/category/${category.id}`}
                              prefetch={true}
                              className="block mb-3 text-sm font-light text-black dark:text-white hover:text-gray-600 dark:hover:text-gray-400 transition-all duration-200 pb-1 relative underline decoration-1 underline-offset-4"
                            >
                              {category.name}
                            </Link>
                            {category.children &&
                              category.children.length > 0 && (
                                <div className="space-y-1.5">
                                  {category.children.map((child) => (
                                    <Link
                                      key={child.id}
                                      href={`/category/${child.id}`}
                                      prefetch={true}
                                      className="block text-xs font-light text-gray-600 dark:text-gray-400 hover:text-black dark:hover:text-white transition-all duration-200 py-1.5 transform hover:translate-x-1"
                                    >
                                      {child.name}
                                    </Link>
                                  ))}
                                </div>
                              )}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>
              {/* New */}
              <Link
                href="/products/new"
                prefetch={true}
                className="relative text-sm font-light uppercase tracking-wider text-black dark:text-white hover:text-gray-600 dark:hover:text-gray-400 transition-colors pb-1 group/nav inline-flex items-center leading-none h-6"
              >
                New
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
                    {/* Hover bridge to prevent dropdown from closing when moving mouse */}
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

            {/* Right Actions */}
            <div className="flex items-center gap-3 md:gap-4">
              {/* Search Popover */}
              <Popover>
                <PopoverTrigger asChild>
                  <button
                    className="p-2 text-black dark:text-white hover:text-gray-600 dark:hover:text-gray-400 transition-colors"
                    aria-label="Tìm kiếm"
                  >
                    <Search className="w-5 h-5" />
                  </button>
                </PopoverTrigger>
                <PopoverContent
                  className="w-80 p-0 rounded-none border border-gray-200 dark:border-gray-800"
                  align="end"
                >
                  <form onSubmit={handleSearch} className="p-4">
                    <div className="relative">
                      <Input
                        type="text"
                        placeholder="Tìm kiếm sản phẩm..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-10 pr-4 h-10 border border-gray-300 dark:border-gray-700 rounded-none bg-white dark:bg-gray-900 text-black dark:text-white focus-visible:ring-0 focus-visible:ring-offset-0"
                        autoFocus
                      />
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                    </div>
                  </form>
                </PopoverContent>
              </Popover>

              {/* User Account */}
              {mounted && (
                <div className="relative">
                  {isSignedIn ? (
                    <UserButton
                      appearance={{
                        elements: {
                          avatarBox: "w-8 h-8",
                          userButtonPopoverCard:
                            "rounded-none border border-gray-200 shadow-xl bg-white",
                        },
                      }}
                      afterSignOutUrl="/"
                    />
                  ) : (
                    <Link
                      href="/sign-in"
                      className="p-2 text-black dark:text-white hover:text-gray-600 dark:hover:text-gray-400 transition-colors"
                      aria-label="Đăng nhập"
                    >
                      <User className="w-5 h-5" />
                    </Link>
                  )}
                </div>
              )}

              {/* Wishlist */}
              <Link
                href="/wishlist"
                className="relative p-2 text-black dark:text-white hover:text-gray-600 dark:hover:text-gray-400 transition-colors"
                aria-label="Danh sách yêu thích"
              >
                <Heart className="w-5 h-5" />
                {wishlistCount > 0 && (
                  <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] bg-black dark:bg-white text-white dark:text-black text-[10px] rounded-full flex items-center justify-center font-medium px-1">
                    {wishlistCount > 99 ? "99+" : wishlistCount}
                  </span>
                )}
              </Link>

              {/* Cart */}
              <Link
                href="/cart"
                className="relative p-2 text-black dark:text-white hover:text-gray-600 dark:hover:text-gray-400 transition-colors"
                aria-label="Giỏ hàng"
              >
                <ShoppingBag className="w-5 h-5" />
                {cart.items.length > 0 && (
                  <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] bg-black dark:bg-white text-white dark:text-black text-[10px] rounded-full flex items-center justify-center font-medium px-1">
                    {cart.items.length > 99 ? "99+" : cart.items.length}
                  </span>
                )}
              </Link>
            </div>
          </div>
        </Container>
      </div>
    </header>
  );
}
