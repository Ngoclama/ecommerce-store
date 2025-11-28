import { Category } from "@/types";

const getCategories = async (): Promise<Category[]> => {
  try {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL;
    if (!apiUrl) {
      console.error("[CATEGORIES] NEXT_PUBLIC_API_URL is not configured");
      return [];
    }

    // Ensure API URL doesn't have trailing slash
    const baseUrl = apiUrl.replace(/\/$/, "");
    const URL = `${baseUrl}/api/categories`;

    if (process.env.NODE_ENV === "development") {
      console.log("[CATEGORIES] Fetching from:", URL);
    }

    // Add timeout to prevent hanging
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000); // 10s timeout

    const res = await fetch(URL, {
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (!res.ok) {
      console.error(
        `Failed to fetch categories: ${res.status} ${res.statusText}`
      );
      return [];
    }
    const data = await res.json();
    return data.data || [];
  } catch (error: any) {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL;
    if (error.name === "AbortError") {
      console.error("[CATEGORIES] Fetch timeout after 10s");
      console.error("[CATEGORIES] API URL:", apiUrl || "NOT CONFIGURED");
      console.error(
        "[CATEGORIES] Check if admin server is running at:",
        apiUrl || "NOT CONFIGURED"
      );
    } else if (
      error.message?.includes("fetch failed") ||
      error.message?.includes("ECONNREFUSED")
    ) {
      console.error(
        "[CATEGORIES] Network error - Admin server may not be running"
      );
      console.error("[CATEGORIES] API URL:", apiUrl || "NOT CONFIGURED");
      console.error("[CATEGORIES] Error:", error.message);
    } else {
      console.error("[CATEGORIES] Error fetching categories:", error);
      console.error("[CATEGORIES] API URL:", apiUrl || "NOT CONFIGURED");
    }
    return [];
  }
};

export default getCategories;
