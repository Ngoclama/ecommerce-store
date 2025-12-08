import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // ===== Performance & Production =====
  compress: true,
  poweredByHeader: false,
  productionBrowserSourceMaps: false, // Disable source maps in production
  typedRoutes: false, // Disable typed routes to fix catch-all route errors

  images: {
    formats: ["image/avif", "image/webp"],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    minimumCacheTTL: 3600, // Cache images for 1 hour
    remotePatterns: [
      { protocol: "https", hostname: "utfs.io" },
      { protocol: "https", hostname: "**.ufs.sh" },
      { protocol: "https", hostname: "res.cloudinary.com" },
      { protocol: "https", hostname: "placehold.co" },
      { protocol: "https", hostname: "cdn.pixabay.com" },
      { protocol: "https", hostname: "images.unsplash.com" },
      { protocol: "https", hostname: "uploadthing.com" },
      { protocol: "https", hostname: "img.clerk.com" },
      { protocol: "https", hostname: "images.clerk.dev" },
      { protocol: "https", hostname: "**.googleusercontent.com" },
      { protocol: "https", hostname: "file.hstatic.net" },
      { protocol: "https", hostname: "**.hstatic.net" },
      { protocol: "https", hostname: "sakurafashion.vn" },
      { protocol: "http", hostname: "sakurafashion.vn" },
    ],
  },

  experimental: {
    optimizePackageImports: [
      "@radix-ui/react-dropdown-menu",
      "@radix-ui/react-dialog",
      "@radix-ui/react-select",
      "@radix-ui/react-tabs",
      "lucide-react",
      "date-fns",
    ],
  },

  // ===== Turbopack Configuration =====
  turbopack: {
    root: "../",
  },
};

export default nextConfig;
