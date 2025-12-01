"use client";

import { useState, useRef, useEffect } from "react";
import {
  Settings,
  Moon,
  Sun,
  MessageCircle,
  X,
  Phone,
  MessageSquare,
  ArrowUp,
  MoreVertical,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

// Tạo một hook an toàn để sử dụng theme - đồng bộ với ThemeProvider
function useThemeSafe() {
  const [theme, setTheme] = useState<"light" | "dark">("light");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    // Lấy theme từ localStorage, mặc định là light mode
    const savedTheme = localStorage.getItem("theme") as "light" | "dark" | null;
    const initialTheme = savedTheme || "light";
    setTheme(initialTheme);

    // Apply theme to document ngay lập tức
    const root = document.documentElement;
    if (initialTheme === "dark") {
      root.classList.add("dark");
    } else {
      root.classList.remove("dark");
    }

    // Lắng nghe thay đổi từ ThemeProvider (nếu có)
    const handleStorageChange = () => {
      const newTheme = localStorage.getItem("theme") as "light" | "dark" | null;
      if (newTheme) {
        setTheme((currentTheme) => {
          if (newTheme !== currentTheme) {
            const root = document.documentElement;
            if (newTheme === "dark") {
              root.classList.add("dark");
            } else {
              root.classList.remove("dark");
            }
            return newTheme;
          }
          return currentTheme;
        });
      }
    };

    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === "light" ? "dark" : "light";
    setTheme(newTheme);
    localStorage.setItem("theme", newTheme);

    // Apply theme to document
    const root = document.documentElement;
    if (newTheme === "dark") {
      root.classList.add("dark");
    } else {
      root.classList.remove("dark");
    }

    // Dispatch custom event để ThemeProvider có thể lắng nghe
    window.dispatchEvent(new Event("theme-change"));
  };

  return { theme, toggleTheme, mounted };
}

