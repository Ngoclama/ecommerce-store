"use client";

import React, { useRef } from "react";
import { motion, useScroll, useTransform, useInView } from "framer-motion";
import BillboardCarousel from "@/components/billboard-carousel";
import ProductList from "@/components/product-list";
import CategoryList from "@/components/category-list";
import Container from "@/components/ui/container";
import NewsletterForm from "@/components/newsletter-form";
import { Suspense } from "react";
import {
  Shield,
  Truck,
  Award,
  Clock,
  Sparkles,
  CheckCircle,
  Crown,
  Gem,
  Star,
  ArrowRight,
  ChevronRight,
} from "lucide-react";
import Link from "next/link";
import { Billboard, Category, Product } from "@/types";
import { cn } from "@/lib/utils";

interface HomePageClientProps {
  billboards: Billboard[];
  featuredProducts: Product[];
  categories: Category[];
  latestProducts: Product[];
  topSellers: Product[];
}

const HomePageClient: React.FC<HomePageClientProps> = ({
  billboards,
  featuredProducts,
  categories,
  latestProducts,
  topSellers,
}) => {
  const heroRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"],
  });

  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);
  const scale = useTransform(scrollYProgress, [0, 0.5], [1, 1.1]);

  return (
    <div className="bg-white dark:bg-gray-900 min-h-screen overflow-hidden">
      {/* Luxury Hero Section with Parallax */}
      <motion.section
        ref={heroRef}
        style={{ opacity, scale }}
        className="relative w-full min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-neutral-50 via-white to-neutral-50 dark:from-neutral-950 dark:via-gray-900 dark:to-neutral-950"
      >
        {billboards && billboards.length > 0 ? (
          <div className="w-full h-full">
            <BillboardCarousel billboards={billboards} />
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
            className="w-full min-h-screen bg-gradient-to-br from-neutral-50 via-white to-neutral-50 dark:from-neutral-950 dark:via-gray-900 dark:to-neutral-950 flex items-center justify-center"
          >
            <div className="text-center space-y-6">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ duration: 0.8, type: "spring" }}
                className="inline-block"
              >
                <Crown className="w-16 h-16 md:w-20 md:h-20 text-neutral-400 dark:text-neutral-600 mx-auto" />
              </motion.div>
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="text-black dark:text-white text-xl md:text-2xl font-light tracking-[0.2em] uppercase"
              >
                Chưa có banner
              </motion.p>
            </div>
          </motion.div>
        )}

        {/* Decorative Elements */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          {Array.from({ length: 20 }).map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-px h-px bg-neutral-300 dark:bg-neutral-700 rounded-full"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
              }}
              animate={{
                opacity: [0, 0.5, 0],
                scale: [0, 1, 0],
                y: [0, -100],
              }}
              transition={{
                duration: 4 + Math.random() * 2,
                repeat: Infinity,
                delay: Math.random() * 4,
                ease: "easeOut",
              }}
            />
          ))}
        </div>
      </motion.section>

      {/* Luxury Trust Badges Section */}
      <LuxuryTrustSection />

      <Container>
        {/* Luxury Categories Section */}
        {categories && categories.length > 0 && (
          <LuxurySection
            title="Bộ sưu tập"
            subtitle="Khám phá các danh mục thời trang cao cấp của chúng tôi"
            href="/categories"
            delay={0.1}
          >
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.8 }}
            >
              <CategoryList items={categories} />
            </motion.div>
          </LuxurySection>
        )}

        {/* Luxury Featured Products */}
        {featuredProducts.length > 0 && (
          <LuxurySection
            title="Sản phẩm nổi bật"
            subtitle="Những mẫu thời trang được yêu thích nhất"
            href="/products/featured"
            delay={0.1}
            bgVariant="light"
          >
            <Suspense
              fallback={
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
                  {[...Array(10)].map((_, i) => (
                    <div
                      key={i}
                      className="aspect-square bg-neutral-100 dark:bg-neutral-900 animate-pulse rounded-sm"
                    />
                  ))}
                </div>
              }
            >
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.8, delay: 0.2 }}
              >
                <ProductList title="" items={featuredProducts.slice(0, 10)} />
              </motion.div>
            </Suspense>
          </LuxurySection>
        )}

        {/* Luxury New Arrivals */}
        {latestProducts.length > 0 && (
          <LuxurySection
            title="Hàng mới về"
            subtitle="Những sản phẩm mới nhất từ bộ sưu tập"
            href="/products/new"
            delay={0.1}
          >
            <Suspense
              fallback={
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
                  {[...Array(10)].map((_, i) => (
                    <div
                      key={i}
                      className="aspect-square bg-neutral-100 dark:bg-neutral-900 animate-pulse rounded-sm"
                    />
                  ))}
                </div>
              }
            >
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.8, delay: 0.2 }}
              >
                <ProductList title="" items={latestProducts} />
              </motion.div>
            </Suspense>
          </LuxurySection>
        )}

        {/* Luxury Best Sellers */}
        {topSellers.length > 0 && (
          <LuxurySection
            title="Bán chạy nhất"
            subtitle="Những sản phẩm được khách hàng yêu thích nhất"
            href="/products/bestsellers"
            delay={0.1}
            bgVariant="light"
          >
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              <ProductList title="" items={topSellers} />
            </motion.div>
          </LuxurySection>
        )}

        {/* Luxury Why Choose Us Section */}
        <LuxuryWhyChooseUs />

        {/* Luxury Newsletter Section */}
        <LuxuryNewsletter />
      </Container>
    </div>
  );
};

