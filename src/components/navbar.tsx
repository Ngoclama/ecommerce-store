import Container from "@/components/ui/container";
import Link from "next/link";
import Image from "next/image";
import getCategories from "@/actions/get-categories";
import { NavbarActions } from "./navbar-action";
import SearchBarWrapper from "./search-bar-wrapper";
import CategorySidebar from "./category-sidebar";
import MegaMenu from "./mega-menu";
import { Phone, MapPin } from "lucide-react";

export const revalidate = 0;

const Navbar = async () => {
  const categories = await getCategories();

  return (
    <header className="sticky top-0 z-50 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 shadow-sm">
      {/* Top Bar - Contact Info */}
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

      {/* Main Navbar */}
      <div className="bg-white dark:bg-gray-900">
        <Container>
          <div className="flex items-center h-16 md:h-20 px-4 sm:px-6 lg:px-8 gap-4 md:gap-6">
            {/* Category Menu Button - Mobile & Desktop */}
            <div className="shrink-0">
              <CategorySidebar categories={categories || []} />
            </div>

            {/* Logo */}
            <Link
              href="/"
              className="flex items-center gap-2 shrink-0 md:mx-auto"
            >
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
              <span className="text-lg md:text-2xl font-light text-black dark:text-white tracking-wider uppercase hidden sm:block">
                Thời trang
              </span>
            </Link>

            {/* Actions - Right side with Search, Account, Cart */}
            <div className="ml-auto flex items-center gap-2 md:gap-4">
              <NavbarActions />
            </div>
          </div>
        </Container>
      </div>

      {/* Mega Menu - Desktop Categories Navigation */}
      <MegaMenu categories={categories || []} />
    </header>
  );
};

export default Navbar;
