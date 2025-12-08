"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import { useState, useEffect } from "react";
import {
  Facebook,
  Instagram,
  Twitter,
  Youtube,
  Mail,
  Phone,
  MapPin,
} from "lucide-react";

const footerLinks = {
  shop: [
    { title: "Sản phẩm mới", href: "/?new=true" },
    { title: "Bán chạy nhất", href: "/?bestseller=true" },
    { title: "Giảm giá", href: "/?sale=true" },
    { title: "Bộ sưu tập", href: "/collections" },
  ],
  customer: [
    { title: "Hướng dẫn mua hàng", href: "/help/shopping" },
    { title: "Chính sách đổi trả", href: "/help/returns" },
    { title: "Vận chuyển", href: "/help/shipping" },
    { title: "Bảo hành", href: "/help/warranty" },
  ],
  company: [
    { title: "Về chúng tôi", href: "/about" },
    { title: "Tuyển dụng", href: "/careers" },
    { title: "Liên hệ", href: "/contact" },
    { title: "Blog", href: "/blog" },
  ],
  legal: [
    { title: "Điều khoản sử dụng", href: "/legal/terms" },
    { title: "Chính sách bảo mật", href: "/legal/privacy" },
    { title: "Chính sách cookie", href: "/legal/cookies" },
  ],
};

