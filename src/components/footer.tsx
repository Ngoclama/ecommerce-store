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
    setMounted(true);
  }, []);

  return (
    <footer className="bg-white text-black border-t border-gray-200">
      {/* Main Footer - Aigle Style */}
      <div className="border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-8 md:gap-12">
            {/* Help & Information */}
            <div>
              <h3 className="text-xs font-light text-black uppercase tracking-wider mb-4">
                Help & Information
              </h3>
              <ul className="space-y-2">
                <li>
                  <Link
                    href="/contact"
                    className="text-xs font-light text-gray-600 hover:text-black transition-colors"
                  >
                    Contact us
                  </Link>
                </li>
                <li>
                  <Link
                    href="/account"
                    className="text-xs font-light text-gray-600 hover:text-black transition-colors"
                  >
                    My account
                  </Link>
                </li>
                <li>
                  <Link
                    href="/orders"
                    className="text-xs font-light text-gray-600 hover:text-black transition-colors"
                  >
                    Follow my order
                  </Link>
                </li>
                <li>
                  <Link
                    href="/returns"
                    className="text-xs font-light text-gray-600 hover:text-black transition-colors"
                  >
                    Make a return
                  </Link>
                </li>
                <li>
                  <Link
                    href="/help"
                    className="text-xs font-light text-gray-600 hover:text-black transition-colors"
                  >
                    Help & FAQ
                  </Link>
                </li>
              </ul>
            </div>

            {/* Terms & conditions */}
            <div>
              <h3 className="text-xs font-light text-black uppercase tracking-wider mb-4">
                Terms & conditions
              </h3>
              <ul className="space-y-2">
                {footerLinks.legal.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-xs font-light text-gray-600 hover:text-black transition-colors"
                    >
                      {link.title}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* The brand */}
            <div>
              <h3 className="text-xs font-light text-black uppercase tracking-wider mb-4">
                The brand
              </h3>
              <ul className="space-y-2">
                <li>
                  <Link
                    href="/about"
                    className="text-xs font-light text-gray-600 hover:text-black transition-colors"
                  >
                    Legacy
                  </Link>
                </li>
                <li>
                  <Link
                    href="/know-how"
                    className="text-xs font-light text-gray-600 hover:text-black transition-colors"
                  >
                    Know-how
                  </Link>
                </li>
                <li>
                  <Link
                    href="/commitments"
                    className="text-xs font-light text-gray-600 hover:text-black transition-colors"
                  >
                    Commitments
                  </Link>
                </li>
                <li>
                  <Link
                    href="/sustainability"
                    className="text-xs font-light text-gray-600 hover:text-black transition-colors"
                  >
                    Sustainable development
                  </Link>
                </li>
              </ul>
            </div>

            {/* Products */}
            <div>
              <h3 className="text-xs font-light text-black uppercase tracking-wider mb-4">
                Products
              </h3>
              <ul className="space-y-2">
                <li>
                  <Link
                    href="/size-guide"
                    className="text-xs font-light text-gray-600 hover:text-black transition-colors"
                  >
                    Size guide
                  </Link>
                </li>
                <li>
                  <Link
                    href="/collections"
                    className="text-xs font-light text-gray-600 hover:text-black transition-colors"
                  >
                    Collection
                  </Link>
                </li>
              </ul>
            </div>

            {/* Newsletter & Social */}
            <div className="col-span-2 md:col-span-1 lg:col-span-2">
              <h3 className="text-xs font-light text-black uppercase tracking-wider mb-4">
                Stay connected
              </h3>
              <p className="text-xs font-light text-gray-600 mb-4">
                Đăng ký nhận thông tin về sản phẩm mới và ưu đãi đặc biệt
              </p>
              {mounted ? (
                <form className="flex gap-2 mb-6">
                  <Input
                    type="email"
                    placeholder="Email"
                    className="flex-1 h-9 text-xs border-b border-gray-300 rounded-none bg-transparent focus-visible:ring-0 focus-visible:border-black"
                  />
                  <Button
                    type="submit"
                    variant="outline"
                    className="h-9 px-4 text-xs rounded-none border-b border-gray-300"
                  >
                    Sign up
                  </Button>
                </form>
              ) : (
                <div className="flex gap-2 mb-6">
                  <div className="flex-1 h-9 bg-gray-100 animate-pulse" />
                  <div className="w-20 h-9 bg-gray-100 animate-pulse" />
                </div>
              )}

              {/* Social Links */}
              <div className="flex gap-3">
                <a
                  href="#"
                  className="text-gray-600 hover:text-black transition-colors"
                  aria-label="Facebook"
                >
                  <Facebook className="w-4 h-4" />
                </a>
                <a
                  href="#"
                  className="text-gray-600 hover:text-black transition-colors"
                  aria-label="Instagram"
                >
                  <Instagram className="w-4 h-4" />
                </a>
                <a
                  href="#"
                  className="text-gray-600 hover:text-black transition-colors"
                  aria-label="Twitter"
                >
                  <Twitter className="w-4 h-4" />
                </a>
                <a
                  href="#"
                  className="text-gray-600 hover:text-black transition-colors"
                  aria-label="Youtube"
                >
                  <Youtube className="w-4 h-4" />
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Payment Methods & Bottom Bar - Aigle Style */}
      <div className="border-t border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            {/* Payment Methods */}
            <div className="flex items-center gap-4">
              <span className="text-xs font-light text-gray-600">
                We accept
              </span>
              <div className="flex items-center gap-2">
                <span className="text-xs font-light text-gray-400">Visa</span>
                <span className="text-xs font-light text-gray-400">•</span>
                <span className="text-xs font-light text-gray-400">
                  Mastercard
                </span>
                <span className="text-xs font-light text-gray-400">•</span>
                <span className="text-xs font-light text-gray-400">PayPal</span>
                <span className="text-xs font-light text-gray-400">•</span>
                <span className="text-xs font-light text-gray-400">
                  Apple Pay
                </span>
              </div>
            </div>

            {/* Copyright */}
            <p
              className="text-xs font-light text-gray-600"
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
