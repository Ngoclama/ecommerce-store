import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";

// Routes cần authentication (chỉ một số routes, không phải tất cả như admin)
const isProtectedRoute = createRouteMatcher([
  "/checkout(.*)",
  "/account(.*)",
  "/wishlist(.*)",
]);

export default clerkMiddleware(async (auth, req) => {
  // Chỉ protect các routes được định nghĩa
  if (isProtectedRoute(req)) {
    await auth.protect();
  }
  
  // Note: Role checking sẽ được thực hiện ở layout/component level
  // để tránh blocking trong middleware (có thể gây infinite loop)
});

export const config = {
  matcher: [
    // Skip Next.js internals, static files, và public assets
    "/((?!_next|_static|_vercel|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest|json)).*)",
    // Only run for API routes that need auth
    "/(api|trpc)(.*)",
  ],
};

