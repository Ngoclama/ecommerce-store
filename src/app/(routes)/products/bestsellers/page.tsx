import Container from "@/components/ui/container";
import ProductList from "@/components/product-list";
import NoResult from "@/components/ui/result";
import Pagination from "@/components/ui/pagination";

export const revalidate = 0;

type SearchParams = Promise<{
  page?: string;
}>;

const BestSellersPage = async ({
  searchParams,
}: {
  searchParams: SearchParams;
}) => {
  const params = await searchParams;
  const page = parseInt(params.page || "1");
  const limit = 10;

  let products: any[] = [];
  let pagination: any = null;

  try {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL;
    if (!apiUrl) {
      console.error("[BESTSELLERS] NEXT_PUBLIC_API_URL is not configured");
      return (
        <div className="bg-white dark:bg-gray-900 min-h-screen">
          <Container>
            <div className="px-4 py-16 sm:px-6 lg:px-8">
              <NoResult />
            </div>
          </Container>
        </div>
      );
    }

    const baseUrl = apiUrl.replace(/\/$/, "");
    const url = `${baseUrl}/api/products?sort=bestseller&page=${page}&limit=${limit}`;

    const res = await fetch(url, {
      cache: "no-store",
    });

    if (!res.ok) {
      console.error("Failed to fetch bestsellers:", res.status, res.statusText);
      return (
        <div className="bg-white dark:bg-gray-900 min-h-screen">
          <Container>
            <div className="px-4 py-16 sm:px-6 lg:px-8">
              <NoResult />
            </div>
          </Container>
        </div>
      );
    }

    const data = await res.json();
    if (data.products && data.pagination) {
      products = data.products;
      pagination = data.pagination;
    } else if (Array.isArray(data)) {
      products = data;
    } else {
      products = [];
    }
  } catch (error) {
    console.error("Error fetching bestsellers:", error);
  }

  return (
    <div className="bg-white dark:bg-gray-900 min-h-screen">
      <Container>
        <div className="px-4 py-16 sm:px-6 lg:px-8">
          <div className="mb-12 md:mb-16">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-light text-black dark:text-white mb-3 tracking-wide uppercase">
              Bán chạy nhất
            </h1>
            <div className="w-20 md:w-24 h-px bg-black dark:bg-white mb-6"></div>
            <p className="text-gray-600 dark:text-gray-400 mt-6 font-light text-sm md:text-base tracking-wide max-w-2xl">
              Những sản phẩm được khách hàng yêu thích nhất
            </p>
          </div>

          {products.length === 0 ? (
            <NoResult />
          ) : (
            <>
              <ProductList title="" items={products} />
              {pagination && (
                <Pagination
                  pagination={pagination}
                  basePath="/products/bestsellers"
                />
              )}
            </>
          )}
        </div>
      </Container>
    </div>
  );
};

export default BestSellersPage;

