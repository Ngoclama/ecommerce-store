import Container from "@/components/ui/container";
import Link from "next/link";
import getCategories from "@/actions/get-categories";
import { NavbarActions } from "./navbar-action";
import SearchBarWrapper from "./search-bar-wrapper";
import CategorySidebar from "./category-sidebar";
import { Phone, MapPin } from "lucide-react";

export const revalidate = 0;

const Navbar = async () => {
  const categories = await getCategories();

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-gray-200 shadow-sm">
      {/* Top Bar - Contact Info */}
      <div className="bg-gray-50 border-b border-gray-200 hidden lg:block">
        <Container>
          <div className="flex items-center justify-between h-10 px-4 sm:px-6 lg:px-8 text-xs">
            <div className="flex items-center gap-6">
              <div className="flex items-center gap-2 text-gray-600">
                <Phone className="w-4 h-4 text-black" />
                <span>
                  Hotline:{" "}
                  <strong className="text-black">+84 0123456789</strong>
                </span>
              </div>
              <div className="flex items-center gap-2 text-gray-600">
                <MapPin className="w-4 h-4 text-black" />
                <span className="hidden xl:inline">
                  CS1: ĐẠI HỌC NGUYỄN TẤT THÀNH - Q12 - TP.HCM
                </span>
              </div>
            </div>
            <div className="flex items-center gap-4 text-gray-600">
              <Link
                href="/about"
                className="hover:text-black transition-colors font-light uppercase tracking-wide text-xs"
              >
                Về chúng tôi
              </Link>
              <span className="text-gray-400">|</span>
              <Link
                href="/contact"
                className="hover:text-black transition-colors font-light uppercase tracking-wide text-xs"
              >
                Liên hệ
              </Link>
            </div>
          </div>
        </Container>
      </div>

      {/* Main Navbar */}
      <div className="bg-white">
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
              <div className="w-10 h-10 border border-gray-300 flex items-center justify-center rounded-none bg-white">
                <span className="text-xl md:text-2xl font-light text-black">
                  T
                </span>
              </div>
              <span className="text-lg md:text-2xl font-light text-black tracking-wider uppercase hidden sm:block">
                Thời trang
              </span>
            </Link>

            {/* Search Bar - Desktop */}
            <div className="hidden lg:flex flex-1 max-w-md mx-8">
              <SearchBarWrapper />
            </div>

            {/* Actions */}
            <div className="ml-auto flex items-center gap-2 md:gap-4">
              <NavbarActions />
            </div>
          </div>
        </Container>
      </div>

      {/* Search Bar - Mobile */}
      <div className="lg:hidden border-t border-gray-200 bg-white">
        <Container>
          <div className="px-4 py-3">
            <SearchBarWrapper />
          </div>
        </Container>
      </div>
    </header>
  );
};

export default Navbar;
