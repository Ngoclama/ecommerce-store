import getProduct from "@/actions/get-product";
import getProducts from "@/actions/get-products";
import ProductClient from "./product-client";
import ProductPageClient from "./product-page-client";
import Container from "@/components/ui/container";
import NoResult from "@/components/ui/result";

// Force dynamic rendering to prevent caching issues
export const dynamic = "force-dynamic";
export const fetchCache = "force-no-store";
export const revalidate = 0;

type Params = Promise<{ productId: string }>;

const ProductPage = async ({ params }: { params: Params }) => {
  const { productId } = await params;
  const product = await getProduct(productId);

  if (!product) {
    return (
      <div className="bg-gradient-to-br from-neutral-50 via-white to-neutral-50 dark:from-neutral-950 dark:via-gray-900 dark:to-neutral-950 min-h-screen">
        <ProductClient product={product} />
        <Container>
          <div className="px-4 py-24 sm:px-6 lg:px-8">
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
    <div className="bg-gradient-to-br from-neutral-50 via-white to-neutral-50 dark:from-neutral-950 dark:via-gray-900 dark:to-neutral-950 min-h-screen">
      <ProductClient product={product} />
      <Container>
        <div className="px-4 sm:px-6 lg:px-8 py-16 md:py-24">
          <ProductPageClient
            product={product}
            suggestProducts={suggestProducts}
          />
        </div>
      </Container>
    </div>
  );
};

export default ProductPage;
