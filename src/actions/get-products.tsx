import { Product } from "@/types";
import qs from "query-string";

interface Query {
  categoryId?: string;
  colorId?: string;
  sizeId?: string;
  isFeatured?: boolean;
  sort?: string;
  page?: number;
  limit?: number;
}

const getProducts = async (
  query: Query
): Promise<Product[] | { products: Product[]; pagination: any }> => {
  try {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL;
    if (!apiUrl) {
      console.error("[PRODUCTS] NEXT_PUBLIC_API_URL is not configured");
      return [];
    }

    // Ensure API URL doesn't have trailing slash
    const baseUrl = apiUrl.replace(/\/$/, "");
    const baseURL = `${baseUrl}/api/products`;

    const url = qs.stringifyUrl({
      url: baseURL,
      query: {
        colorId: query.colorId,
        sizeId: query.sizeId,
        categoryId: query.categoryId,
        isFeatured: query.isFeatured,
        sort: query.sort,
        page: query.page,
        limit: query.limit,
      },
    });

    if (process.env.NODE_ENV === "development") {
      console.log("[PRODUCTS] Fetching from:", url);
    }

    // Add timeout to prevent hanging
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 30000); // 30s timeout

    const res = await fetch(url, {
      cache: "no-store",
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (!res.ok) {
      console.error("Failed to fetch products:", res.status, res.statusText);
      return [];
    }

    const data = await res.json();
    // Handle different response formats:
    // 1. Array directly: [...]
    // 2. { data: [...] }
    // 3. { products: [...], pagination: {...} } (new format with pagination)
    if (Array.isArray(data)) {
      return data;
    }
    if (data.products && Array.isArray(data.products)) {
      // If pagination is requested, return with pagination
      if (query.page && data.pagination) {
        return { products: data.products, pagination: data.pagination };
      }
      return data.products;
    }
    if (data.data && Array.isArray(data.data)) {
      return data.data;
    }
    return [];
  } catch (error: any) {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL;
    if (error.name === "AbortError") {
      console.error("[PRODUCTS] Fetch timeout after 30s");
      console.error("[PRODUCTS] API URL:", apiUrl || "NOT CONFIGURED");
      console.error(
        "[PRODUCTS] Check if admin server is running at:",
        apiUrl || "NOT CONFIGURED"
      );
      console.error(
        "[PRODUCTS] Note: Admin server typically runs on port 3000, store on port 3001"
      );
    } else if (
      error.message?.includes("fetch failed") ||
      error.message?.includes("ECONNREFUSED")
    ) {
      console.error(
        "[PRODUCTS] Network error - Admin server may not be running"
      );
      console.error("[PRODUCTS] API URL:", apiUrl || "NOT CONFIGURED");
      console.error("[PRODUCTS] Error:", error.message);
    } else {
      console.error("[PRODUCTS] Error fetching products:", error);
      console.error("[PRODUCTS] API URL:", apiUrl || "NOT CONFIGURED");
    }
    return [];
  }
};

export default getProducts;
