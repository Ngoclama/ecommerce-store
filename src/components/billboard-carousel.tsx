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

  // Debug logging
  useEffect(() => {
    console.log("[BILLBOARD_CAROUSEL] Received billboards:", {
      count: billboards?.length || 0,
      billboards: billboards,
      firstBillboard: billboards?.[0],
      hasImageUrl: !!billboards?.[0]?.imageUrl,
    });
  }, [billboards]);

  // Fetch categories to match with billboards (lazy load, not blocking render)
  useEffect(() => {
    // Only fetch categories if we have billboards with categoryId
    const needsCategories = billboards.some((b) => b.categoryId);
    if (!needsCategories) return;

    // Defer category fetch to not block initial render
    const timeoutId = setTimeout(() => {
      const fetchCategories = async () => {
        try {
          const cats = await getCategories();
          setCategories(cats);
        } catch (error) {
          // Silent fail - categories are not critical for billboard display
          if (process.env.NODE_ENV === "development") {
            console.error("[BILLBOARD_CAROUSEL] Error fetching categories:", error);
          }
        }
      };
      fetchCategories();
    }, 100); // Small delay to not block initial render

    return () => clearTimeout(timeoutId);
  }, [billboards]);

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

  // Preload next billboard image for smoother transitions
  useEffect(() => {
    if (billboards.length <= 1) return;
    
    const nextIndex = (currentIndex + 1) % billboards.length;
    const nextBillboard = billboards[nextIndex];
    
    if (nextBillboard?.imageUrl) {
      // Preload next image
      const img = new window.Image();
      img.src = nextBillboard.imageUrl;
    }
  }, [currentIndex, billboards]);

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
    <div className="w-full relative overflow-hidden bg-gradient-to-br from-neutral-50 via-white to-neutral-50 dark:from-neutral-950 dark:via-gray-900 dark:to-neutral-950">
      {/* Carousel Container - Luxury Style */}
      <div className="relative w-full min-h-screen flex items-center justify-center group">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentIndex}
            initial={{ opacity: 0, scale: 1.1 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 1.2, ease: [0.25, 0.1, 0.25, 1] }}
            className="absolute inset-0"
            style={{
              backgroundImage: currentBillboard?.imageUrl
                ? `url(${currentBillboard.imageUrl})`
                : "none",
              backgroundSize: "cover",
              backgroundPosition: "center",
              backgroundRepeat: "no-repeat",
              backgroundColor: currentBillboard?.imageUrl
                ? "transparent"
                : "#fafafa",
            }}
          >
            {/* Luxury Gradient Overlay */}
            <motion.div
              className="absolute inset-0 bg-gradient-to-br from-neutral-900/70 via-neutral-900/60 to-neutral-900/80 dark:from-neutral-950/80 dark:via-neutral-950/70 dark:to-neutral-950/90"
              animate={{
                background: [
                  "linear-gradient(135deg, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0.6) 50%, rgba(0,0,0,0.8) 100%)",
                  "linear-gradient(135deg, rgba(0,0,0,0.65) 0%, rgba(0,0,0,0.55) 50%, rgba(0,0,0,0.75) 100%)",
                  "linear-gradient(135deg, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0.6) 50%, rgba(0,0,0,0.8) 100%)",
                ],
              }}
              transition={{
                duration: 8,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            />

            {/* Content - Luxury Style: Centered, Elegant */}
            <div
              className="relative h-full flex flex-col justify-center items-center gap-8 px-6 sm:px-12 md:px-16 lg:px-24 py-16 cursor-pointer"
              onClick={handleBillboardClick}
            >
              {/* Main Text - Luxury Typography */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1, delay: 0.3, ease: [0.25, 0.1, 0.25, 1] }}
                className="space-y-6 max-w-4xl text-center"
              >
                <motion.h1
                  className="text-white text-5xl sm:text-6xl md:text-7xl lg:text-8xl xl:text-9xl font-light leading-[1.1] tracking-tight uppercase"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 1, delay: 0.4 }}
                >
                  {currentBillboard?.label || "Thời trang thanh lịch"}
                </motion.h1>
                {currentBillboard?.description && (
                  <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 1, delay: 0.5 }}
                    className="text-white/90 dark:text-white/80 text-lg md:text-xl lg:text-2xl font-light max-w-2xl mx-auto leading-relaxed"
                  >
                    {currentBillboard.description}
                  </motion.p>
                )}
              </motion.div>

              {/* CTA Button - Luxury Style */}
              {currentBillboard?.label && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 1, delay: 0.6, ease: "easeOut" }}
                  className="pt-4"
                  onClick={(e) => e.stopPropagation()}
                >
                  <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                    <Button
                      size="lg"
                      onClick={handleBillboardClick}
                      className="bg-white/95 dark:bg-white/95 text-neutral-900 dark:text-neutral-900 border-2 border-white/50 hover:bg-white dark:hover:bg-white hover:border-white rounded-sm px-10 py-4 text-xs font-light uppercase tracking-[0.2em] transition-all duration-300 shadow-lg hover:shadow-xl backdrop-blur-sm"
                    >
                      Khám phá ngay
                    </Button>
                  </motion.div>
                </motion.div>
              )}
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Navigation Arrows - Luxury Style: Elegant, Smooth */}
        {billboards.length > 1 && (
          <>
            <motion.button
              onClick={goToPrevious}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              className="absolute left-6 md:left-12 top-1/2 -translate-y-1/2 z-10 bg-white/10 backdrop-blur-md dark:bg-white/10 hover:bg-white/20 dark:hover:bg-white/20 text-white dark:text-white border border-white/20 hover:border-white/40 rounded-sm w-12 h-12 md:w-14 md:h-14 transition-all duration-300 opacity-0 group-hover:opacity-100 shadow-lg flex items-center justify-center"
              aria-label="Slide trước"
            >
              <ChevronLeft className="w-6 h-6 md:w-7 md:h-7" />
            </motion.button>
            <motion.button
              onClick={goToNext}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              className="absolute right-6 md:right-12 top-1/2 -translate-y-1/2 z-10 bg-white/10 backdrop-blur-md dark:bg-white/10 hover:bg-white/20 dark:hover:bg-white/20 text-white dark:text-white border border-white/20 hover:border-white/40 rounded-sm w-12 h-12 md:w-14 md:h-14 transition-all duration-300 opacity-0 group-hover:opacity-100 shadow-lg flex items-center justify-center"
              aria-label="Slide sau"
            >
              <ChevronRight className="w-6 h-6 md:w-7 md:h-7" />
            </motion.button>
          </>
        )}

        {/* Dots Indicator - Luxury Style: Minimal, Elegant */}
        {billboards.length > 1 && (
          <div className="absolute bottom-8 md:bottom-12 left-1/2 -translate-x-1/2 flex gap-3 z-10">
            {billboards.map((_, index) => (
              <motion.button
                key={index}
                onClick={() => goToSlide(index)}
                whileHover={{ scale: 1.2 }}
                whileTap={{ scale: 0.9 }}
                className={cn(
                  "h-1 transition-all duration-500 rounded-full",
                  index === currentIndex
                    ? "w-10 bg-white dark:bg-white"
                    : "w-8 bg-white/40 dark:bg-white/40 hover:bg-white/60 dark:hover:bg-white/60"
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
