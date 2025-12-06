import getBillboards from "@/actions/get-billboards";
import getProduct from "@/actions/get-products";
import getCategories from "@/actions/get-categories";
import HomePageClient from "./page-client";

// Force dynamic rendering to prevent caching issues
export const dynamic = "force-dynamic";
export const fetchCache = "force-no-store";
export const revalidate = 0; // No revalidation, always fetch fresh data

const HomePage = async () => {
  try {
    // Fetch billboards first (highest priority) with shorter timeout
    // Then fetch other data in parallel
    const billboardsPromise = getBillboards();

    // Fetch other data in parallel with timeout
    const fetchWithTimeout = async <T,>(
      promise: Promise<T>,
      timeoutMs: number = 8000
    ): Promise<T> => {
      const timeoutPromise = new Promise<T>((_, reject) =>
        setTimeout(() => reject(new Error("Fetch timeout")), timeoutMs)
      );
      return Promise.race([promise, timeoutPromise]);
    };

    // Fetch other data in parallel
    const results = await Promise.allSettled([
      billboardsPromise, // Billboard is first priority
      fetchWithTimeout(getProduct({ isFeatured: true }), 8000),
      fetchWithTimeout(getCategories(), 8000),
      fetchWithTimeout(getProduct({}), 8000),
      fetchWithTimeout(getProduct({}), 8000),
    ]);

    const billboards =
      results[0].status === "fulfilled" ? results[0].value : [];
    const featuredProductsResult =
      results[1].status === "fulfilled" ? results[1].value : [];
    const categories =
      results[2].status === "fulfilled" ? results[2].value : [];
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
  } catch (error) {
    console.error("[HOMEPAGE] Error rendering page:", error);
    // Return page with empty data instead of crashing
    return (
      <HomePageClient
        billboards={[]}
        featuredProducts={[]}
        categories={[]}
        latestProducts={[]}
        topSellers={[]}
      />
    );
  }
};

export default HomePage;
