import { Category } from "@/types";

const getCategories = async (): Promise<Category[]> => {
  try {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL;
    if (!apiUrl) {
      console.error("[CATEGORIES] NEXT_PUBLIC_API_URL is not configured");
      return [];
    }

    
    const baseUrl = apiUrl.replace(/\/$/, "");
    const URL = `${baseUrl}/api/categories`;

    if (process.env.NODE_ENV === "development") {
      console.log("[CATEGORIES] Fetching from:", URL);
    }

    
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 15000); 

    const res = await fetch(URL, {
      signal: controller.signal,
      cache: "no-store", // Always fetch fresh data
    });

    clearTimeout(timeoutId);

    if (!res.ok) {
      console.error(
        `Failed to fetch categories: ${res.status} ${res.statusText}`
      );
      return [];
    }
    const data = await res.json();
    const allCategories: Category[] = data.data || [];

    // Lọc chỉ lấy category cha (không có parentId)
    const parentCategories = allCategories.filter(
      (category) => !category.parentId
    );

    // Thêm children vào mỗi parent category
    const categoriesWithChildren = parentCategories.map((parent) => ({
      ...parent,
      children: allCategories.filter((cat) => cat.parentId === parent.id),
    }));

    
    if (process.env.NODE_ENV === "development") {
      console.log(
        "[CATEGORIES] Parent categories count:",
        parentCategories.length
      );
      console.log(
        "[CATEGORIES] Categories with billboard:",
        parentCategories.filter((c) => c.billboard?.imageUrl).length
      );
      console.log(
        "[CATEGORIES] Categories without billboard:",
        parentCategories
          .filter((c) => !c.billboard?.imageUrl)
          .map((c) => c.name)
      );
    }

    return categoriesWithChildren;
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
