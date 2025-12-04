import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    

    remotePatterns: [
      {
        protocol: "https",
        hostname: "utfs.io", // UploadThing cũ
      },
      {
        protocol: "https",
        hostname: "**.ufs.sh",
      },
      {
        protocol: "https",
        hostname: "res.cloudinary.com", // Cloudinary
      },
      {
        protocol: "https",
        hostname: "placehold.co", // Placeholder
      },
      {
        protocol: "https",
        hostname: "cdn.pixabay.com", // Ảnh tĩnh/từ bên ngoài
      },
      {
        protocol: "https",
        hostname: "images.unsplash.com", // Ảnh tĩnh/từ bên ngoài
      },
      {
        protocol: "https",
        hostname: "uploadthing.com", // Trang web chính
      },
      {
        protocol: "https",
        hostname: "img.clerk.com", // Clerk images
      },
      {
        protocol: "https",
        hostname: "images.clerk.dev", // Clerk images (alternative)
      },
      {
        protocol: "https",
        hostname: "www.google.com", // Google Images
      },
      {
        protocol: "https",
        hostname: "**.google.com", // Google subdomains
      },
      {
        protocol: "https",
        hostname: "**.googleusercontent.com", // Google user content
      },
      {
        protocol: "https",
        hostname: "**.bom.edu.vn", // Domain từ lỗi
      },
      {
        protocol: "https",
        hostname: "**", // Cho phép tất cả domain (cẩn thận với security)
      },
    ],
  },
};

export default nextConfig;
