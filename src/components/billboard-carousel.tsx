"use client";

import { Billboard as BillboardType, Category } from "@/types";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "./ui/button";
import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";
import getCategories from "@/actions/get-categories";

interface BillboardCarouselProps {
  billboards: BillboardType[];
}

const BillboardCarousel: React.FC<BillboardCarouselProps> = ({
  billboards,
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const [categories, setCategories] = useState<Category[]>([]);
  const router = useRouter();

  // Fetch categories to match with billboards
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const cats = await getCategories();
        setCategories(cats);
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };
    fetchCategories();
  }, []);

  // Get category for current billboard
  const getCategoryForBillboard = (
    billboard: BillboardType
  ): Category | null => {
    if (billboard.categoryId) {
      return categories.find((cat) => cat.id === billboard.categoryId) || null;
    }
    if (billboard.category) {
      return billboard.category;
    }
    return categories.find((cat) => cat.billboardId === billboard.id) || null;
  };

  const handleBillboardClick = () => {
    const currentBillboard = billboards[currentIndex];
    const category = getCategoryForBillboard(currentBillboard);

    if (category) {
      router.push(`/category/${category.id}`);
    }
  };

  // Auto-play carousel
  useEffect(() => {
    if (!isAutoPlaying || billboards.length <= 1) return;

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % billboards.length);
    }, 6000);

    return () => clearInterval(interval);
  }, [isAutoPlaying, billboards.length]);

  const goToSlide = (index: number) => {
    setCurrentIndex(index);
    setIsAutoPlaying(false);
    setTimeout(() => setIsAutoPlaying(true), 10000);
  };

  const goToPrevious = () => {
    setCurrentIndex(
      (prev) => (prev - 1 + billboards.length) % billboards.length
    );
    setIsAutoPlaying(false);
    setTimeout(() => setIsAutoPlaying(true), 10000);
  };

  const goToNext = () => {
    setCurrentIndex((prev) => (prev + 1) % billboards.length);
    setIsAutoPlaying(false);
    setTimeout(() => setIsAutoPlaying(true), 10000);
  };

  if (!billboards || billboards.length === 0) {
    return null;
  }

  const currentBillboard = billboards[currentIndex];

  return (
    <div className="w-full relative overflow-hidden bg-white dark:bg-gray-900">
      {/* Carousel Container - Aigle Style */}
      <div className="relative w-full min-h-[500px] md:min-h-[600px] lg:min-h-[700px] group">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentIndex}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1, ease: "easeInOut" }}
            className="absolute inset-0"
            style={{
              background: currentBillboard?.imageUrl
                ? `url(${currentBillboard.imageUrl}) center/cover`
                : "rgb(249 250 251)",
            }}
          >
            {/* Subtle Overlay - Aigle Style */}
            <div className="absolute inset-0 bg-black/20 dark:bg-black/40" />

            {/* Content - Aigle Style: Left-aligned, Clean */}
            <div
              className="relative h-full flex flex-col justify-center items-start gap-6 px-6 sm:px-12 md:px-16 lg:px-24 py-16 cursor-pointer"
              onClick={handleBillboardClick}
            >
              {/* Main Text - Aigle Typography */}
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
                className="space-y-4 max-w-2xl"
              >
                <h1 className="text-white dark:text-white text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-light leading-tight tracking-tight">
                  {currentBillboard?.label || "Thời trang thanh lịch"}
                </h1>
                {currentBillboard?.description && (
                  <p className="text-white/90 dark:text-white/80 text-base md:text-lg font-light max-w-xl">
                    {currentBillboard.description}
                  </p>
                )}
              </motion.div>

              {/* CTA Button - Aigle Style */}
              {currentBillboard?.label && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 0.4, ease: "easeOut" }}
                  className="pt-2"
                  onClick={(e) => e.stopPropagation()}
                >
                  <Button
                    size="lg"
                    onClick={handleBillboardClick}
                    className="bg-white dark:bg-white text-black dark:text-black border-0 hover:bg-gray-100 dark:hover:bg-gray-100 rounded-none px-8 py-3 text-xs font-light uppercase tracking-wider transition-all duration-300"
                  >
                    Khám phá ngay
                  </Button>
                </motion.div>
              )}
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Navigation Arrows - Aigle Style: Minimal, Elegant */}
        {billboards.length > 1 && (
          <>
            <Button
              onClick={goToPrevious}
              className="absolute left-4 md:left-8 top-1/2 -translate-y-1/2 z-10 bg-white/80 dark:bg-white/80 hover:bg-white dark:hover:bg-white text-black dark:text-black border-0 rounded-none w-10 h-10 md:w-12 md:h-12 transition-all duration-300 opacity-0 group-hover:opacity-100"
              size="icon"
              variant="ghost"
              aria-label="Slide trước"
            >
              <ChevronLeft className="w-5 h-5 md:w-6 md:h-6" />
            </Button>
            <Button
              onClick={goToNext}
              className="absolute right-4 md:right-8 top-1/2 -translate-y-1/2 z-10 bg-white/80 dark:bg-white/80 hover:bg-white dark:hover:bg-white text-black dark:text-black border-0 rounded-none w-10 h-10 md:w-12 md:h-12 transition-all duration-300 opacity-0 group-hover:opacity-100"
              size="icon"
              variant="ghost"
              aria-label="Slide sau"
            >
              <ChevronRight className="w-5 h-5 md:w-6 md:h-6" />
            </Button>
          </>
        )}

        {/* Dots Indicator - Aigle Style: Minimal */}
        {billboards.length > 1 && (
          <div className="absolute bottom-6 md:bottom-8 left-1/2 -translate-x-1/2 flex gap-2 z-10">
            {billboards.map((_, index) => (
              <button
                key={index}
                onClick={() => goToSlide(index)}
                className={cn(
                  "h-0.5 transition-all duration-500 rounded-full",
                  index === currentIndex
                    ? "w-8 bg-white dark:bg-white"
                    : "w-6 bg-white/50 dark:bg-white/50 hover:bg-white/70 dark:hover:bg-white/70"
                )}
                aria-label={`Chuyển đến slide ${index + 1}`}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default BillboardCarousel;