export default function Footer() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    
    requestAnimationFrame(() => {
      setMounted(true);
    });
  }, []);

  return (
    <footer className="bg-white dark:bg-gray-900 text-black dark:text-white border-t border-gray-200 dark:border-gray-800">
      {}
      <div className="border-b border-gray-200 dark:border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-8 md:gap-12">
            {}
            <div>
              <h3 className="text-xs font-light text-black dark:text-white uppercase tracking-wider mb-4">
                Trợ giúp & Thông tin
              </h3>
              <ul className="space-y-2">
                <li>
                  <Link
                    href="/contact"
                    prefetch={true}
                    className="text-xs font-light text-gray-600 dark:text-gray-400 hover:text-black dark:hover:text-white transition-colors duration-200"
                  >
                    Liên hệ
                  </Link>
                </li>
                <li>
                  <Link
                    href="/account"
                    prefetch={true}
                    className="text-xs font-light text-gray-600 dark:text-gray-400 hover:text-black dark:hover:text-white transition-colors duration-200"
                  >
                    Tài khoản của tôi
                  </Link>
                </li>
                <li>
                  <Link
                    href="/account/orders"
                    prefetch={true}
                    className="text-xs font-light text-gray-600 dark:text-gray-400 hover:text-black dark:hover:text-white transition-colors duration-200"
                  >
                    Theo dõi đơn hàng
                  </Link>
                </li>
                <li>
                  <Link
                    href="/returns"
                    prefetch={true}
                    className="text-xs font-light text-gray-600 dark:text-gray-400 hover:text-black dark:hover:text-white transition-colors duration-200"
                  >
                    Đổi trả hàng
                  </Link>
                </li>
                <li>
                  <Link
                    href="/help"
                    prefetch={true}
                    className="text-xs font-light text-gray-600 dark:text-gray-400 hover:text-black dark:hover:text-white transition-colors duration-200"
                  >
                    Trợ giúp & FAQ
                  </Link>
                </li>
                <li>
                  <Link
                    href="/view-history"
                    className="text-xs font-light text-gray-600 dark:text-gray-400 hover:text-black dark:hover:text-white transition-colors"
                  >
                    Lịch sử xem sản phẩm
                  </Link>
                </li>
              </ul>
            </div>

            {/* Terms & conditions */}
            <div>
              <h3 className="text-xs font-light text-black dark:text-white uppercase tracking-wider mb-4">
                Điều khoản & Điều kiện
              </h3>
              <ul className="space-y-2">
                <li>
                  <Link
                    href="/terms-of-service"
                    className="text-xs font-light text-gray-600 dark:text-gray-400 hover:text-black dark:hover:text-white transition-colors"
                  >
                    Điều khoản dịch vụ
                  </Link>
                </li>
                <li>
                  <Link
                    href="/privacy-policy"
                    className="text-xs font-light text-gray-600 dark:text-gray-400 hover:text-black dark:hover:text-white transition-colors"
                  >
                    Chính sách bảo mật
                  </Link>
                </li>
                <li>
                  <Link
                    href="/cookie-policy"
                    className="text-xs font-light text-gray-600 dark:text-gray-400 hover:text-black dark:hover:text-white transition-colors"
                  >
                    Chính sách cookie
                  </Link>
                </li>
              </ul>
            </div>

            {/* The brand */}
            <div>
              <h3 className="text-xs font-light text-black dark:text-white uppercase tracking-wider mb-4">
                Thương hiệu
              </h3>
              <ul className="space-y-2">
                <li>
                  <Link
                    href="/about"
                    prefetch={true}
                    className="text-xs font-light text-gray-600 dark:text-gray-400 hover:text-black dark:hover:text-white transition-colors duration-200"
                  >
                    Về chúng tôi
                  </Link>
                </li>
                <li>
                  <Link
                    href="/know-how"
                    className="text-xs font-light text-gray-600 dark:text-gray-400 hover:text-black dark:hover:text-white transition-colors"
                  >
                    Bí quyết
                  </Link>
                </li>
                <li>
                  <Link
                    href="/commitments"
                    className="text-xs font-light text-gray-600 dark:text-gray-400 hover:text-black dark:hover:text-white transition-colors"
                  >
                    Cam kết
                  </Link>
                </li>
                <li>
                  <Link
                    href="/sustainability"
                    className="text-xs font-light text-gray-600 dark:text-gray-400 hover:text-black dark:hover:text-white transition-colors"
                  >
                    Phát triển bền vững
                  </Link>
                </li>
              </ul>
            </div>

            {/* Products */}
            <div>
              <h3 className="text-xs font-light text-black dark:text-white uppercase tracking-wider mb-4">
                Sản phẩm
              </h3>
              <ul className="space-y-2">
                <li>
                  <Link
                    href="/size-guide"
                    className="text-xs font-light text-gray-600 dark:text-gray-400 hover:text-black dark:hover:text-white transition-colors"
                  >
                    Hướng dẫn chọn size
                  </Link>
                </li>
                <li>
                  <Link
                    href="/categories"
                    className="text-xs font-light text-gray-600 dark:text-gray-400 hover:text-black dark:hover:text-white transition-colors"
                  >
                    Bộ sưu tập
                  </Link>
                </li>
              </ul>
            </div>

            {}
            <div className="col-span-2 md:col-span-1 lg:col-span-2">
              <h3 className="text-xs font-light text-black dark:text-white uppercase tracking-wider mb-4">
                Kết nối với chúng tôi
              </h3>
              <p className="text-xs font-light text-gray-600 dark:text-gray-400 mb-4">
                Đăng ký nhận thông tin về sản phẩm mới và ưu đãi đặc biệt
              </p>
              {mounted ? (
                <form className="flex gap-2 mb-6">
                  <Input
                    type="email"
                    placeholder="Email của bạn"
                    className="flex-1 h-9 text-xs border-b border-gray-300 rounded-none bg-transparent focus-visible:ring-0 focus-visible:border-black"
                  />
                  <Button
                    type="submit"
                    variant="outline"
                    className="h-9 px-4 text-xs rounded-none border-b border-gray-300"
                  >
                    Đăng ký
                  </Button>
                </form>
              ) : (
                <div className="flex gap-2 mb-6">
                  <div className="flex-1 h-9 bg-gray-100 animate-pulse" />
                  <div className="w-20 h-9 bg-gray-100 animate-pulse" />
                </div>
              )}

              {}
              <div className="flex gap-3">
                <a
                  href="#"
                  className="text-gray-600 dark:text-gray-400 hover:text-black dark:hover:text-white transition-colors"
                  aria-label="Facebook"
                >
                  <Facebook className="w-4 h-4" />
                </a>
                <a
                  href="#"
                  className="text-gray-600 dark:text-gray-400 hover:text-black dark:hover:text-white transition-colors"
                  aria-label="Instagram"
                >
                  <Instagram className="w-4 h-4" />
                </a>
                <a
                  href="#"
                  className="text-gray-600 dark:text-gray-400 hover:text-black dark:hover:text-white transition-colors"
                  aria-label="Twitter"
                >
                  <Twitter className="w-4 h-4" />
                </a>
                <a
                  href="#"
                  className="text-gray-600 dark:text-gray-400 hover:text-black dark:hover:text-white transition-colors"
                  aria-label="Youtube"
                >
                  <Youtube className="w-4 h-4" />
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>

      {}
      <div className="border-t border-gray-200 dark:border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            {}
            <div className="flex items-center gap-4">
              <span className="text-xs font-light text-gray-600 dark:text-gray-400">
                Chúng tôi chấp nhận
              </span>
              <div className="flex items-center gap-2">
                <span className="text-xs font-light text-gray-400 dark:text-gray-600">
                  COD
                </span>
                <span className="text-xs font-light text-gray-400 dark:text-gray-600">
                  •
                </span>
                <span className="text-xs font-light text-gray-400 dark:text-gray-600">
                  Visa/Mastercard
                </span>
                <span className="text-xs font-light text-gray-400 dark:text-gray-600">
                  •
                </span>
                <span className="text-xs font-light text-pink-600 dark:text-pink-500">
                  MoMo
                </span>
              </div>
            </div>

            {}
            <p
              className="text-xs font-light text-gray-600 dark:text-gray-400"
              suppressHydrationWarning
            >
              © {new Date().getFullYear()} THỜI TRANG
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
