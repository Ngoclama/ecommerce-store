"use client";

import { ScrollReveal } from "@/components/scroll-reveal";
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
} from "lucide-react";
import Link from "next/link";
import { Billboard, Category, Product } from "@/types";

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
  return (
    <div className="bg-white dark:bg-gray-900 min-h-screen">
      {/* Hero Banner Carousel - Full Width */}
      <section className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 w-full">
        {billboards && billboards.length > 0 ? (
          <BillboardCarousel billboards={billboards} />
        ) : (
          <div className="w-full min-h-[500px] md:min-h-[600px] bg-gray-50 dark:bg-gray-950 border border-gray-200 dark:border-gray-800 flex items-center justify-center">
            <p className="text-black dark:text-white text-xl font-light tracking-widest uppercase">
              Chưa có banner
            </p>
          </div>
        )}
      </section>

      {/* Trust Badges / Features Section */}
      <ScrollReveal direction="up" delay={0.1}>
        <section className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 py-8 md:py-12">
          <Container>
            <div className="px-4 sm:px-6 lg:px-8">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
                <ScrollReveal direction="up" delay={0.1}>
                  <div className="flex flex-col items-center text-center space-y-2">
                    <div className="w-12 h-12 md:w-14 md:h-14 border border-gray-300 dark:border-gray-700 rounded-none flex items-center justify-center bg-white dark:bg-gray-800">
                      <Shield className="w-6 h-6 md:w-7 md:h-7 text-black dark:text-white" />
                    </div>
                    <h3 className="text-xs md:text-sm font-light text-black dark:text-white uppercase tracking-wide">
                      Chất lượng đảm bảo
                    </h3>
                    <p className="text-xs text-gray-600 dark:text-gray-400 font-light hidden md:block">
                      100% chính hãng
                    </p>
                  </div>
                </ScrollReveal>

                <ScrollReveal direction="up" delay={0.2}>
                  <div className="flex flex-col items-center text-center space-y-2">
                    <div className="w-12 h-12 md:w-14 md:h-14 border border-gray-300 dark:border-gray-700 rounded-none flex items-center justify-center bg-white dark:bg-gray-800">
                      <Truck className="w-6 h-6 md:w-7 md:h-7 text-black dark:text-white" />
                    </div>
                    <h3 className="text-xs md:text-sm font-light text-black dark:text-white uppercase tracking-wide">
                      Giao hàng nhanh
                    </h3>
                    <p className="text-xs text-gray-600 dark:text-gray-400 font-light hidden md:block">
                      3-5 ngày làm việc
                    </p>
                  </div>
                </ScrollReveal>

                <ScrollReveal direction="up" delay={0.3}>
                  <div className="flex flex-col items-center text-center space-y-2">
                    <div className="w-12 h-12 md:w-14 md:h-14 border border-gray-300 dark:border-gray-700 rounded-none flex items-center justify-center bg-white dark:bg-gray-800">
                      <Award className="w-6 h-6 md:w-7 md:h-7 text-black dark:text-white" />
                    </div>
                    <h3 className="text-xs md:text-sm font-light text-black dark:text-white uppercase tracking-wide">
                      Đổi trả dễ dàng
                    </h3>
                    <p className="text-xs text-gray-600 dark:text-gray-400 font-light hidden md:block">
                      Trong 7 ngày
                    </p>
                  </div>
                </ScrollReveal>

                <ScrollReveal direction="up" delay={0.4}>
                  <div className="flex flex-col items-center text-center space-y-2">
                    <div className="w-12 h-12 md:w-14 md:h-14 border border-gray-300 dark:border-gray-700 rounded-none flex items-center justify-center bg-white dark:bg-gray-800">
                      <Clock className="w-6 h-6 md:w-7 md:h-7 text-black dark:text-white" />
                    </div>
                    <h3 className="text-xs md:text-sm font-light text-black dark:text-white uppercase tracking-wide">
                      Hỗ trợ 24/7
                    </h3>
                    <p className="text-xs text-gray-600 dark:text-gray-400 font-light hidden md:block">
                      Luôn sẵn sàng
                    </p>
                  </div>
                </ScrollReveal>
              </div>
            </div>
          </Container>
        </section>
      </ScrollReveal>

      <Container>
        {/* Categories Section */}
        {categories && categories.length > 0 && (
          <ScrollReveal direction="up" delay={0.1}>
            <section className="px-4 sm:px-6 lg:px-8 py-16 md:py-20 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800">
              <ScrollReveal direction="up" delay={0.2}>
                <div className="mb-12 md:mb-16">
                  <div className="flex items-center justify-between mb-6">
                    <div>
                      <h2 className="text-4xl md:text-5xl lg:text-6xl font-light text-black dark:text-white mb-3 tracking-wide uppercase">
                        Bộ sưu tập
                      </h2>
                      <div className="w-20 md:w-24 h-px bg-black dark:bg-white"></div>
                    </div>
                    <Link
                      href="/categories"
                      className="text-xs md:text-sm font-light text-gray-600 dark:text-gray-400 hover:text-black dark:hover:text-white uppercase tracking-wider transition-colors hidden md:block"
                    >
                      Xem tất cả →
                    </Link>
                  </div>
                  <p className="text-gray-600 dark:text-gray-400 mt-6 font-light text-sm md:text-base tracking-wide max-w-2xl">
                    Khám phá các danh mục thời trang của chúng tôi
                  </p>
                </div>
              </ScrollReveal>
              <CategoryList items={categories} />
              <div className="mt-8 text-center md:hidden">
                <Link
                  href="/categories"
                  className="text-xs font-light text-gray-600 dark:text-gray-400 hover:text-black dark:hover:text-white uppercase tracking-wider transition-colors"
                >
                  Xem tất cả →
                </Link>
              </div>
            </section>
          </ScrollReveal>
        )}

        {/* Featured Products */}
        {featuredProducts.length > 0 && (
          <ScrollReveal direction="up" delay={0.1}>
            <section className="px-4 sm:px-6 lg:px-8 py-16 md:py-20 bg-gray-50 dark:bg-gray-950 border-b border-gray-200 dark:border-gray-800">
              <ScrollReveal direction="up" delay={0.2}>
                <div className="mb-12 md:mb-16">
                  <div className="flex items-center justify-between mb-6">
                    <div>
                      <h2 className="text-4xl md:text-5xl lg:text-6xl font-light text-black dark:text-white mb-3 tracking-wide uppercase">
                        Sản phẩm nổi bật
                      </h2>
                      <div className="w-20 md:w-24 h-px bg-black dark:bg-white"></div>
                    </div>
                    <Link
                      href="/products/featured"
                      className="text-xs md:text-sm font-light text-gray-600 dark:text-gray-400 hover:text-black dark:hover:text-white uppercase tracking-wider transition-colors hidden md:block"
                    >
                      Xem tất cả →
                    </Link>
                  </div>
                  <p className="text-gray-600 dark:text-gray-400 mt-6 font-light text-sm md:text-base tracking-wide max-w-2xl">
                    Những mẫu thời trang được yêu thích nhất
                  </p>
                </div>
              </ScrollReveal>
              <ProductList title="" items={featuredProducts.slice(0, 12)} />
              <div className="mt-8 text-center md:hidden">
                <Link
                  href="/products?featured=true"
                  className="text-xs font-light text-gray-600 dark:text-gray-400 hover:text-black dark:hover:text-white uppercase tracking-wider transition-colors"
                >
                  Xem tất cả →
                </Link>
              </div>
            </section>
          </ScrollReveal>
        )}

        {/* New Arrivals */}
        {latestProducts.length > 0 && (
          <ScrollReveal direction="up" delay={0.1}>
            <section className="px-4 sm:px-6 lg:px-8 py-16 md:py-20 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800">
              <ScrollReveal direction="up" delay={0.2}>
                <div className="mb-12 md:mb-16">
                  <div className="flex items-center justify-between mb-6">
                    <div>
                      <h2 className="text-4xl md:text-5xl lg:text-6xl font-light text-black dark:text-white mb-3 tracking-wide uppercase">
                        Hàng mới về
                      </h2>
                      <div className="w-20 md:w-24 h-px bg-black dark:bg-white"></div>
                    </div>
                    <Link
                      href="/products/new"
                      className="text-xs md:text-sm font-light text-gray-600 dark:text-gray-400 hover:text-black dark:hover:text-white uppercase tracking-wider transition-colors hidden md:block"
                    >
                      Xem tất cả →
                    </Link>
                  </div>
                  <p className="text-gray-600 dark:text-gray-400 mt-6 font-light text-sm md:text-base tracking-wide max-w-2xl">
                    Những sản phẩm mới nhất từ bộ sưu tập
                  </p>
                </div>
              </ScrollReveal>
              <Suspense
                fallback={
                  <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
                    {[...Array(8)].map((_, i) => (
                      <div
                        key={i}
                        className="aspect-square bg-gray-100 animate-pulse"
                      />
                    ))}
                  </div>
                }
              >
                <ProductList title="" items={latestProducts} />
              </Suspense>
              <div className="mt-8 text-center md:hidden">
                <Link
                  href="/products/new"
                  className="text-xs font-light text-gray-600 dark:text-gray-400 hover:text-black dark:hover:text-white uppercase tracking-wider transition-colors"
                >
                  Xem tất cả →
                </Link>
              </div>
            </section>
          </ScrollReveal>
        )}

        {/* Best Sellers */}
        {topSellers.length > 0 && (
          <ScrollReveal direction="up" delay={0.1}>
            <section className="px-4 sm:px-6 lg:px-8 py-16 md:py-20 bg-gray-50 dark:bg-gray-950 border-b border-gray-200 dark:border-gray-800">
              <ScrollReveal direction="up" delay={0.2}>
                <div className="mb-12 md:mb-16">
                  <div className="flex items-center justify-between mb-6">
                    <div>
                      <h2 className="text-4xl md:text-5xl lg:text-6xl font-light text-black dark:text-white mb-3 tracking-wide uppercase">
                        Bán chạy nhất
                      </h2>
                      <div className="w-20 md:w-24 h-px bg-black dark:bg-white"></div>
                    </div>
                    <Link
                      href="/products/bestsellers"
                      className="text-xs md:text-sm font-light text-gray-600 dark:text-gray-400 hover:text-black dark:hover:text-white uppercase tracking-wider transition-colors hidden md:block"
                    >
                      Xem tất cả →
                    </Link>
                  </div>
                  <p className="text-gray-600 dark:text-gray-400 mt-6 font-light text-sm md:text-base tracking-wide max-w-2xl">
                    Những sản phẩm được khách hàng yêu thích nhất
                  </p>
                </div>
              </ScrollReveal>
              <ProductList title="" items={topSellers} />
              <div className="mt-8 text-center md:hidden">
                <Link
                  href="/products/bestsellers"
                  className="text-xs font-light text-gray-600 dark:text-gray-400 hover:text-black dark:hover:text-white uppercase tracking-wider transition-colors"
                >
                  Xem tất cả →
                </Link>
              </div>
            </section>
          </ScrollReveal>
        )}

        {/* Why Choose Us Section */}
        <ScrollReveal direction="up" delay={0.1}>
          <section className="px-4 sm:px-6 lg:px-8 py-16 md:py-20 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800">
            <div className="max-w-4xl mx-auto">
              <ScrollReveal direction="fade" delay={0.2}>
                <div className="mb-12 text-center">
                  <h2 className="text-4xl md:text-5xl lg:text-6xl font-light text-black dark:text-white mb-3 tracking-wide uppercase">
                    Tại sao chọn chúng tôi
                  </h2>
                  <div className="w-20 md:w-24 h-px bg-black dark:bg-white mx-auto"></div>
                </div>
              </ScrollReveal>
              <div className="grid md:grid-cols-2 gap-8 md:gap-12">
                <ScrollReveal direction="right" delay={0.3}>
                  <div className="space-y-4">
                    <div className="flex items-start gap-4">
                      <CheckCircle className="w-6 h-6 text-black dark:text-white shrink-0 mt-1" />
                      <div>
                        <h3 className="text-lg font-light text-black dark:text-white uppercase tracking-wide mb-2">
                          Chất lượng cao cấp
                        </h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400 font-light leading-relaxed">
                          Sản phẩm được chọn lọc kỹ lưỡng, đảm bảo chất lượng tốt
                          nhất cho khách hàng
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start gap-4">
                      <CheckCircle className="w-6 h-6 text-black dark:text-white shrink-0 mt-1" />
                      <div>
                        <h3 className="text-lg font-light text-black dark:text-white uppercase tracking-wide mb-2">
                          Giá cả hợp lý
                        </h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400 font-light leading-relaxed">
                          Giá cả cạnh tranh với nhiều chương trình khuyến mãi hấp
                          dẫn
                        </p>
                      </div>
                    </div>
                  </div>
                </ScrollReveal>
                <ScrollReveal direction="left" delay={0.4}>
                  <div className="space-y-4">
                    <div className="flex items-start gap-4">
                      <CheckCircle className="w-6 h-6 text-black dark:text-white shrink-0 mt-1" />
                      <div>
                        <h3 className="text-lg font-light text-black dark:text-white uppercase tracking-wide mb-2">
                          Dịch vụ chuyên nghiệp
                        </h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400 font-light leading-relaxed">
                          Đội ngũ tư vấn nhiệt tình, hỗ trợ khách hàng 24/7
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start gap-4">
                      <CheckCircle className="w-6 h-6 text-black dark:text-white shrink-0 mt-1" />
                      <div>
                        <h3 className="text-lg font-light text-black dark:text-white uppercase tracking-wide mb-2">
                          Thanh toán an toàn
                        </h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400 font-light leading-relaxed">
                          Hệ thống thanh toán bảo mật, đảm bảo an toàn thông tin
                        </p>
                      </div>
                    </div>
                  </div>
                </ScrollReveal>
              </div>
            </div>
          </section>
        </ScrollReveal>

        {/* Newsletter Section */}
        <ScrollReveal direction="up" delay={0.1}>
          <section className="px-4 sm:px-6 lg:px-8 py-16 md:py-20 bg-white dark:bg-gray-900">
            <div className="max-w-4xl mx-auto">
              <div className="bg-white dark:bg-gray-800 border-2 border-black dark:border-white rounded-none p-8 md:p-12 lg:p-16 text-center">
                <ScrollReveal direction="fade" delay={0.2}>
                  <div className="mb-6">
                    <Sparkles className="w-12 h-12 md:w-16 md:h-16 text-black dark:text-white mx-auto mb-4" />
                  </div>
                </ScrollReveal>
                <ScrollReveal direction="up" delay={0.3}>
                  <h2 className="text-3xl md:text-4xl lg:text-5xl font-light mb-4 tracking-widest uppercase text-black dark:text-white">
                    Đăng ký nhận tin
                  </h2>
                </ScrollReveal>
                <ScrollReveal direction="up" delay={0.4}>
                  <p className="text-gray-600 dark:text-gray-400 mb-8 md:mb-10 text-sm md:text-base font-light tracking-wide max-w-xl mx-auto">
                    Nhận thông tin về sản phẩm mới và ưu đãi đặc biệt. Đăng ký ngay
                    để không bỏ lỡ bất kỳ cơ hội nào!
                  </p>
                </ScrollReveal>
                <ScrollReveal direction="up" delay={0.5}>
                  <NewsletterForm />
                </ScrollReveal>
              </div>
            </div>
          </section>
        </ScrollReveal>
      </Container>
    </div>
  );
};

export default HomePageClient;

