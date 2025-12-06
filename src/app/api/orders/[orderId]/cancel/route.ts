import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";

/**
 * POST /api/orders/[orderId]/cancel
 * Proxy to admin API for canceling an order
 * Handles authentication and forwards request to admin server
 */
export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ orderId: string }> }
) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json(
        { success: false, message: "Chưa xác thực" },
        { status: 401 }
      );
    }

    const { orderId } = await params;

    if (!orderId) {
      return NextResponse.json(
        { success: false, message: "Order ID is required" },
        { status: 400 }
      );
    }

    const apiUrl = process.env.NEXT_PUBLIC_API_URL;

    if (!apiUrl) {
      return NextResponse.json(
        {
          success: false,
          message: "API URL not configured",
        },
        { status: 500 }
      );
    }

    const baseUrl = apiUrl.replace(/\/$/, "");
    // Proxy to admin API with clerkUserId in query (fallback if cookies don't work)
    const url = `${baseUrl}/api/orders/${orderId}/cancel?clerkUserId=${encodeURIComponent(
      userId
    )}`;

    try {
      // Forward cookies for authentication (may not work if different Clerk instances)
      const cookieHeader = req.headers.get("cookie") || "";

      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Cookie: cookieHeader,
        },
        credentials: "include",
        cache: "no-store",
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        const errorMessage =
          errorData?.message ||
          `HTTP ${response.status}: ${response.statusText}`;

        return NextResponse.json(
          {
            success: false,
            message: errorMessage,
          },
          { status: response.status }
        );
      }

      const data = await response.json();
      return NextResponse.json(data);
    } catch (fetchError: any) {
      console.error("[CANCEL_ORDER_PROXY_ERROR]", {
        error: fetchError,
        message: fetchError?.message,
        orderId,
      });

      return NextResponse.json(
        {
          success: false,
          message: "Failed to cancel order",
        },
        { status: 500 }
      );
    }
  } catch (error: any) {
    console.error("[CANCEL_ORDER_API_ERROR]", {
      error,
      message: error?.message,
    });

    return NextResponse.json(
      {
        success: false,
        message: error?.message || "Internal Server Error",
      },
      { status: 500 }
    );
  }
}

// Handle OPTIONS request for CORS preflight
export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
    },
  });
}
