import getCategories from "@/actions/get-categories";
import getSizes from "@/actions/get-sizes";
import getColors from "@/actions/get-colors";
import Container from "@/components/ui/container";
import ProductList from "@/components/product-list";
import NoResult from "@/components/ui/result";
import { Suspense } from "react";
import SearchFilters from "./components/search-filters";
import SearchPagination from "./components/search-pagination";

type SearchParams = Promise<{
  q?: string;
  categoryId?: string;
  sizeId?: string;
  colorId?: string;
  page?: string;
}>;

const SearchPage = async ({ searchParams }: { searchParams: SearchParams }) => {
  const params = await searchParams;
  const query = params.q || "";
  const categoryId = params.categoryId || undefined;
  const sizeId = params.sizeId || undefined;
  const colorId = params.colorId || undefined;
  const page = parseInt(params.page || "1");

  let products: any[] = [];
  let pagination: any = null;

  // Fetch filter options
  const [categories, sizes, colors] = await Promise.all([
    getCategories(),
    getSizes(),
    getColors(),
  ]);

  if (query) {
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL;
      if (!apiUrl) {
        console.error("[SEARCH] NEXT_PUBLIC_API_URL is not configured");
        return;
      }

      const baseUrl = apiUrl.replace(/\/$/, "");
      const searchParams = new URLSearchParams({
        q: query,
        page: page.toString(),
        limit: "10",
      });

      if (categoryId) searchParams.append("categoryId", categoryId);
      if (sizeId) searchParams.append("sizeId", sizeId);
      if (colorId) searchParams.append("colorId", colorId);

      const searchUrl = `${baseUrl}/api/products?${searchParams.toString()}`;

      const res = await fetch(searchUrl, {
        cache: "no-store",
      });

      if (!res.ok) {
        console.error("Failed to search products:", res.status, res.statusText);
        return;
      }

      const data = await res.json();
      products = data.products || [];
      pagination = data.pagination || null;
    } catch (error) {
      console.error("Search error:", error);
    }
  }

  return (
    <div className="bg-white dark:bg-gray-900 min-h-screen">
      <Container>
        <div className="px-4 py-16 sm:px-6 lg:px-8">
          <div className="mb-8">
            <h1 className="text-3xl md:text-4xl font-light text-black dark:text-white mb-2 uppercase tracking-wider">
              Kết quả tìm kiếm
            </h1>
            {query && (
              <p className="text-gray-600 dark:text-gray-400 text-sm font-light">
                Tìm thấy {pagination?.totalCount || products.length} sản phẩm
                cho &quot;{query}&quot;
              </p>
            )}
          </div>

          {!query ? (
            <div className="py-20 text-center">
              <p className="text-gray-500 dark:text-gray-400 text-sm font-light">
                Vui lòng nhập từ khóa tìm kiếm
              </p>
            </div>
          ) : (
            <div className="flex flex-col lg:flex-row gap-8">
              {/* Filters Sidebar */}
              <div className="lg:w-64 shrink-0">
                <SearchFilters
                  categories={categories}
                  sizes={sizes}
                  colors={colors}
                  currentFilters={{
                    categoryId,
                    sizeId,
                    colorId,
                  }}
                  searchQuery={query}
                />
              </div>

              {/* Products List */}
              <div className="flex-1">
                {products.length === 0 ? (
                  <NoResult />
                ) : (
                  <>
                    <ProductList title="" items={products} />
                    {pagination && pagination.totalPages > 1 && (
                      <div className="mt-8">
                        <SearchPagination
                          pagination={pagination}
                          searchQuery={query}
                          currentFilters={{ categoryId, sizeId, colorId }}
                        />
                      </div>
                    )}
                  </>
                )}
              </div>
            </div>
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
    <Suspense fallback={<div>Đang tải...</div>}>
      <SearchPage searchParams={searchParams} />
    </Suspense>
  );
}
