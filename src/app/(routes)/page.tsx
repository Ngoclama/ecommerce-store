import getBillboards from "@/actions/get-billboards";
import getProduct from "@/actions/get-products";
import getCategories from "@/actions/get-categories";
import HomePageClient from "./page-client";

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
