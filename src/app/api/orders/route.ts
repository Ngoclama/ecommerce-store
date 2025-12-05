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
    if (!apiUrl) {
      return NextResponse.json(
        { success: false, message: "API URL not configured" },
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

    try {
      // Forward cookies in case admin server needs them, but also pass userId explicitly
      const cookieHeader = req.headers.get("cookie") || "";

      if (process.env.NODE_ENV === "development") {
        console.log("[ORDERS_PROXY] Fetching from:", url);
      }

      // Create abort controller for timeout
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 30000); // 30 second timeout (tăng lên vì admin server có thể chậm)

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

      if (!response.ok) {
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
          });
        }

        return NextResponse.json(
          {
            success: false,
            message: errorMessage,
          },
          { status: response.status }
        );
      }

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
