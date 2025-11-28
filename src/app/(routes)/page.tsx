import getBillboards from "@/actions/get-billboards";
import getProduct from "@/actions/get-products";
import getCategories from "@/actions/get-categories";
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
  TrendingUp,
  Star,
  CheckCircle,
} from "lucide-react";
import Link from "next/link";

// Revalidate every 60 seconds instead of 0 (no cache)
export const revalidate = 60;

const HomePage = async () => {
  // Fetch data in parallel with timeout protection
  const results = await Promise.allSettled([
    getBillboards(),
    getProduct({ isFeatured: true }),
    getCategories(),
    getProduct({}),
    getProduct({}),
  ]);

  const billboards = results[0].status === "fulfilled" ? results[0].value : [];
  const featuredProducts =
    results[1].status === "fulfilled" ? results[1].value : [];
  const categories = results[2].status === "fulfilled" ? results[2].value : [];
  const newProducts = results[3].status === "fulfilled" ? results[3].value : [];
  const bestSellers = results[4].status === "fulfilled" ? results[4].value : [];

  // Get latest products
  const latestProducts = newProducts
    .sort(
      (a, b) =>
        new Date((b as any).createdAt || 0).getTime() -
        new Date((a as any).createdAt || 0).getTime()
    )
    .slice(0, 12);

  // Get best sellers (sorted by sold count)
  const topSellers = bestSellers
    .sort((a, b) => (b.sold || 0) - (a.sold || 0))
    .slice(0, 12);

  return (
    <div className="bg-white min-h-screen">
      {/* Hero Banner Carousel - Full Width */}
      <section className="bg-white border-b border-gray-200 w-full">
        {billboards && billboards.length > 0 ? (
          <BillboardCarousel billboards={billboards} />
        ) : (
          <div className="w-full min-h-[500px] md:min-h-[600px] bg-gray-50 border border-gray-200 flex items-center justify-center">
            <p className="text-black text-xl font-light tracking-widest uppercase">
              Chưa có banner
            </p>
          </div>
        )}
      </section>

      {/* Trust Badges / Features Section */}
      <section className="bg-white border-b border-gray-200 py-8 md:py-12">
        <Container>
          <div className="px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
              <div className="flex flex-col items-center text-center space-y-2">
                <div className="w-12 h-12 md:w-14 md:h-14 border border-gray-300 rounded-none flex items-center justify-center bg-white">
                  <Shield className="w-6 h-6 md:w-7 md:h-7 text-black" />
                </div>
                <h3 className="text-xs md:text-sm font-light text-black uppercase tracking-wide">
                  Chất lượng đảm bảo
                </h3>
                <p className="text-xs text-gray-600 font-light hidden md:block">
                  100% chính hãng
                </p>
              </div>

              <div className="flex flex-col items-center text-center space-y-2">
                <div className="w-12 h-12 md:w-14 md:h-14 border border-gray-300 rounded-none flex items-center justify-center bg-white">
                  <Truck className="w-6 h-6 md:w-7 md:h-7 text-black" />
                </div>
                <h3 className="text-xs md:text-sm font-light text-black uppercase tracking-wide">
                  Giao hàng nhanh
                </h3>
                <p className="text-xs text-gray-600 font-light hidden md:block">
                  3-5 ngày làm việc
                </p>
              </div>

              <div className="flex flex-col items-center text-center space-y-2">
                <div className="w-12 h-12 md:w-14 md:h-14 border border-gray-300 rounded-none flex items-center justify-center bg-white">
                  <Award className="w-6 h-6 md:w-7 md:h-7 text-black" />
                </div>
                <h3 className="text-xs md:text-sm font-light text-black uppercase tracking-wide">
                  Đổi trả dễ dàng
                </h3>
                <p className="text-xs text-gray-600 font-light hidden md:block">
                  Trong 7 ngày
                </p>
              </div>

              <div className="flex flex-col items-center text-center space-y-2">
                <div className="w-12 h-12 md:w-14 md:h-14 border border-gray-300 rounded-none flex items-center justify-center bg-white">
                  <Clock className="w-6 h-6 md:w-7 md:h-7 text-black" />
                </div>
                <h3 className="text-xs md:text-sm font-light text-black uppercase tracking-wide">
                  Hỗ trợ 24/7
                </h3>
                <p className="text-xs text-gray-600 font-light hidden md:block">
                  Luôn sẵn sàng
                </p>
              </div>
            </div>
          </div>
        </Container>
      </section>

      <Container>
        {/* Categories Section */}
        {categories && categories.length > 0 && (
          <section className="px-4 sm:px-6 lg:px-8 py-16 md:py-20 bg-white border-b border-gray-200">
            <div className="mb-12 md:mb-16">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-4xl md:text-5xl lg:text-6xl font-light text-black mb-3 tracking-wide uppercase">
                    Bộ sưu tập
                  </h2>
                  <div className="w-20 md:w-24 h-px bg-black"></div>
                </div>
                <Link
                  href="/categories"
                  className="text-xs md:text-sm font-light text-gray-600 hover:text-black uppercase tracking-wider transition-colors hidden md:block"
                >
                  Xem tất cả →
                </Link>
              </div>
              <p className="text-gray-600 mt-6 font-light text-sm md:text-base tracking-wide max-w-2xl">
                Khám phá các danh mục thời trang của chúng tôi
              </p>
            </div>
            <CategoryList items={categories} />
            <div className="mt-8 text-center md:hidden">
              <Link
                href="/categories"
                className="text-xs font-light text-gray-600 hover:text-black uppercase tracking-wider transition-colors"
              >
                Xem tất cả →
              </Link>
            </div>
          </section>
        )}

        {/* Featured Products */}
        {featuredProducts.length > 0 && (
          <section className="px-4 sm:px-6 lg:px-8 py-16 md:py-20 bg-gray-50 border-b border-gray-200">
            <div className="mb-12 md:mb-16">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-4xl md:text-5xl lg:text-6xl font-light text-black mb-3 tracking-wide uppercase">
                    Sản phẩm nổi bật
                  </h2>
                  <div className="w-20 md:w-24 h-px bg-black"></div>
                </div>
                <Link
                  href="/products?featured=true"
                  className="text-xs md:text-sm font-light text-gray-600 hover:text-black uppercase tracking-wider transition-colors hidden md:block"
                >
                  Xem tất cả →
                </Link>
              </div>
              <p className="text-gray-600 mt-6 font-light text-sm md:text-base tracking-wide max-w-2xl">
                Những mẫu thời trang được yêu thích nhất
              </p>
            </div>
            <ProductList title="" items={featuredProducts.slice(0, 12)} />
            <div className="mt-8 text-center md:hidden">
              <Link
                href="/products?featured=true"
                className="text-xs font-light text-gray-600 hover:text-black uppercase tracking-wider transition-colors"
              >
                Xem tất cả →
              </Link>
            </div>
          </section>
        )}

        {/* New Arrivals */}
        {latestProducts.length > 0 && (
          <section className="px-4 sm:px-6 lg:px-8 py-16 md:py-20 bg-white border-b border-gray-200">
            <div className="mb-12 md:mb-16">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-4xl md:text-5xl lg:text-6xl font-light text-black mb-3 tracking-wide uppercase">
                    Hàng mới về
                  </h2>
                  <div className="w-20 md:w-24 h-px bg-black"></div>
                </div>
                <Link
                  href="/products?sort=newest"
                  className="text-xs md:text-sm font-light text-gray-600 hover:text-black uppercase tracking-wider transition-colors hidden md:block"
                >
                  Xem tất cả →
                </Link>
              </div>
              <p className="text-gray-600 mt-6 font-light text-sm md:text-base tracking-wide max-w-2xl">
                Những sản phẩm mới nhất từ bộ sưu tập
              </p>
            </div>
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
                href="/products?sort=newest"
                className="text-xs font-light text-gray-600 hover:text-black uppercase tracking-wider transition-colors"
              >
                Xem tất cả →
              </Link>
            </div>
          </section>
        )}

        {/* Best Sellers */}
        {topSellers.length > 0 && (
          <section className="px-4 sm:px-6 lg:px-8 py-16 md:py-20 bg-gray-50 border-b border-gray-200">
            <div className="mb-12 md:mb-16">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-4xl md:text-5xl lg:text-6xl font-light text-black mb-3 tracking-wide uppercase">
                    Bán chạy nhất
                  </h2>
                  <div className="w-20 md:w-24 h-px bg-black"></div>
                </div>
                <Link
                  href="/products?sort=bestseller"
                  className="text-xs md:text-sm font-light text-gray-600 hover:text-black uppercase tracking-wider transition-colors hidden md:block"
                >
                  Xem tất cả →
                </Link>
              </div>
              <p className="text-gray-600 mt-6 font-light text-sm md:text-base tracking-wide max-w-2xl">
                Những sản phẩm được khách hàng yêu thích nhất
              </p>
            </div>
            <ProductList title="" items={topSellers} />
            <div className="mt-8 text-center md:hidden">
              <Link
                href="/products?sort=bestseller"
                className="text-xs font-light text-gray-600 hover:text-black uppercase tracking-wider transition-colors"
              >
                Xem tất cả →
              </Link>
            </div>
          </section>
        )}

        {/* Why Choose Us Section */}
        <section className="px-4 sm:px-6 lg:px-8 py-16 md:py-20 bg-white border-b border-gray-200">
          <div className="max-w-4xl mx-auto">
            <div className="mb-12 text-center">
              <h2 className="text-4xl md:text-5xl lg:text-6xl font-light text-black mb-3 tracking-wide uppercase">
                Tại sao chọn chúng tôi
              </h2>
              <div className="w-20 md:w-24 h-px bg-black mx-auto"></div>
            </div>
            <div className="grid md:grid-cols-2 gap-8 md:gap-12">
              <div className="space-y-4">
                <div className="flex items-start gap-4">
                  <CheckCircle className="w-6 h-6 text-black shrink-0 mt-1" />
                  <div>
                    <h3 className="text-lg font-light text-black uppercase tracking-wide mb-2">
                      Chất lượng cao cấp
                    </h3>
                    <p className="text-sm text-gray-600 font-light leading-relaxed">
                      Sản phẩm được chọn lọc kỹ lưỡng, đảm bảo chất lượng tốt
                      nhất cho khách hàng
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <CheckCircle className="w-6 h-6 text-black shrink-0 mt-1" />
                  <div>
                    <h3 className="text-lg font-light text-black uppercase tracking-wide mb-2">
                      Giá cả hợp lý
                    </h3>
                    <p className="text-sm text-gray-600 font-light leading-relaxed">
                      Giá cả cạnh tranh với nhiều chương trình khuyến mãi hấp
                      dẫn
                    </p>
                  </div>
                </div>
              </div>
              <div className="space-y-4">
                <div className="flex items-start gap-4">
                  <CheckCircle className="w-6 h-6 text-black shrink-0 mt-1" />
                  <div>
                    <h3 className="text-lg font-light text-black uppercase tracking-wide mb-2">
                      Dịch vụ chuyên nghiệp
                    </h3>
                    <p className="text-sm text-gray-600 font-light leading-relaxed">
                      Đội ngũ tư vấn nhiệt tình, hỗ trợ khách hàng 24/7
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <CheckCircle className="w-6 h-6 text-black shrink-0 mt-1" />
                  <div>
                    <h3 className="text-lg font-light text-black uppercase tracking-wide mb-2">
                      Thanh toán an toàn
                    </h3>
                    <p className="text-sm text-gray-600 font-light leading-relaxed">
                      Hệ thống thanh toán bảo mật, đảm bảo an toàn thông tin
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Newsletter Section */}
        <section className="px-4 sm:px-6 lg:px-8 py-16 md:py-20 bg-white">
          <div className="max-w-4xl mx-auto">
            <div className="bg-white border-2 border-black rounded-none p-8 md:p-12 lg:p-16 text-center">
              <div className="mb-6">
                <Sparkles className="w-12 h-12 md:w-16 md:h-16 text-black mx-auto mb-4" />
              </div>
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-light mb-4 tracking-widest uppercase text-black">
                Đăng ký nhận tin
              </h2>
              <p className="text-gray-600 mb-8 md:mb-10 text-sm md:text-base font-light tracking-wide max-w-xl mx-auto">
                Nhận thông tin về sản phẩm mới và ưu đãi đặc biệt. Đăng ký ngay
                để không bỏ lỡ bất kỳ cơ hội nào!
              </p>
              <NewsletterForm />
            </div>
          </div>
        </section>
      </Container>
    </div>
  );
};

export default HomePage;