// Luxury Trust Section Component
const LuxuryTrustSection = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-100px" });

  const features = [
    {
      icon: Shield,
      title: "Chất lượng đảm bảo",
      description: "100% chính hãng",
      delay: 0.1,
    },
    {
      icon: Truck,
      title: "Giao hàng nhanh",
      description: "3-5 ngày làm việc",
      delay: 0.2,
    },
    {
      icon: Award,
      title: "Đổi trả dễ dàng",
      description: "Trong 7 ngày",
      delay: 0.3,
    },
    {
      icon: Clock,
      title: "Hỗ trợ 24/7",
      description: "Luôn sẵn sàng",
      delay: 0.4,
    },
  ];

  return (
    <motion.section
      ref={sectionRef}
      initial={{ opacity: 0 }}
      animate={isInView ? { opacity: 1 } : { opacity: 0 }}
      transition={{ duration: 0.8 }}
      className="relative bg-white dark:bg-gray-900 border-y border-neutral-200 dark:border-neutral-800 py-16 md:py-20 overflow-hidden"
    >
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-[0.02] dark:opacity-[0.05]">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23000000' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }}
        />
      </div>

      <Container>
        <div className="px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 30 }}
                  animate={
                    isInView
                      ? { opacity: 1, y: 0 }
                      : { opacity: 0, y: 30 }
                  }
                  transition={{
                    duration: 0.6,
                    delay: feature.delay,
                    ease: "easeOut",
                  }}
                  className="flex flex-col items-center text-center space-y-4 group"
                >
                  <motion.div
                    whileHover={{ scale: 1.1, rotate: 5 }}
                    transition={{ duration: 0.3 }}
                    className="relative"
                  >
                    <div className="absolute inset-0 bg-gradient-to-br from-neutral-200 to-neutral-300 dark:from-neutral-800 dark:to-neutral-700 rounded-full blur-xl opacity-50 group-hover:opacity-75 transition-opacity" />
                    <div className="relative w-16 h-16 md:w-20 md:h-20 border-2 border-neutral-300 dark:border-neutral-700 rounded-full flex items-center justify-center bg-white dark:bg-gray-900 group-hover:border-neutral-400 dark:group-hover:border-neutral-600 transition-all duration-300">
                      <Icon className="w-7 h-7 md:w-8 md:h-8 text-neutral-800 dark:text-neutral-200" />
                    </div>
                  </motion.div>
                  <div className="space-y-2">
                    <h3 className="text-xs md:text-sm font-light text-neutral-800 dark:text-neutral-200 uppercase tracking-[0.15em]">
                      {feature.title}
                    </h3>
                    <p className="text-xs text-neutral-500 dark:text-neutral-400 font-light hidden md:block">
                      {feature.description}
                    </p>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </Container>
    </motion.section>
  );
};

// Luxury Section Component
interface LuxurySectionProps {
  title: string;
  subtitle: string;
  href: string;
  delay?: number;
  bgVariant?: "light" | "dark";
  children: React.ReactNode;
}

