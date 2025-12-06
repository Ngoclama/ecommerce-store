import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

// Routes cần authentication
const isProtectedRoute = createRouteMatcher([
  "/account(.*)",
  "/checkout(.*)",
  "/wishlist(.*)",
  "/api/orders(.*)",
  "/api/wishlist(.*)",
]);

// Routes public API (không cần auth)
const isPublicApiRoute = createRouteMatcher([
  "/api/coupons(.*)",
  "/api/products(.*)",
  "/api/categories(.*)",
]);

// Routes có thể truy cập nhưng cần check ở component level
const isOptionalAuthRoute = createRouteMatcher(["/cart(.*)"]);

export default clerkMiddleware(async (auth, request) => {
  const { pathname } = request.nextUrl;

  // Cho phép public API routes - không cần auth
  if (isPublicApiRoute(request)) {
    return NextResponse.next();
  }

  // Routes optional auth - cho phép truy cập nhưng sẽ check ở component level
  if (isOptionalAuthRoute(request)) {
    return NextResponse.next();
  }

  // Kiểm tra protected routes
  if (isProtectedRoute(request)) {
    const { userId } = await auth();

    // Nếu là API route và không có userId, trả về 401
    if (pathname.startsWith("/api/") && !userId) {
      return NextResponse.json(
        { success: false, message: "Unauthenticated" },
        { status: 401 }
      );
    }

    // Nếu là page route và không có userId, redirect đến sign-in
    if (!pathname.startsWith("/api/") && !userId) {
      const signInUrl = new URL("/sign-in", request.url);
      signInUrl.searchParams.set("redirect_url", pathname);
      return NextResponse.redirect(signInUrl);
    }
  }

  // Cho phép tất cả các routes khác
  return NextResponse.next();
});

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     * - static files
     */
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico|css|js|woff|woff2|ttf|eot)$).*)",
    "/(api|trpc)(.*)",
    "/account(.*)",
    "/checkout(.*)",
    "/cart(.*)",
    "/wishlist(.*)",
    "/payment(.*)",
  ],
};

