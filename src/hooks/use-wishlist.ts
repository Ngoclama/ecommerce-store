"use client";

import { useAuth } from "@clerk/nextjs";
import { useCallback } from "react";
import { toast } from "sonner";
import axios from "axios";

// Cấu hình axios để gửi credentials
axios.defaults.withCredentials = true;

export const useWishlist = () => {
  const { getToken, isSignedIn } = useAuth();

  const toggleWishlist = useCallback(
    async (productId: string) => {
      // Kiểm tra authentication
      if (!isSignedIn) {
        toast.error("Vui lòng đăng nhập để thêm vào danh sách yêu thích.");
        return;
      }

      try {
        // Lấy token từ Clerk
        const token = await getToken();

        const apiUrl = process.env.NEXT_PUBLIC_API_URL;
        if (!apiUrl) {
          toast.error("API URL chưa được cấu hình. Vui lòng liên hệ admin.");
          return;
        }

        // Ensure API URL doesn't have trailing slash
        const baseUrl = apiUrl.replace(/\/$/, "");
        const url = `${baseUrl}/api/wishlist`;

        // Gọi API với token trong header và cookies
        const response = await axios.post(
          url,
          {
            productId: productId,
            action: "toggle", // Hoặc có thể check trước
          },
          {
            withCredentials: true, // Gửi cookies
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );

        if (
          response.data &&
          typeof response.data === "object" &&
          "success" in response.data &&
          response.data.success
        ) {
          const isLiked =
            "isLiked" in response.data ? response.data.isLiked : false;
          toast.success(
            isLiked
              ? "Đã thêm vào danh sách yêu thích!"
              : "Đã xóa khỏi danh sách yêu thích."
          );
          return isLiked as boolean;
        }
      } catch (error: any) {
        console.error("[WISHLIST_TOGGLE_ERROR]", error);

        if (error.response?.status === 401) {
          toast.error("Vui lòng đăng nhập để thêm vào danh sách yêu thích.");
        } else {
          toast.error(
            "Không thể cập nhật danh sách yêu thích. Vui lòng thử lại."
          );
        }
        throw error;
      }
    },
    [getToken, isSignedIn]
  );

  const isItemInWishlist = useCallback(
    async (productId: string): Promise<boolean> => {
      if (!isSignedIn) return false;

      try {
        const token = await getToken();

        // Nếu không có token, không thể xác thực
        if (!token) {
          console.warn("[WISHLIST_CHECK] No token available");
          return false;
        }

        const apiUrl = process.env.NEXT_PUBLIC_API_URL;
        if (!apiUrl) {
          console.error(
            "[WISHLIST_CHECK] NEXT_PUBLIC_API_URL is not configured"
          );
          return false;
        }

        // Ensure API URL doesn't have trailing slash
        const baseUrl = apiUrl.replace(/\/$/, "");
        const url = `${baseUrl}/api/wishlist`;

        const response = await axios.get(url, {
          withCredentials: true, // Gửi cookies để Clerk auth() có thể đọc
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });

        if (
          response.data &&
          typeof response.data === "object" &&
          "success" in response.data &&
          response.data.success &&
          "data" in response.data &&
          Array.isArray(response.data.data)
        ) {
          return response.data.data.includes(productId) || false;
        }
        return false;
      } catch (error: any) {
        // Nếu 401, có thể user chưa đăng nhập hoặc session expired
        if (error.response?.status === 401) {
          if (process.env.NODE_ENV === "development") {
            console.warn(
              "[WISHLIST_CHECK] Unauthorized - user may not be signed in or session expired"
            );
          }
          return false;
        }
        console.error("[WISHLIST_CHECK_ERROR]", error);
        return false;
      }
    },
    [getToken, isSignedIn]
  );

  const getAllWishlistItems = useCallback(async (): Promise<string[]> => {
    if (!isSignedIn) return [];

    const apiUrl = process.env.NEXT_PUBLIC_API_URL;
    let url = "";

    try {
      const token = await getToken();

      // Nếu không có token, không thể xác thực
      if (!token) {
        console.warn("[WISHLIST_GET_ALL] No token available");
        return [];
      }

      if (!apiUrl) {
        console.error(
          "[WISHLIST_GET_ALL] NEXT_PUBLIC_API_URL is not configured"
        );
        return [];
      }

      // Ensure API URL doesn't have trailing slash
      const baseUrl = apiUrl.replace(/\/$/, "");
      url = `${baseUrl}/api/wishlist`;

      if (process.env.NODE_ENV === "development") {
        console.log("[WISHLIST_GET_ALL] Fetching from:", url);
      }

      const response = await axios.get(url, {
        withCredentials: true, // Gửi cookies để Clerk auth() có thể đọc
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (
        response.data &&
        typeof response.data === "object" &&
        "success" in response.data &&
        response.data.success &&
        "data" in response.data &&
        Array.isArray(response.data.data)
      ) {
        return response.data.data;
      }
      return [];
    } catch (error: any) {
      // Nếu 401, có thể user chưa đăng nhập hoặc session expired
      if (error.response?.status === 401) {
        if (process.env.NODE_ENV === "development") {
          console.warn(
            "[WISHLIST_GET_ALL] Unauthorized - user may not be signed in or session expired"
          );
        }
        return [];
      }
      // Nếu 404, có thể API URL không đúng hoặc route không tồn tại
      if (error.response?.status === 404) {
        console.error("[WISHLIST_GET_ALL] 404 Not Found");
        console.error(
          "[WISHLIST_GET_ALL] API URL:",
          apiUrl || "NOT CONFIGURED"
        );
        console.error("[WISHLIST_GET_ALL] Full URL:", url || "NOT CONFIGURED");
        console.error(
          "[WISHLIST_GET_ALL] Check if admin server is running and route exists"
        );
        return [];
      }
      console.error("[WISHLIST_GET_ALL_ERROR]", error);
      if (process.env.NODE_ENV === "development") {
        console.error(
          "[WISHLIST_GET_ALL] Error response:",
          error.response?.data
        );
        console.error(
          "[WISHLIST_GET_ALL] API URL:",
          apiUrl || "NOT CONFIGURED"
        );
      }
      return [];
    }
  }, [getToken, isSignedIn]);

  return {
    toggleWishlist,
    isItemInWishlist,
    getAllWishlistItems,
    isSignedIn,
  };
};
