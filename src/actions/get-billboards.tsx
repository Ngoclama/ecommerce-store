import { Billboard } from "@/types";

const getBillboards = async (): Promise<Billboard[]> => {
  try {
    // Validate API URL
    const apiUrl = process.env.NEXT_PUBLIC_API_URL;
    if (!apiUrl) {
      console.error("[BILLBOARDS] NEXT_PUBLIC_API_URL is not configured");
      return [];
    }

    // Ensure API URL doesn't have trailing slash
    const baseUrl = apiUrl.replace(/\/$/, "");
    const URL = `${baseUrl}/api/billboards`;

    // Log URL in development for debugging
    if (process.env.NODE_ENV === "development") {
      console.log("[BILLBOARDS] API URL:", apiUrl);
      console.log("[BILLBOARDS] Fetching from:", URL);
    }

    // Add timeout to prevent hanging
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000); // 10s timeout

    const res = await fetch(URL, {
      cache: "no-store",
      signal: controller.signal,
      headers: {
        "Content-Type": "application/json",
      },
    });

    clearTimeout(timeoutId);

    if (!res.ok) {
      console.error(
        `[BILLBOARDS] Failed to fetch: ${res.status} ${res.statusText}`
      );
      return [];
    }

    const data = await res.json();
    // Handle both array response and { data: [...] } response
    return Array.isArray(data) ? data : data.data || [];
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
      console.error("[BILLBOARDS] API URL:", apiUrl || "NOT CONFIGURED");
    }
    return [];
  }
};

export default getBillboards;
