export type UserRole = "ADMIN" | "VENDOR" | "CUSTOMER";

/**
 * Lấy role của user từ Admin API (Client-side)
 * Sử dụng trong Client Components
 */
export async function getCurrentUserRoleClient(): Promise<UserRole | null> {
  try {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL;
    if (!apiUrl) return null;

    // Gọi API để lấy user role (cookies sẽ tự động được gửi)
    const response = await fetch(`${apiUrl}/api/user/role`, {
      credentials: "include", // Gửi cookies
    });

    if (!response.ok) return null;

    const data = await response.json();
    return data.role || null;
  } catch (error) {
    console.error("[PERMISSIONS] Error getting user role:", error);
    return null;
  }
}

/**
 * Kiểm tra user có role ADMIN không (Client-side)
 */
export async function isAdminClient(): Promise<boolean> {
  const role = await getCurrentUserRoleClient();
  return role === "ADMIN";
}

/**
 * Kiểm tra user có role CUSTOMER không (Client-side)
 */
export async function isCustomerClient(): Promise<boolean> {
  const role = await getCurrentUserRoleClient();
  return role === "CUSTOMER";
}
