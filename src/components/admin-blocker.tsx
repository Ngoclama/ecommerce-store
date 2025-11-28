"use client";

import { useAuth } from "@clerk/nextjs";
import { useEffect, useState } from "react";
import { isAdminClient } from "@/lib/permissions";

/**
 * Component để chặn ADMIN users truy cập Store
 * Sử dụng trong layout hoặc pages cần block ADMIN
 */
export function AdminBlocker({ children }: { children: React.ReactNode }) {
  const { isSignedIn } = useAuth();
  const [isChecking, setIsChecking] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    async function checkRole() {
      if (!isSignedIn) {
        setIsChecking(false);
        return;
      }

      try {
        const userIsAdmin = await isAdminClient();

        if (userIsAdmin) {
          setIsAdmin(true);
          // Redirect về Admin panel
          const apiUrl =
            process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";
          window.location.href = apiUrl;
        } else {
          setIsChecking(false);
        }
      } catch (error) {
        // Nếu có lỗi, cho phép tiếp tục (không block user)
        console.error("[ADMIN_BLOCKER] Error checking role:", error);
        setIsChecking(false);
      }
    }

    checkRole();
  }, [isSignedIn]);

  if (isChecking) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div>Loading...</div>
      </div>
    );
  }

  if (isAdmin) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div>Redirecting to Admin Panel...</div>
      </div>
    );
  }

  return <>{children}</>;
}