const LuxurySection: React.FC<LuxurySectionProps> = ({
  title,
  subtitle,
  href,
  delay = 0,
  bgVariant = "dark",
  children,
}) => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-100px" });

  return (
    <motion.section
      ref={sectionRef}
      className={cn(
        "px-4 sm:px-6 lg:px-8 py-24 md:py-32 border-b border-neutral-200 dark:border-neutral-800",
        bgVariant === "light"
          ? "bg-neutral-50 dark:bg-neutral-950"
          : "bg-white dark:bg-gray-900"
      )}
    >
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
        transition={{ duration: 0.8, delay }}
        className="mb-16 md:mb-20"
      >
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-6">
          <div className="space-y-4">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -20 }}
              transition={{ duration: 0.8, delay: delay + 0.1 }}
            >
              <h2 className="text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-light text-neutral-900 dark:text-neutral-100 tracking-tight uppercase">
                {title}
              </h2>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, width: 0 }}
              animate={isInView ? { opacity: 1, width: "100%" } : { opacity: 0, width: 0 }}
              transition={{ duration: 1, delay: delay + 0.2 }}
              className="h-px bg-gradient-to-r from-neutral-900 via-neutral-400 to-transparent dark:from-neutral-100 dark:via-neutral-600"
            />
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 10 }}
              transition={{ duration: 0.8, delay: delay + 0.3 }}
              className="text-sm md:text-base text-neutral-600 dark:text-neutral-400 font-light tracking-wide max-w-2xl leading-relaxed"
            >
              {subtitle}
            </motion.p>
          </div>
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: 20 }}
            transition={{ duration: 0.8, delay: delay + 0.2 }}
            className="hidden md:block"
          >
            <Link
              href={href}
              className="group inline-flex items-center gap-2 text-xs font-light text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-100 uppercase tracking-[0.2em] transition-all duration-300"
            >
              <span>Xem tất cả</span>
              <motion.div
                animate={{ x: [0, 4, 0] }}
                transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
              >
                <ArrowRight className="w-4 h-4" />
              </motion.div>
            </Link>
          </motion.div>
        </div>
      </motion.div>

      {children}

      <motion.div
        initial={{ opacity: 0 }}
        animate={isInView ? { opacity: 1 } : { opacity: 0 }}
        transition={{ duration: 0.8, delay: delay + 0.4 }}
        className="mt-12 text-center md:hidden"
      >
        <Link
          href={href}
          className="inline-flex items-center gap-2 text-xs font-light text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-100 uppercase tracking-[0.2em] transition-colors"
        >
          Xem tất cả
          <ChevronRight className="w-4 h-4" />
        </Link>
      </motion.div>
    </motion.section>
  );
};

// Luxury Why Choose Us Component
const LuxuryWhyChooseUs = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-100px" });

  const benefits = [
    {
      title: "Chất lượng cao cấp",
      description:
        "Sản phẩm được chọn lọc kỹ lưỡng, đảm bảo chất lượng tốt nhất cho khách hàng",
    },
    {
      title: "Giá cả hợp lý",
      description:
        "Giá cả cạnh tranh với nhiều chương trình khuyến mãi hấp dẫn",
    },
    {
      title: "Dịch vụ chuyên nghiệp",
      description: "Đội ngũ tư vấn nhiệt tình, hỗ trợ khách hàng 24/7",
    },
    {
      title: "Thanh toán an toàn",
      description:
        "Hệ thống thanh toán bảo mật, đảm bảo an toàn thông tin",
    },
  ];

  return (
    <motion.section
      ref={sectionRef}
      className="px-4 sm:px-6 lg:px-8 py-24 md:py-32 bg-gradient-to-br from-neutral-50 via-white to-neutral-50 dark:from-neutral-950 dark:via-gray-900 dark:to-neutral-950 border-b border-neutral-200 dark:border-neutral-800"
    >
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.8 }}
          className="mb-20 text-center"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={isInView ? { scale: 1 } : { scale: 0 }}
            transition={{ duration: 0.6, delay: 0.2, type: "spring" }}
            className="inline-block mb-6"
          >
            <Gem className="w-12 h-12 md:w-16 md:h-16 text-neutral-400 dark:text-neutral-600" />
          </motion.div>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="text-5xl md:text-6xl lg:text-7xl font-light text-neutral-900 dark:text-neutral-100 mb-6 tracking-tight uppercase"
          >
            Tại sao chọn chúng tôi
          </motion.h2>
          <motion.div
            initial={{ opacity: 0, width: 0 }}
            animate={isInView ? { opacity: 1, width: "120px" } : { opacity: 0, width: 0 }}
            transition={{ duration: 1, delay: 0.4 }}
            className="h-px bg-gradient-to-r from-transparent via-neutral-400 to-transparent dark:via-neutral-600 mx-auto"
          />
        </motion.div>

        <div className="grid md:grid-cols-2 gap-12 md:gap-16">
          {benefits.map((benefit, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: index % 2 === 0 ? -30 : 30 }}
              animate={
                isInView
                  ? { opacity: 1, x: 0 }
                  : { opacity: 0, x: index % 2 === 0 ? -30 : 30 }
              }
              transition={{ duration: 0.8, delay: 0.5 + index * 0.1 }}
              className="group space-y-4"
            >
              <div className="flex items-start gap-4">
                <motion.div
                  whileHover={{ scale: 1.1, rotate: 5 }}
                  transition={{ duration: 0.3 }}
                  className="shrink-0 mt-1"
                >
                  <div className="w-8 h-8 rounded-full bg-neutral-200 dark:bg-neutral-800 flex items-center justify-center group-hover:bg-neutral-300 dark:group-hover:bg-neutral-700 transition-colors">
                    <Star className="w-4 h-4 text-neutral-700 dark:text-neutral-300 fill-neutral-700 dark:fill-neutral-300" />
                  </div>
                </motion.div>
                <div className="flex-1 space-y-3">
                  <h3 className="text-xl md:text-2xl font-light text-neutral-900 dark:text-neutral-100 uppercase tracking-wide">
                    {benefit.title}
                  </h3>
                  <p className="text-sm md:text-base text-neutral-600 dark:text-neutral-400 font-light leading-relaxed">
                    {benefit.description}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.section>
  );
};

