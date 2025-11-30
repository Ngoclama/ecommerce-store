import getProduct from "@/actions/get-product";
import getProducts from "@/actions/get-products";
import Gallery from "@/components/gallery";
import Info from "@/components/info";
import ProductList from "@/components/product-list";
import ReviewsSection from "@/components/reviews-section";
import RecentlyViewed from "@/components/recently-viewed";
import ProductClient from "./product-client";
import Container from "@/components/ui/container";
import NoResult from "@/components/ui/result";

type Params = Promise<{ productId: string }>;

const ProductPage = async ({ params }: { params: Params }) => {
  const { productId } = await params;
  const product = await getProduct(productId);

  if (!product) {
    return (
      <div className="bg-white">
        <ProductClient product={product} />
        <Container>
          <div className="px-4 py-10 sm:px-6 lg:px-8">
            <NoResult />
          </div>
        </Container>
      </div>
    );
  }

  const suggestProductsResult = await getProducts({
    categoryId: product?.category?.id,
  });
  
  // Handle different return types from getProducts
  const suggestProducts = Array.isArray(suggestProductsResult) 
    ? suggestProductsResult 
    : suggestProductsResult?.products || [];
    
  return (
    <div className="bg-white">
      <ProductClient product={product} />
      <Container>
        <div className="px-4 py-10 sm:px-6 lg:px-8">
          <div className="lg:grid lg:grid-cols-2 lg:items-start lg:gap-x-8">
            {/* Gallery */}
            <Gallery
              images={product.images}
              discountPercent={
                product.originalPrice &&
                product.price &&
                product.originalPrice > product.price
                  ? Math.round(
                      ((product.originalPrice - product.price) /
                        product.originalPrice) *
                        100
                    )
                  : 0
              }
            />
            <div className="px-4 mt-0 sm:mt-16 sm:px-0 lg:mt-0">
              {/* Info */}
              <Info data={product} />
            </div>
          </div>

          {/* Reviews Section */}
          <div className="mt-12 px-4 sm:px-6 lg:px-8">
            <ReviewsSection
              productId={product.id}
              storeId={(product as any).storeId}
              averageRating={product.rating || 0}
              totalReviews={0}
            />
          </div>

          {/* Recently Viewed */}
          <div className="mt-12 px-4 sm:px-6 lg:px-8">
            <RecentlyViewed currentProductId={product.id} />
          </div>

          {/* Related Products - Aigle Style */}
          <div className="mt-16 px-4 sm:px-6 lg:px-8">
            <div className="mb-10">
              <h2 className="text-2xl md:text-3xl font-light text-black dark:text-white uppercase tracking-wider">
                Sản phẩm liên quan
              </h2>
            </div>
            <ProductList
              title=""
              items={suggestProducts
                .filter((p) => p.id !== product.id)
                .slice(0, 8)}
            />
          </div>
        </div>
      </Container>
    </div>
  );
};

export default ProductPage;
