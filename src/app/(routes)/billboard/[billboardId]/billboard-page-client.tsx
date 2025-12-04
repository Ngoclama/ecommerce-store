"use client";

import React, { useState } from "react";
import { Billboard, Category } from "@/types";
import Container from "@/components/ui/container";
import CategoryList from "@/components/category-list";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, ChevronRight, Sparkles, Grid3x3, List } from "lucide-react";
import { cn } from "@/lib/utils";

interface BillboardPageClientProps {
  billboard: Billboard;
  categories: Category[];
}

const BillboardPageClient: React.FC<BillboardPageClientProps> = ({
  billboard,
  categories,
}) => {
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  return (
    <div className="bg-white dark:bg-gray-900 min-h-screen">
      {/* Hero Section with Billboard Image */}
      <div className="relative w-full min-h-[60vh] md:min-h-[70vh] lg:min-h-[80vh] overflow-hidden">
        {/* Background Image */}
        {billboard.imageUrl && (
          <div className="absolute inset-0">
            <Image
              src={billboard.imageUrl}
              alt={billboard.label}
              fill
              priority
              sizes="100vw"
              className="object-cover"
            />
            {/* Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black/80" />
          </div>
        )}

        {/* Content Overlay */}
        <Container>
          <div className="relative z-10 px-4 sm:px-6 lg:px-8 py-16 md:py-24 lg:py-32">
            {/* Back Button */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              className="mb-8"
            >
              <Link
                href="/categories"
                className="inline-flex items-center gap-2 text-sm font-light uppercase tracking-wider text-white/90 hover:text-white transition-colors group"
              >
                <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
                Quay lại Danh mục
              </Link>
            </motion.div>

            {/* Main Content */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="max-w-4xl"
            >
              {/* Badge */}
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6, delay: 0.4 }}
                className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-md border border-white/20 rounded-full mb-6"
              >
                <Sparkles className="w-4 h-4 text-yellow-400" />
                <span className="text-xs font-light uppercase tracking-wider text-white">
                  Bộ sưu tập
                </span>
              </motion.div>

              {/* Title */}
              <h1 className="text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-light text-white mb-6 leading-tight uppercase tracking-tight">
                {billboard.label}
              </h1>

              {/* Description */}
              {billboard.description && (
                <motion.p
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 0.5 }}
                  className="text-lg md:text-xl text-white/90 font-light leading-relaxed max-w-3xl mb-8"
                >
                  {billboard.description}
                </motion.p>
              )}

              {/* Stats */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.6 }}
                className="flex flex-wrap items-center gap-6 text-white/80"
              >
                <div className="flex items-center gap-2">
                  <div className="w-1 h-1 bg-yellow-400 rounded-full" />
                  <span className="text-sm font-light uppercase tracking-wide">
                    {categories.length} Danh mục
                  </span>
                </div>
              </motion.div>
            </motion.div>
          </div>
        </Container>

        {/* Decorative Elements */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          {Array.from({ length: 15 }).map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-1 h-1 bg-white/30 rounded-full"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
              }}
              animate={{
                opacity: [0, 1, 0],
                scale: [0, 1, 0],
                y: [0, -50],
              }}
              transition={{
                duration: 3 + Math.random() * 2,
                repeat: Infinity,
                delay: Math.random() * 3,
                ease: "easeOut",
              }}
            />
          ))}
        </div>
      </div>

      {/* Categories Section */}
      <Container>
        <div className="px-4 sm:px-6 lg:px-8 py-16 lg:py-24">
          {/* Section Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6 }}
            className="mb-12 flex flex-col md:flex-row md:items-center md:justify-between gap-6"
          >
            <div>
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-light text-black dark:text-white uppercase tracking-tight mb-3">
                Danh mục trong bộ sưu tập
              </h2>
              <div className="w-20 md:w-24 h-px bg-black dark:bg-white mb-4" />
              <p className="text-sm text-gray-600 dark:text-gray-400 font-light">
                Khám phá các danh mục thuộc bộ sưu tập {billboard.label}
              </p>
            </div>

            {/* View Mode Toggle */}
            {categories.length > 0 && (
              <div className="flex items-center gap-2">
                <span className="text-xs font-light text-gray-500 dark:text-gray-400 uppercase tracking-wide">
                  Chế độ xem:
                </span>
                <div className="flex items-center border border-gray-300 dark:border-gray-600 rounded-sm overflow-hidden">
                  <button
                    onClick={() => setViewMode("grid")}
                    className={cn(
                      "p-2 transition-all duration-200",
                      viewMode === "grid"
                        ? "bg-black dark:bg-white text-white dark:text-black"
                        : "bg-white dark:bg-gray-900 text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800"
                    )}
                    aria-label="Xem dạng lưới"
                  >
                    <Grid3x3 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setViewMode("list")}
                    className={cn(
                      "p-2 transition-all duration-200",
                      viewMode === "list"
                        ? "bg-black dark:bg-white text-white dark:text-black"
                        : "bg-white dark:bg-gray-900 text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800"
                    )}
                    aria-label="Xem dạng danh sách"
                  >
                    <List className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}
          </motion.div>

          {/* Categories Content */}
          {categories.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="py-20 text-center"
            >
              <div className="max-w-md mx-auto space-y-4">
                <div className="w-16 h-16 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto">
                  <Sparkles className="w-8 h-8 text-gray-400" />
                </div>
                <h3 className="text-xl font-light text-black dark:text-white uppercase tracking-wide">
                  Chưa có danh mục
                </h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 font-light leading-relaxed">
                  Bộ sưu tập này hiện chưa có danh mục nào. Vui lòng quay lại sau.
                </p>
                <Link
                  href="/categories"
                  className="inline-flex items-center gap-2 text-sm font-light uppercase tracking-wider text-black dark:text-white hover:text-gray-600 dark:hover:text-gray-400 transition-colors mt-6"
                >
                  <ArrowLeft className="w-4 h-4" />
                  Xem tất cả danh mục
                </Link>
              </div>
            </motion.div>
          ) : (
            <AnimatePresence mode="wait">
              {viewMode === "grid" ? (
                <motion.div
                  key="grid"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <CategoryList items={categories} />
                </motion.div>
              ) : (
                <motion.div
                  key="list"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  className="space-y-6"
                >
                  {categories.map((category, index) => (
                    <motion.div
                      key={category.id}
                      initial={{ opacity: 0, x: -20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true, margin: "-50px" }}
                      transition={{ duration: 0.5, delay: index * 0.1 }}
                    >
                      <Link
                        href={`/category/${category.id}`}
                        className="group flex flex-col md:flex-row gap-6 p-6 bg-white dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-700 hover:border-gray-400 dark:hover:border-gray-500 rounded-xl transition-all duration-300"
                      >
                        {category.billboard?.imageUrl && (
                          <div className="relative w-full md:w-48 h-48 md:h-48 rounded-lg overflow-hidden bg-gray-100 dark:bg-gray-700 flex-shrink-0">
                            <Image
                              src={category.billboard.imageUrl}
                              alt={category.name}
                              fill
                              sizes="(max-width: 768px) 100vw, 192px"
                              className="object-cover group-hover:scale-105 transition-transform duration-300"
                            />
                          </div>
                        )}
                        <div className="flex-1 flex flex-col justify-center">
                          <h3 className="text-2xl font-light text-black dark:text-white mb-2 group-hover:text-gray-600 dark:group-hover:text-gray-300 transition-colors uppercase tracking-wide">
                            {category.name}
                          </h3>
                          {category.billboard?.description && (
                            <p className="text-sm text-gray-600 dark:text-gray-400 font-light line-clamp-2">
                              {category.billboard.description}
                            </p>
                          )}
                          <div className="mt-4 inline-flex items-center gap-2 text-xs font-light uppercase tracking-wider text-gray-500 dark:text-gray-400 group-hover:text-black dark:group-hover:text-white transition-colors">
                            Xem danh mục
                            <ChevronRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                          </div>
                        </div>
                      </Link>
                    </motion.div>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          )}
        </div>
      </Container>
    </div>
  );
};

export default BillboardPageClient;

