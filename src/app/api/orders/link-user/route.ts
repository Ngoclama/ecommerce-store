import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";

/**
 * Proxy API để link orders với user
 * Forward request tới admin server
 */
export async function POST(req: NextRequest) {
  try {
    const { userId: clerkUserId } = await auth();

    if (!clerkUserId) {
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

    const baseUrl = apiUrl.replace(/\/$/, "");
    // Forward cookies để admin server có thể authenticate
    const cookieHeader = req.headers.get("cookie") || "";

    // Pass clerkUserId as query parameter (giống như /api/orders)
    // Vì cookies có thể không được forward đúng cách giữa 2 server
    const adminApiUrl = `${baseUrl}/api/orders/link-user?clerkUserId=${encodeURIComponent(
      clerkUserId
    )}`;

    if (process.env.NODE_ENV === "development") {
      console.log("[STORE_PROXY_LINK] Linking orders for user:", clerkUserId);
      console.log("[STORE_PROXY_LINK] Forwarding to:", adminApiUrl);
    }

    // Create abort controller for timeout
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 30000); // 30 second timeout (tăng lên vì có thể admin server chậm)

    // Forward request tới admin server với cookies
    const response = await fetch(adminApiUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Cookie: cookieHeader,
      },
      credentials: "include",
      cache: "no-store",
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    const data = await response.json().catch(() => ({
      success: false,
      message: "Failed to parse response",
    }));

    if (!response.ok) {
      if (process.env.NODE_ENV === "development") {
        console.error("[STORE_PROXY_LINK] Admin API error:", {
          status: response.status,
          data,
        });
      }
      return NextResponse.json(data, { status: response.status });
    }

    if (process.env.NODE_ENV === "development") {
      console.log("[STORE_PROXY_LINK] Successfully linked orders:", data);
    }
    return NextResponse.json(data);
  } catch (error: any) {
    if (process.env.NODE_ENV === "development") {
      console.error("[STORE_PROXY_LINK] Error linking orders:", error);
    }

    // Handle timeout
    if (error?.name === "AbortError") {
      console.warn(
        "[STORE_PROXY_LINK] Request timeout - admin server may be slow"
      );
      // Không trả về lỗi, chỉ log warning vì link orders không critical
      // Orders sẽ được link tự động khi query
      return NextResponse.json(
        {
          success: false,
          message:
            "Request timeout. Orders will be linked automatically when queried.",
          linkedCount: 0,
        },
        { status: 200 } // Trả về 200 để không làm gián đoạn flow
      );
    }

    return NextResponse.json(
      {
        success: false,
        message: error?.message || "Failed to link orders",
      },
      { status: 500 }
    );
  }
}
