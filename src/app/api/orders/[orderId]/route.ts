import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ orderId: string }> }
) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json(
        { success: false, message: "Unauthenticated" },
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
    // Fetch order detail với userId để verify ownership
    const url = `${baseUrl}/api/orders/user/${orderId}?clerkUserId=${encodeURIComponent(userId)}`;

    try {
      const response = await fetch(url, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        cache: "no-store",
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        const errorMessage = errorData?.message || `HTTP ${response.status}: ${response.statusText}`;
        
        return NextResponse.json(
          {
            success: false,
            message: errorMessage,
          },
          { status: response.status }
        );
      }

      const order = await response.json();
      return NextResponse.json(order);
    } catch (fetchError: any) {
      console.error("[ORDER_DETAIL_PROXY_ERROR]", {
        error: fetchError,
        message: fetchError?.message,
        orderId,
      });

      return NextResponse.json(
        {
          success: false,
          message: "Failed to fetch order details",
        },
        { status: 500 }
      );
    }
  } catch (error: any) {
    console.error("[ORDER_DETAIL_API_ERROR]", {
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

