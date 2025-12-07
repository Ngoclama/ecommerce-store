"use client";

import { Settings, MessageCircle, Moon, Sun } from "lucide-react";
import { Button } from "./ui/button";
import { cn } from "@/lib/utils";
import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

// Tạo một hook an toàn để sử dụng theme - đồng bộ với ThemeProvider
function useThemeSafe() {
  const [theme, setTheme] = useState<"light" | "dark">("light");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // Use requestAnimationFrame to defer setState
    requestAnimationFrame(() => {
      setMounted(true);
    });
    // Lấy theme từ localStorage hoặc system preference
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
      if (newTheme && newTheme !== theme) {
        setTheme(newTheme);
        if (newTheme === "dark") {
          root.classList.add("dark");
        } else {
          root.classList.remove("dark");
        }
      }
    };

    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === "light" ? "dark" : "light";
    setTheme(newTheme);
    localStorage.setItem("theme", newTheme);

    const root = document.documentElement;
    if (newTheme === "dark") {
      root.classList.add("dark");
    } else {
      root.classList.remove("dark");
    }

    window.dispatchEvent(new Event("theme-change"));
  };

  return { theme, toggleTheme, mounted };
}

const FloatingButtons = () => {
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const { theme, toggleTheme, mounted } = useThemeSafe();

  // Đóng dropdown khi click bên ngoài
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsSettingsOpen(false);
      }
    };

    if (isSettingsOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isSettingsOpen]);

  return (
    <div className="fixed right-4 bottom-4 z-50 flex flex-col gap-2">
      {/* Settings Button với Dark Mode Toggle */}
      <div className="relative" ref={dropdownRef}>
        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
          <Button
            size="icon"
            onClick={() => setIsSettingsOpen(!isSettingsOpen)}
            className={cn(
              "w-12 h-12 rounded-none bg-white dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 text-black dark:text-white border border-black dark:border-white",
              "transition-all"
            )}
            aria-label="Cài đặt"
          >
            <Settings className="w-5 h-5" />
          </Button>
        </motion.div>

        <AnimatePresence>
          {isSettingsOpen && mounted && (
            <motion.div
              initial={{ opacity: 0, y: -10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.95 }}
              transition={{ duration: 0.15 }}
              className="absolute right-0 bottom-full mb-2 w-48 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-none shadow-lg"
            >
              <div className="p-2">
                {/* Dark Mode Toggle */}
                <button
                  onClick={() => {
                    toggleTheme();
                    setIsSettingsOpen(false);
                  }}
                  className="w-full flex items-center justify-between px-3 py-2 text-sm text-black dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors rounded-none"
                >
                  <div className="flex items-center gap-3">
                    {theme === "dark" ? (
                      <Sun className="w-4 h-4" />
                    ) : (
                      <Moon className="w-4 h-4" />
                    )}
                    <span className="font-light uppercase tracking-wide">
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
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Messenger Chat Button - Aigle Style */}
      <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
        <Button
          size="icon"
          className={cn(
            "w-12 h-12 rounded-none bg-white dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 text-black dark:text-white border border-black dark:border-white",
            "transition-all"
          )}
          aria-label="Contact us"
          onClick={() => {
            // Có thể mở Messenger hoặc chat widget
            window.open("https://m.me/your-page", "_blank");
          }}
        >
          <MessageCircle className="w-5 h-5" />
        </Button>
      </motion.div>
    </div>
  );
};

export default FloatingButtons;
