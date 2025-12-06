import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";

export async function GET(req: NextRequest) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json(
        { success: false, message: "Unauthenticated" },
        { status: 401 }
      );
    }

    const apiUrl = process.env.NEXT_PUBLIC_API_URL;
    
    // Enhanced logging for debugging
    console.log("[ORDERS_PROXY] Environment check:", {
      hasApiUrl: !!apiUrl,
      apiUrl: apiUrl ? `${apiUrl.substring(0, 20)}...` : "NOT SET",
      nodeEnv: process.env.NODE_ENV,
    });

    if (!apiUrl) {
      console.error("[ORDERS_PROXY] NEXT_PUBLIC_API_URL is not configured!");
      console.error("[ORDERS_PROXY] Please check your .env.local file");
      return NextResponse.json(
        { 
          success: false, 
          message: "API URL not configured. Please check NEXT_PUBLIC_API_URL in .env.local",
          debug: {
            hasApiUrl: false,
            nodeEnv: process.env.NODE_ENV,
          }
        },
        { status: 500 }
      );
    }

    const { searchParams } = new URL(req.url);
    const storeId = searchParams.get("storeId");

    const baseUrl = apiUrl.replace(/\/$/, "");
    // Pass userId as query parameter since we can't reliably forward Clerk cookies
    // Admin server will verify the userId matches the authenticated user
    let url = `${baseUrl}/api/orders/user?clerkUserId=${encodeURIComponent(
      userId
    )}`;
    if (storeId) {
      url += `&storeId=${encodeURIComponent(storeId)}`;
    }

    // Log full URL for debugging (truncate for security)
    console.log("[ORDERS_PROXY] Configuration:", {
      baseUrl,
      fullUrl: url.substring(0, 100) + "...",
      hasStoreId: !!storeId,
      userId: userId ? `${userId.substring(0, 10)}...` : "NONE",
    });

    try {
      // Forward cookies in case admin server needs them, but also pass userId explicitly
      const cookieHeader = req.headers.get("cookie") || "";

      console.log("[ORDERS_PROXY] Attempting to fetch orders from admin server...");

      // Retry logic for new orders (up to 3 attempts)
      let lastError: any = null;
      let attempts = 0;
      const maxAttempts = 3;
      
      while (attempts < maxAttempts) {
        try {
          // Create new abort controller for each attempt
          const controller = new AbortController();
          const timeoutId = setTimeout(() => controller.abort(), 45000); // 45 second timeout

          console.log(`[ORDERS_PROXY] Attempt ${attempts + 1}/${maxAttempts}: Fetching from ${baseUrl}...`);
          
          const response = await fetch(url, {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Cookie: cookieHeader,
            },
            credentials: "include",
            cache: "no-store",
            signal: controller.signal,
          });

          clearTimeout(timeoutId);

          console.log(`[ORDERS_PROXY] Response status: ${response.status} ${response.statusText}`);

          if (response.ok) {
            console.log("[ORDERS_PROXY] Successfully fetched orders");
            const data = await response.json();
            // Ensure we return an array
            let ordersData: any[] = [];
            if (Array.isArray(data)) {
              ordersData = data;
            } else if (data?.orders && Array.isArray(data.orders)) {
              ordersData = data.orders;
            } else if (data?.success === false) {
              return NextResponse.json(data, { status: response.status });
            }

            // Return with caching headers for better performance
            return NextResponse.json(ordersData, {
              headers: {
                "Content-Type": "application/json",
                // Cache for 30 seconds on client
                "Cache-Control": "private, max-age=30, stale-while-revalidate=60",
              },
            });
          }

          // If 503 and not last attempt, retry
          if (response.status === 503 && attempts < maxAttempts - 1) {
            attempts++;
            const waitTime = 2000 * attempts; // Exponential backoff: 2s, 4s, 6s
            console.warn(`[ORDERS_PROXY] 503 Service Unavailable. Retrying after ${waitTime}ms (attempt ${attempts}/${maxAttempts})...`);
            console.warn(`[ORDERS_PROXY] Admin server at ${baseUrl} may be starting up or overloaded`);
            await new Promise((resolve) => setTimeout(resolve, waitTime));
            continue;
          }

          // For other errors or last attempt, return error
          const errorData = await response.json().catch(() => ({}));
          const errorMessage =
            errorData?.message ||
            errorData?.error ||
            `Failed to fetch orders: ${response.statusText}`;

          if (process.env.NODE_ENV === "development") {
            console.error("[ORDERS_PROXY_ERROR]", {
              status: response.status,
              statusText: response.statusText,
              error: errorData,
              url,
              attempt: attempts + 1,
            });
          }

          return NextResponse.json(
            {
              success: false,
              message: errorMessage,
            },
            { status: response.status }
          );
        } catch (fetchError: any) {
          lastError = fetchError;
          attempts++;

          console.error(`[ORDERS_PROXY] Fetch error (attempt ${attempts}/${maxAttempts}):`, {
            name: fetchError?.name,
            message: fetchError?.message,
            cause: fetchError?.cause,
            url: baseUrl,
          });

          // Retry on network errors if not last attempt
          if (
            attempts < maxAttempts &&
            (fetchError?.name === "AbortError" ||
              fetchError?.message?.includes("ECONNREFUSED") ||
              fetchError?.message?.includes("fetch failed") ||
              fetchError?.message?.includes("network") ||
              fetchError?.code === "ECONNREFUSED")
          ) {
            const waitTime = 2000 * attempts;
            console.warn(`[ORDERS_PROXY] Network error detected. Retrying after ${waitTime}ms (attempt ${attempts}/${maxAttempts})...`);
            console.warn(`[ORDERS_PROXY] Error details:`, {
              name: fetchError?.name,
              message: fetchError?.message,
              targetUrl: baseUrl,
            });
            await new Promise((resolve) => setTimeout(resolve, waitTime));
            continue;
          }

          // Last attempt or non-retryable error
          break;
        }
      }

      // All retries failed - handle error
      if (lastError) {
        console.error("[ORDERS_PROXY_ERROR] All retries failed:", {
          error: lastError,
          message: lastError?.message,
          name: lastError?.name,
          cause: lastError?.cause,
          code: lastError?.code,
          url: baseUrl,
          attempts,
          fullUrl: url.substring(0, 150),
        });

        // Handle different error types
        let errorMessage = `Không thể kết nối đến admin server tại ${baseUrl}.`;
        let debugInfo: any = {
          apiUrl: baseUrl,
          attempts,
          errorName: lastError?.name,
          errorMessage: lastError?.message,
        };

        if (
          lastError?.name === "AbortError" ||
          lastError?.name === "TimeoutError"
        ) {
          errorMessage = `Admin server tại ${baseUrl} không phản hồi (timeout sau ${attempts} lần thử). Vui lòng kiểm tra xem admin server có đang chạy không.`;
          debugInfo.suggestion = "Kiểm tra xem admin server có đang chạy và có thể truy cập được không";
        } else if (
          lastError?.message?.includes("ECONNREFUSED") ||
          lastError?.code === "ECONNREFUSED"
        ) {
          errorMessage = `Không thể kết nối đến admin server tại ${baseUrl}. Vui lòng đảm bảo admin server đang chạy và NEXT_PUBLIC_API_URL được cấu hình đúng.`;
          debugInfo.suggestion = "Kiểm tra: 1) Admin server có đang chạy? 2) NEXT_PUBLIC_API_URL có đúng không? 3) Port có đúng không?";
        } else if (
          lastError?.message?.includes("fetch failed") ||
          lastError?.message?.includes("network")
        ) {
          errorMessage = `Không thể kết nối đến admin server tại ${baseUrl}. Vui lòng kiểm tra kết nối mạng và đảm bảo admin server đang chạy.`;
          debugInfo.suggestion = "Kiểm tra kết nối mạng và firewall settings";
        } else if (lastError?.message) {
          errorMessage = `${errorMessage} Chi tiết: ${lastError.message}`;
        }

        // Add troubleshooting info
        debugInfo.troubleshooting = [
          `1. Kiểm tra admin server có đang chạy tại: ${baseUrl}`,
          `2. Kiểm tra NEXT_PUBLIC_API_URL trong .env.local: ${apiUrl}`,
          `3. Thử truy cập trực tiếp: ${baseUrl}/api/orders/user?clerkUserId=test`,
          `4. Kiểm tra console logs của admin server`,
          `5. Kiểm tra CORS settings trên admin server`,
        ];

        return NextResponse.json(
          {
            success: false,
            message: errorMessage,
            error: lastError?.name || "FetchError",
            debug: process.env.NODE_ENV === "development" ? debugInfo : undefined,
          },
          { status: 503 }
        );
      }
    } catch (fetchError: any) {
      if (process.env.NODE_ENV === "development") {
        console.error("[ORDERS_PROXY_ERROR]", {
          error: fetchError,
          message: fetchError?.message,
          name: fetchError?.name,
          cause: fetchError?.cause,
          url,
        });
      }

      // Handle different error types
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";
      let errorMessage = `Không thể kết nối đến admin server tại ${apiUrl}. Vui lòng đảm bảo admin server đang chạy.`;

      if (
        fetchError?.name === "AbortError" ||
        fetchError?.name === "TimeoutError"
      ) {
        errorMessage = `Admin server tại ${apiUrl} không phản hồi (timeout). Vui lòng kiểm tra xem admin server có đang chạy không.`;
      } else if (fetchError?.message?.includes("ECONNREFUSED")) {
        errorMessage = `Không thể kết nối đến admin server tại ${apiUrl}. Vui lòng đảm bảo admin server đang chạy và NEXT_PUBLIC_API_URL được cấu hình đúng.`;
      } else if (fetchError?.message?.includes("fetch failed")) {
        errorMessage = `Không thể kết nối đến admin server tại ${apiUrl}. Vui lòng kiểm tra kết nối mạng và đảm bảo admin server đang chạy.`;
      } else if (fetchError?.message) {
        errorMessage = `${errorMessage} Chi tiết: ${fetchError.message}`;
      }

      return NextResponse.json(
        {
          success: false,
          message: errorMessage,
          error: fetchError?.name || "FetchError",
        },
        { status: 503 }
      );
    }
  } catch (error: any) {
    console.error("[ORDERS_PROXY_ERROR]", {
      error,
      message: error?.message,
      name: error?.name,
      stack: error?.stack,
    });
    return NextResponse.json(
      {
        success: false,
        message: error?.message || "Internal Server Error",
        error: error?.name || "UnknownError",
      },
      { status: 500 }
    );
  }
}
