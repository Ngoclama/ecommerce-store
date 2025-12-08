import { Billboard } from "@/types";

const getBillboards = async (): Promise<Billboard[]> => {
  try {
    
    const apiUrl = process.env.NEXT_PUBLIC_API_URL;
    if (!apiUrl) {
      console.error("[BILLBOARDS] NEXT_PUBLIC_API_URL is not configured");
      console.error(
        "[BILLBOARDS] Please set NEXT_PUBLIC_API_URL in your .env.local file"
      );
      return [];
    }

    
    const baseUrl = apiUrl.replace(/\/$/, "");
    const URL = `${baseUrl}/api/billboards`;

    
    if (process.env.NODE_ENV === "development") {
      console.log("[BILLBOARDS] Fetching from:", URL);
    }

    
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 5000); 

    
    const res = await fetch(URL, {
      cache: "no-store", 
      signal: controller.signal,
      headers: {
        "Content-Type": "application/json",
        "Cache-Control": "no-cache, no-store, must-revalidate",
        Pragma: "no-cache",
        Expires: "0",
      },
    });

    clearTimeout(timeoutId);

    if (!res.ok) {
      console.error(
        `[BILLBOARDS] Failed to fetch: ${res.status} ${res.statusText}`
      );
      console.error(`[BILLBOARDS] Response URL: ${res.url}`);
      const text = await res.text();
      console.error(`[BILLBOARDS] Response body:`, text.substring(0, 200));
      return [];
    }

    const data = await res.json();
    console.log("[BILLBOARDS] Received data:", {
      isArray: Array.isArray(data),
      length: Array.isArray(data) ? data.length : data?.data?.length || 0,
      firstItem: Array.isArray(data) ? data[0] : data?.data?.[0],
    });

    
    const billboards = Array.isArray(data) ? data : data.data || [];
    console.log(`[BILLBOARDS] Returning ${billboards.length} billboards`);

    if (billboards.length > 0) {
      console.log("[BILLBOARDS] First billboard:", {
        id: billboards[0].id,
        label: billboards[0].label,
        hasImage: !!billboards[0].imageUrl,
      });
    }

    return billboards;
  } catch (error: any) {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL;
    if (error.name === "AbortError") {
      console.error("[BILLBOARDS] Fetch timeout after 10s.");
      console.error(
        "[BILLBOARDS] Check if admin server is running at:",
        apiUrl || "NOT CONFIGURED"
      );
      console.error(
        "[BILLBOARDS] Full URL would be:",
        apiUrl ? `${apiUrl.replace(/\/$/, "")}/api/billboards` : "N/A"
      );
    } else if (
      error.message?.includes("fetch failed") ||
      error.message?.includes("ECONNREFUSED")
    ) {
      console.error(
        "[BILLBOARDS] Network error - Admin server may not be running"
      );
      console.error(
        "[BILLBOARDS] Expected URL:",
        apiUrl ? `${apiUrl.replace(/\/$/, "")}/api/billboards` : "N/A"
      );
      console.error("[BILLBOARDS] Error:", error.message);
    } else {
      console.error("[BILLBOARDS] Error fetching billboards:", error);
      console.error("[BILLBOARDS] Error name:", error.name);
      console.error("[BILLBOARDS] Error message:", error.message);
      console.error("[BILLBOARDS] API URL:", apiUrl || "NOT CONFIGURED");
    }
    return [];
  }
};

export default getBillboards;