// Luxury Newsletter Component
const LuxuryNewsletter = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-100px" });

  return (
    <motion.section
      ref={sectionRef}
      className="px-4 sm:px-6 lg:px-8 py-24 md:py-32 bg-white dark:bg-gray-900"
    >
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={isInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.95 }}
          transition={{ duration: 0.8 }}
          className="relative bg-gradient-to-br from-neutral-50 to-white dark:from-neutral-950 dark:to-gray-900 border-2 border-neutral-200 dark:border-neutral-800 rounded-sm p-12 md:p-16 lg:p-20 text-center overflow-hidden"
        >
          {/* Decorative Background */}
          <div className="absolute inset-0 opacity-[0.03] dark:opacity-[0.05]">
            <div
              className="absolute inset-0"
              style={{
                backgroundImage: `url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23000000' fill-opacity='1'%3E%3Cpath d='M20 20.5V18H0v-2h20v-2H0v-2h20v-2H0V8h20V6H0V4h20V2H0V0h22v20.5zM0 20h2v20H0V20zm4 0h2v20H4V20zm4 0h2v20H8V20zm4 0h2v20h-2V20zm4 0h2v20h-2V20zm4 4h20v2H20v-2zm0 4h20v2H20v-2zm0 4h20v2H20v-2zm0 4h20v2H20v-2z'/%3E%3C/g%3E%3C/svg%3E")`,
              }}
            />
          </div>

          <div className="relative z-10">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="mb-8"
            >
              <motion.div
                animate={{ rotate: [0, 10, -10, 0] }}
                transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                className="inline-block"
              >
                <Sparkles className="w-12 h-12 md:w-16 md:h-16 text-neutral-400 dark:text-neutral-600" />
              </motion.div>
            </motion.div>

            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="text-4xl md:text-5xl lg:text-6xl font-light mb-6 tracking-[0.15em] uppercase text-neutral-900 dark:text-neutral-100"
            >
              Đăng ký nhận tin
            </motion.h2>

            <motion.div
              initial={{ opacity: 0, width: 0 }}
              animate={isInView ? { opacity: 1, width: "120px" } : { opacity: 0, width: 0 }}
              transition={{ duration: 1, delay: 0.4 }}
              className="h-px bg-gradient-to-r from-transparent via-neutral-400 to-transparent dark:via-neutral-600 mx-auto mb-8"
            />

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
              transition={{ duration: 0.8, delay: 0.5 }}
              className="text-neutral-600 dark:text-neutral-400 mb-10 md:mb-12 text-sm md:text-base font-light tracking-wide max-w-xl mx-auto leading-relaxed"
            >
              Nhận thông tin về sản phẩm mới và ưu đãi đặc biệt. Đăng ký ngay để
              không bỏ lỡ bất kỳ cơ hội nào!
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
              transition={{ duration: 0.8, delay: 0.6 }}
            >
              <NewsletterForm />
            </motion.div>
          </div>
        </motion.div>
      </div>
    </motion.section>
  );
};

export default HomePageClient;