export const SettingsButton: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const { theme, toggleTheme, mounted } = useThemeSafe();

  // Scroll detection để hiển thị buttons khi scroll qua billboard
  useEffect(() => {
    // Chỉ chạy trên client-side và sau khi component đã mount
    if (typeof window === "undefined" || !mounted) return;

    const handleScroll = () => {
      // Kiểm tra nếu đang ở đầu trang thì ẩn nút
      if (window.scrollY < 50) {
        setIsVisible(false);
        return;
      }

      // Tìm billboard section (thường là section đầu tiên với class chứa billboard)
      const billboardSection = document.querySelector(
        'section[class*="billboard"], section:first-of-type'
      );
      if (billboardSection) {
        const rect = billboardSection.getBoundingClientRect();
        // Kiểm tra xem có đang ở trong billboard không (billboard còn visible trên màn hình)
        const isInBillboard = rect.top < window.innerHeight && rect.bottom > 0;

        // Nếu đang ở trong billboard thì ẩn, nếu đã scroll qua (billboard ở trên) thì hiện
        if (isInBillboard) {
          setIsVisible(false);
        } else if (rect.bottom < 0) {
          // Đã scroll qua billboard (billboard ở phía trên)
          setIsVisible(true);
        } else {
          // Chưa đến billboard
          setIsVisible(false);
        }
      } else {
        // Fallback: chỉ hiển thị sau khi scroll 300px
        const shouldShow = window.scrollY > 300;
        setIsVisible(shouldShow);
      }
    };

    // Delay để đảm bảo DOM đã render hoàn toàn
    const timeoutId = setTimeout(() => {
      handleScroll();
    }, 100);

    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => {
      clearTimeout(timeoutId);
      window.removeEventListener("scroll", handleScroll);
    };
  }, [mounted]);

  // Đóng dropdown khi click bên ngoài
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsMenuOpen(false);
      }
    };

    if (isMenuOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isMenuOpen]);

  // Scroll to top function
  const scrollToTop = () => {
    // Ẩn nút ngay khi bắt đầu scroll
    setIsVisible(false);

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  if (!mounted) {
    return null;
  }

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: 20, scale: 0.8 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 20, scale: 0.8 }}
          transition={{
            type: "spring",
            stiffness: 300,
            damping: 25,
            duration: 0.3,
          }}
          className="fixed bottom-6 right-6 z-50 flex flex-col gap-2"
        >
          {/* Scroll to Top Button - Riêng biệt */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={scrollToTop}
            className="w-10 h-10 text-black dark:text-white bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-none shadow-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-all duration-200 flex items-center justify-center"
            aria-label="Lên đầu trang"
          >
            <ArrowUp className="w-4 h-4" />
          </motion.button>

          {/* Menu Button - Gộp Settings và Message */}
          <div className="relative" ref={menuRef}>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="w-10 h-10 text-black dark:text-white bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-none shadow-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-all duration-200 flex items-center justify-center"
              aria-label="Menu"
            >
              <MoreVertical className="w-4 h-4" />
            </motion.button>

            <AnimatePresence>
              {isMenuOpen && (
                <motion.div
                  initial={{ opacity: 0, y: 10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 10, scale: 0.95 }}
                  transition={{
                    type: "spring",
                    stiffness: 400,
                    damping: 25,
                    duration: 0.2,
                  }}
                  className="absolute right-0 bottom-full mb-2 w-56 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-none shadow-xl z-50"
                >
                  <div className="p-2">
                    {/* Dark Mode Toggle */}
                    <button
                      onClick={() => {
                        toggleTheme();
                        setIsMenuOpen(false);
                      }}
                      className="w-full flex items-center justify-between px-3 py-2 text-sm text-black dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors rounded-none mb-1"
                    >
                      <div className="flex items-center gap-3">
                        {theme === "dark" ? (
                          <Sun className="w-4 h-4" />
                        ) : (
                          <Moon className="w-4 h-4" />
                        )}
                        <span className="font-light uppercase tracking-wide text-xs">
                          {theme === "dark" ? "Chế độ sáng" : "Chế độ tối"}
                        </span>
                      </div>
                      <div
                        className={cn(
                          "w-10 h-5 rounded-full relative transition-colors",
                          theme === "dark" ? "bg-black" : "bg-gray-300"
                        )}
                      >
                        <motion.div
                          layout
                          transition={{
                            type: "spring",
                            stiffness: 500,
                            damping: 30,
                          }}
                          className={cn(
                            "absolute top-0.5 w-4 h-4 rounded-full bg-white shadow-sm",
                            theme === "dark" ? "right-0.5" : "left-0.5"
                          )}
                        />
                      </div>
                    </button>

                    {/* Divider */}
                    <div className="border-t border-gray-200 dark:border-gray-700 my-1" />

                    {/* Message Options */}
                    <div className="space-y-1">
                      <a
                        href="https://zalo.me/0123456789"
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={() => setIsMenuOpen(false)}
                        className="flex items-center gap-3 px-3 py-2 text-sm text-black dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors rounded-none"
                      >
                        <MessageSquare className="w-4 h-4" />
                        <span className="font-light uppercase tracking-wide text-xs">
                          Zalo
                        </span>
                      </a>
                      <a
                        href="tel:+840123456789"
                        onClick={() => setIsMenuOpen(false)}
                        className="flex items-center gap-3 px-3 py-2 text-sm text-black dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors rounded-none"
                      >
                        <Phone className="w-4 h-4" />
                        <span className="font-light uppercase tracking-wide text-xs">
                          Điện thoại
                        </span>
                      </a>
                      <a
                        href="https://m.me/yourpage"
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={() => setIsMenuOpen(false)}
                        className="flex items-center gap-3 px-3 py-2 text-sm text-black dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors rounded-none"
                      >
                        <MessageCircle className="w-4 h-4" />
                        <span className="font-light uppercase tracking-wide text-xs">
                          Messenger
                        </span>
                      </a>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
