import { Product } from "@/types";
import qs from "query-string";

interface Query {
  categoryId?: string;
  colorId?: string;
  sizeId?: string;
  isFeatured?: boolean;
}

const getProducts = async (query: Query): Promise<Product[]> => {
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
      },
    });

    if (process.env.NODE_ENV === "development") {
      console.log("[PRODUCTS] Fetching from:", url);
    }

    // Add timeout to prevent hanging
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000); // 10s timeout

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
    // Handle both array response and { data: [...] } response
    return Array.isArray(data) ? data : data.data || [];
  } catch (error: any) {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL;
    if (error.name === "AbortError") {
      console.error("[PRODUCTS] Fetch timeout after 10s");
      console.error("[PRODUCTS] API URL:", apiUrl || "NOT CONFIGURED");
      console.error(
        "[PRODUCTS] Check if admin server is running at:",
        apiUrl || "NOT CONFIGURED"
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
