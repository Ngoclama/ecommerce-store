import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const code = searchParams.get("code");

    if (!code) {
      return NextResponse.json(
        { success: false, message: "Coupon code is required" },
        { status: 400 }
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
    const url = `${baseUrl}/api/coupons?code=${encodeURIComponent(
      code.trim().toUpperCase()
    )}`;

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
        // Đảm bảo message được truyền đúng từ admin API
        const errorMessage =
          errorData?.message || errorData?.error || "Coupon not found";
        return NextResponse.json(
          { success: false, message: errorMessage },
          { status: response.status }
        );
      }

      const data = await response.json();
      return NextResponse.json(data);
    } catch (fetchError: any) {
      if (process.env.NODE_ENV === "development") {
        console.error("[COUPON_PROXY_ERROR]", fetchError);
      }
      return NextResponse.json(
        {
          success: false,
          message:
            "Cannot connect to admin server. Please ensure admin server is running on port 3000.",
        },
        { status: 503 }
      );
    }
  } catch (error) {
    if (process.env.NODE_ENV === "development") {
      console.error("[COUPON_PROXY_ERROR]", error);
    }
    return NextResponse.json(
      { success: false, message: "Internal Server Error" },
      { status: 500 }
    );
  }
}
