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
    // First check if billboard has categoryId or category directly
    if (billboard.categoryId) {
      return categories.find((cat) => cat.id === billboard.categoryId) || null;
    }
    if (billboard.category) {
      return billboard.category;
    }
    // Fallback: find category by billboardId
    return categories.find((cat) => cat.billboardId === billboard.id) || null;
  };

  const handleBillboardClick = () => {
    const currentBillboard = billboards[currentIndex];
    const category = getCategoryForBillboard(currentBillboard);

    if (category) {
      router.push(`/category/${category.id}`);
    }
  };

  // Auto-play carousel - Slower transition
  useEffect(() => {
    if (!isAutoPlaying || billboards.length <= 1) return;

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % billboards.length);
    }, 8000); // Increased from 5000ms to 8000ms for slower transition

    return () => clearInterval(interval);
  }, [isAutoPlaying, billboards.length]);

  const goToSlide = (index: number) => {
    setCurrentIndex(index);
    setIsAutoPlaying(false);
    setTimeout(() => setIsAutoPlaying(true), 12000); // Increased pause time
  };

  const goToPrevious = () => {
    setCurrentIndex(
      (prev) => (prev - 1 + billboards.length) % billboards.length
    );
    setIsAutoPlaying(false);
    setTimeout(() => setIsAutoPlaying(true), 12000); // Increased pause time
  };

  const goToNext = () => {
    setCurrentIndex((prev) => (prev + 1) % billboards.length);
    setIsAutoPlaying(false);
    setTimeout(() => setIsAutoPlaying(true), 12000); // Increased pause time
  };

  if (!billboards || billboards.length === 0) {
    return null;
  }

  const currentBillboard = billboards[currentIndex];

  return (
    <div className="w-full relative overflow-hidden">
      {/* Carousel Container - Modern 2025 Style, Full Width */}
      <div className="relative w-full min-h-[500px] md:min-h-[600px] lg:min-h-[700px] group">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentIndex}
            initial={{ opacity: 0, x: 100 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -100 }}
            transition={{ duration: 1.2, ease: [0.25, 0.46, 0.45, 0.94] }}
            className="absolute inset-0"
            style={{
              background: currentBillboard?.imageUrl
                ? `url(${currentBillboard.imageUrl}) center/cover`
                : "rgb(255 255 255)",
            }}
          >
            {/* Elegant Overlay - Subtle gradient */}
            <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/30 to-black/50" />

            {/* Content - Modern, Elegant, Centered */}
            <div
              className="relative h-full flex flex-col justify-center items-center gap-8 px-4 sm:px-8 md:px-16 lg:px-24 py-16 text-center cursor-pointer"
              onClick={handleBillboardClick}
            >
              {/* Main Text - Modern Typography */}
              <motion.div
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1.2, delay: 0.3, ease: "easeOut" }}
                className="space-y-6 max-w-4xl"
              >
                <h1 className="text-white text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-light leading-[1.1] tracking-tight">
                  {currentBillboard?.label || "Thời trang thanh lịch"}
                </h1>
              </motion.div>

              {/* CTA Button - Elegant Style */}
              {currentBillboard?.label && (
              <motion.div
                  initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 1.2, delay: 0.6, ease: "easeOut" }}
                  className="pt-6"
                  onClick={(e) => e.stopPropagation()}
              >
                <Button
                  size="lg"
                    onClick={handleBillboardClick}
                    className="bg-white text-black border-0 hover:bg-gray-50 rounded-none px-10 py-4 text-sm font-light uppercase tracking-wider transition-all duration-300 shadow-lg hover:shadow-xl"
                >
                    Khám phá ngay
                </Button>
              </motion.div>
              )}
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Navigation Arrows - Modern, Elegant */}
        {billboards.length > 1 && (
          <>
            <Button
              onClick={goToPrevious}
              className="absolute left-4 md:left-8 top-1/2 -translate-y-1/2 z-10 bg-white/90 hover:bg-white text-black border-0 rounded-none w-12 h-12 transition-all duration-300 shadow-lg hover:shadow-xl opacity-0 group-hover:opacity-100"
              size="icon"
              variant="ghost"
              aria-label="Slide trước"
            >
              <ChevronLeft className="w-5 h-5" />
            </Button>
            <Button
              onClick={goToNext}
              className="absolute right-4 md:right-8 top-1/2 -translate-y-1/2 z-10 bg-white/90 hover:bg-white text-black border-0 rounded-none w-12 h-12 transition-all duration-300 shadow-lg hover:shadow-xl opacity-0 group-hover:opacity-100"
              size="icon"
              variant="ghost"
              aria-label="Slide sau"
            >
              <ChevronRight className="w-5 h-5" />
            </Button>
          </>
        )}

        {/* Dots Indicator - Modern, Elegant */}
        {billboards.length > 1 && (
          <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-3 z-10">
            {billboards.map((_, index) => (
              <button
                key={index}
                onClick={() => goToSlide(index)}
                className={cn(
                  "h-1 transition-all duration-500 rounded-full",
                  index === currentIndex
                    ? "w-12 bg-white shadow-lg"
                    : "w-8 bg-white/50 hover:bg-white/70"
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
