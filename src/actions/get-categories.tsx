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

    // Add timeout to prevent hanging - increased to 15s for better reliability
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 15000); // 15s timeout

    const res = await fetch(URL, {
      signal: controller.signal,
      cache: "no-store", // Ensure fresh data
      next: { revalidate: 60 }, // Revalidate every 60 seconds
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
      console.error("[CATEGORIES] Fetch timeout after 15s");
      console.error("[CATEGORIES] API URL:", apiUrl || "NOT CONFIGURED");
      console.error(
        "[CATEGORIES] Check if admin server is running at:",
        apiUrl || "NOT CONFIGURED"
      );
      console.error(
        "[CATEGORIES] Note: Admin server typically runs on port 3000, store on port 3001"
      );
    } else if (
      error.message?.includes("fetch failed") ||
      error.message?.includes("ECONNREFUSED") ||
      error.message?.includes("Failed to fetch")
    ) {
      console.error(
        "[CATEGORIES] Network error - Admin server may not be running"
      );
      console.error("[CATEGORIES] API URL:", apiUrl || "NOT CONFIGURED");
      console.error("[CATEGORIES] Error:", error.message);
      console.error(
        "[CATEGORIES] Make sure admin server is running and NEXT_PUBLIC_API_URL points to it"
      );
    } else {
      console.error("[CATEGORIES] Error fetching categories:", error);
      console.error("[CATEGORIES] API URL:", apiUrl || "NOT CONFIGURED");
    }
    return [];
  }
};

export default getCategories;
