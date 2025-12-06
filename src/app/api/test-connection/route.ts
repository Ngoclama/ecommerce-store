import { NextResponse } from "next/server";

/**
 * GET /api/test-connection
 * Test connection to admin server
 * Useful for debugging connection issues
 */
export async function GET() {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;
  
  const result = {
    timestamp: new Date().toISOString(),
    hasApiUrl: !!apiUrl,
    apiUrl: apiUrl || "NOT SET",
    nodeEnv: process.env.NODE_ENV,
    tests: [] as any[],
  };

  if (!apiUrl) {
    return NextResponse.json({
      ...result,
      error: "NEXT_PUBLIC_API_URL is not configured",
      suggestion: "Please add NEXT_PUBLIC_API_URL to your .env.local file",
    });
  }

  const baseUrl = apiUrl.replace(/\/$/, "");
  const testUrl = `${baseUrl}/api/billboards`;

  // Test 1: Basic connectivity
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 5000);
    
    const response = await fetch(testUrl, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    result.tests.push({
      name: "Basic Connectivity Test",
      url: testUrl,
      status: response.status,
      statusText: response.statusText,
      ok: response.ok,
      headers: Object.fromEntries(response.headers.entries()),
    });

    if (response.ok) {
      try {
        const data = await response.json();
        result.tests.push({
          name: "Data Response Test",
          success: true,
          dataType: Array.isArray(data) ? "array" : typeof data,
          dataLength: Array.isArray(data) ? data.length : "N/A",
        });
      } catch (e) {
        result.tests.push({
          name: "Data Response Test",
          success: false,
          error: "Failed to parse JSON response",
        });
      }
    }
  } catch (error: any) {
    result.tests.push({
      name: "Basic Connectivity Test",
      url: testUrl,
      success: false,
      error: {
        name: error?.name,
        message: error?.message,
        code: error?.code,
      },
    });
  }

  // Test 2: CORS
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 5000);
    
    const response = await fetch(testUrl, {
      method: "OPTIONS",
      headers: {
        "Origin": "http://localhost:3000",
        "Access-Control-Request-Method": "GET",
      },
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    result.tests.push({
      name: "CORS Test",
      url: testUrl,
      status: response.status,
      hasCorsHeaders: {
        "Access-Control-Allow-Origin": response.headers.get("Access-Control-Allow-Origin"),
        "Access-Control-Allow-Methods": response.headers.get("Access-Control-Allow-Methods"),
      },
    });
  } catch (error: any) {
    result.tests.push({
      name: "CORS Test",
      success: false,
      error: {
        name: error?.name,
        message: error?.message,
      },
    });
  }

  return NextResponse.json(result, {
    headers: {
      "Content-Type": "application/json",
    },
  });
}

