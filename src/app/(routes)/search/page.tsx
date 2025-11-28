import getProducts from "@/actions/get-products";
import Container from "@/components/ui/container";
import ProductList from "@/components/product-list";
import NoResult from "@/components/ui/result";
import { Suspense } from "react";

type SearchParams = Promise<{ q?: string }>;

const SearchPage = async ({ searchParams }: { searchParams: SearchParams }) => {
  const { q } = await searchParams;
  const query = q || "";

  let products: any[] = [];

  if (query) {
    try {
      // Search products by name (you may need to add a search API endpoint)
      const allProducts = await getProducts({});
      products = allProducts.filter(
        (product) =>
          product.name.toLowerCase().includes(query.toLowerCase()) ||
          product.description?.toLowerCase().includes(query.toLowerCase())
      );
    } catch (error) {
      console.error("Search error:", error);
    }
  }

  return (
    <div className="bg-white min-h-screen">
      <Container>
        <div className="px-4 py-16 sm:px-6 lg:px-8">
          <div className="mb-8">
            <h1 className="text-3xl md:text-4xl font-light text-black mb-2 uppercase tracking-wider">
              Search results
            </h1>
            {query && (
              <p className="text-gray-600 text-sm font-light">
                Found {products.length} products for "{query}"
              </p>
            )}
          </div>

          {!query ? (
            <div className="py-20 text-center">
              <p className="text-gray-500 text-sm font-light">
                Please enter a search keyword
              </p>
            </div>
          ) : products.length === 0 ? (
            <NoResult />
          ) : (
            <ProductList title="" items={products} />
          )}
        </div>
      </Container>
    </div>
  );
};

export default function SearchPageWrapper({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <SearchPage searchParams={searchParams} />
    </Suspense>
  );
}
