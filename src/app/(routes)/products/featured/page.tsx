import getProducts from "@/actions/get-products";
import Container from "@/components/ui/container";
import ProductList from "@/components/product-list";
import NoResult from "@/components/ui/result";
import Pagination from "@/components/ui/pagination";

export const revalidate = 0;

type SearchParams = Promise<{
  page?: string;
}>;

const FeaturedProductsPage = async ({
  searchParams,
}: {
  searchParams: SearchParams;
}) => {
  const params = await searchParams;
  const page = parseInt(params.page || "1");
  const limit = 10;

  const result = await getProducts({
    isFeatured: true,
    page,
    limit,
  });

  const isPaginationResult =
    result && typeof result === "object" && "products" in result;
  const products = isPaginationResult
    ? (result as { products: any[]; pagination: any }).products
    : (result as any[]);
  const pagination = isPaginationResult
    ? (result as { products: any[]; pagination: any }).pagination
    : null;

  return (
    <div className="bg-white dark:bg-gray-900 min-h-screen">
      <Container>
        <div className="px-4 py-16 sm:px-6 lg:px-8">
          <div className="mb-12 md:mb-16">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-light text-black dark:text-white mb-3 tracking-wide uppercase">
              Sản phẩm nổi bật
            </h1>
            <div className="w-20 md:w-24 h-px bg-black dark:bg-white mb-6"></div>
            <p className="text-gray-600 dark:text-gray-400 mt-6 font-light text-sm md:text-base tracking-wide max-w-2xl">
              Những mẫu thời trang được yêu thích nhất
            </p>
          </div>

          {products.length === 0 ? (
            <NoResult />
          ) : (
            <>
              <ProductList title="" items={products} />
              {pagination && (
                <Pagination pagination={pagination} basePath="/products/featured" />
              )}
            </>
          )}
        </div>
      </Container>
    </div>
  );
};

export default FeaturedProductsPage;

