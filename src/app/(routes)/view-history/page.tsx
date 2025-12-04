"use client";

import Container from "@/components/ui/container";
import { motion } from "framer-motion";
import { Eye, Clock } from "lucide-react";
import { useAuth } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function ViewHistoryPage() {
  const { isSignedIn, isLoaded } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (isLoaded && !isSignedIn) {
      router.push("/sign-in");
    }
  }, [isLoaded, isSignedIn, router]);

  if (!isLoaded) {
    return (
      <div className="bg-white dark:bg-gray-900 min-h-screen py-12">
        <Container>
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-center h-64">
              <p className="text-gray-500 dark:text-gray-400 font-light">
                Đang tải...
              </p>
            </div>
          </div>
        </Container>
      </div>
    );
  }

  if (!isSignedIn) {
    return null;
  }

  // Lấy lịch sử xem từ localStorage
  const viewHistory = typeof window !== "undefined" 
    ? JSON.parse(localStorage.getItem("viewHistory") || "[]")
    : [];

  return (
    <div className="bg-white dark:bg-gray-900 min-h-screen py-12">
      <Container>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mb-12"
          >
            <h1 className="text-4xl md:text-5xl font-light text-black dark:text-white mb-2 uppercase tracking-wider">
              Lịch sử xem sản phẩm
            </h1>
            <p className="text-gray-600 dark:text-gray-400 font-light">
              Các sản phẩm bạn đã xem gần đây
            </p>
          </motion.div>

          {viewHistory.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 p-12 text-center"
            >
              <Eye className="w-16 h-16 text-gray-400 dark:text-gray-600 mx-auto mb-4" />
              <p className="text-gray-600 dark:text-gray-400 font-light">
                Bạn chưa xem sản phẩm nào
              </p>
            </motion.div>
          ) : (
            <div className="space-y-4">
              {viewHistory.map((item: any, index: number) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 p-6 hover:border-black dark:hover:border-white transition-colors"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-20 h-20 bg-gray-100 dark:bg-gray-800 shrink-0">
                      {item.image && (
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-full h-full object-cover"
                        />
                      )}
                    </div>
                    <div className="flex-1">
                      <h3 className="text-lg font-light text-black dark:text-white mb-1">
                        {item.name}
                      </h3>
                      <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400 font-light">
                        <Clock className="w-4 h-4" />
                        <span>{new Date(item.viewedAt).toLocaleDateString("vi-VN")}</span>
                      </div>
                    </div>
                    <a
                      href={`/product/${item.id}`}
                      className="border border-gray-400 dark:border-gray-500 px-6 py-2 text-sm font-light uppercase tracking-wider text-gray-600 dark:text-gray-300 hover:bg-gray-900 dark:hover:bg-gray-900 hover:border-gray-900 dark:hover:border-gray-900 hover:text-white hover:shadow-md hover:shadow-gray-400/20 transition-all duration-300 ease-in-out hover:scale-[1.01] active:scale-[0.99]"
                    >
                      Xem lại
                    </a>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </Container>
    </div>
  );
}

