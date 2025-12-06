import getBillboards from "@/actions/get-billboards";
import getProduct from "@/actions/get-products";
import getCategories from "@/actions/get-categories";
import HomePageClient from "./page-client";

// Always fetch fresh data to avoid F5 issues
// Disable caching completely for home page to ensure data is always fresh
export const revalidate = 0;
export const dynamic = "force-dynamic";
export const fetchCache = "force-no-store";

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
  const featuredProductsResult =
    results[1].status === "fulfilled" ? results[1].value : [];
  const categories = results[2].status === "fulfilled" ? results[2].value : [];
  const newProductsResult =
    results[3].status === "fulfilled" ? results[3].value : [];
  const bestSellersResult =
    results[4].status === "fulfilled" ? results[4].value : [];

  // Handle different return types from getProducts
  const featuredProducts = Array.isArray(featuredProductsResult)
    ? featuredProductsResult
    : featuredProductsResult?.products || [];
  const newProducts = Array.isArray(newProductsResult)
    ? newProductsResult
    : newProductsResult?.products || [];
  const bestSellers = Array.isArray(bestSellersResult)
    ? bestSellersResult
    : bestSellersResult?.products || [];

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
    <HomePageClient
      billboards={billboards}
      featuredProducts={featuredProducts}
      categories={categories}
      latestProducts={latestProducts}
      topSellers={topSellers}
    />
  );
};

export default HomePage;
