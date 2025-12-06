"use client";

import { useEffect, useState, useRef } from "react";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";

// Mapping tên trang từ pathname
const getPageName = (pathname: string): string => {
  const pathMap: Record<string, string> = {
    "/": "Trang chủ",
    "/blog": "Blog",
    "/cart": "Giỏ hàng",
    "/wishlist": "Danh sách yêu thích",
    "/categories": "Danh mục",
    "/search": "Tìm kiếm",
    "/account": "Tài khoản",
    "/account/orders": "Đơn hàng",
    "/account/profile-details": "Thông tin cá nhân",
    "/view-history": "Lịch sử xem",
    "/products/bestsellers": "Sản phẩm bán chạy",
    "/products/new": "Sản phẩm mới",
    "/products/featured": "Sản phẩm nổi bật",
  };

  // Check exact matches first
  if (pathMap[pathname]) {
    return pathMap[pathname];
  }

  // Check dynamic routes
  if (pathname.startsWith("/product/")) {
    return "Chi tiết sản phẩm";
  }
  if (pathname.startsWith("/category/")) {
    return "Danh mục sản phẩm";
  }
  if (pathname.startsWith("/blog/")) {
    return "Bài viết";
  }
  if (pathname.startsWith("/billboard/")) {
    return "Banner";
  }

  // Default
  return "Đang tải trang";
};

export function PageLoadingOverlay() {
  const pathname = usePathname();
  const [isLoading, setIsLoading] = useState(false);
  const [pageName, setPageName] = useState("Đang tải trang");
  const prevPathnameRef = useRef(pathname);
  const loadingTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    // Listen for link clicks to show loading immediately
    const handleLinkClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const link = target.closest("a");

      if (link && link.href) {
        // Check if link is disabled or has preventDefault
        if (link.hasAttribute("disabled") || link.getAttribute("aria-disabled") === "true") {
          return;
        }

        try {
          const url = new URL(link.href);
          // Only show loading for internal navigation
          if (url.origin === window.location.origin) {
            setIsLoading(true);
            setPageName(getPageName(url.pathname));
          }
        } catch (error) {
          // Invalid URL, ignore
        }
      }
    };

    // Listen for navigation start
    const handleNavigationStart = () => {
      setIsLoading(true);
    };

    // Use capture phase to catch clicks early, but don't prevent default
    document.addEventListener("click", handleLinkClick, true);
    window.addEventListener("beforeunload", handleNavigationStart);

    return () => {
      document.removeEventListener("click", handleLinkClick, true);
      window.removeEventListener("beforeunload", handleNavigationStart);
      if (loadingTimeoutRef.current) {
        clearTimeout(loadingTimeoutRef.current);
      }
    };
  }, []);

  useEffect(() => {
    // Only show loading if pathname actually changed
    if (prevPathnameRef.current !== pathname) {
      // Use requestAnimationFrame to defer setState
      requestAnimationFrame(() => {
        setIsLoading(true);
        setPageName(getPageName(pathname));
      });
      prevPathnameRef.current = pathname;

      // Clear any existing timeout
      if (loadingTimeoutRef.current) {
        clearTimeout(loadingTimeoutRef.current);
      }

      // Minimum loading time for smooth UX (400ms)
      // Maximum loading time to prevent infinite loading (10s)
      const minLoadingTime = 400;
      const maxLoadingTime = 10000; // 10 seconds max

      loadingTimeoutRef.current = setTimeout(() => {
        setIsLoading(false);
      }, minLoadingTime);

      // Safety timeout: force hide loading after max time
      const maxTimeout = setTimeout(() => {
        console.warn("[PageLoadingOverlay] Loading timeout - forcing hide");
        setIsLoading(false);
      }, maxLoadingTime);

      return () => {
        if (loadingTimeoutRef.current) {
          clearTimeout(loadingTimeoutRef.current);
        }
        clearTimeout(maxTimeout);
      };
    }
  }, [pathname]);

  return (
    <AnimatePresence>
      {isLoading && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 z-[9999] bg-white/90 dark:bg-gray-900/90 backdrop-blur-md flex items-center justify-center"
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            transition={{ duration: 0.3, ease: [0.25, 0.1, 0.25, 1] }}
            className="flex flex-col items-center gap-6"
          >
            {/* Spinner */}
            <motion.div
              animate={{ rotate: 360 }}
              transition={{
                duration: 1,
                repeat: Infinity,
                ease: "linear",
              }}
              className="relative w-16 h-16"
            >
              <div className="absolute inset-0 w-16 h-16 border-4 border-neutral-200 dark:border-neutral-800 rounded-full" />
              <motion.div
                animate={{ rotate: 360 }}
                transition={{
                  duration: 1,
                  repeat: Infinity,
                  ease: "linear",
                }}
                className="absolute inset-0 w-16 h-16 border-4 border-transparent border-t-neutral-900 dark:border-t-neutral-100 rounded-full"
              />
            </motion.div>

            {/* Page Name */}
            <motion.div
              initial={{ y: 10, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.1, duration: 0.3 }}
              className="text-center"
            >
              <p className="text-sm font-light uppercase tracking-[0.15em] text-neutral-900 dark:text-neutral-100 mb-2">
                {pageName}
              </p>
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: "100%" }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="h-px bg-gradient-to-r from-transparent via-neutral-900 to-transparent dark:via-neutral-100 max-w-[200px]"
              />
            </motion.div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
