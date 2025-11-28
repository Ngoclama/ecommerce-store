"use client";

import { useAuth as useClerkAuth, useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

const useAuth = () => {
  const { isSignedIn, userId } = useClerkAuth();
  const { user } = useUser();
  const router = useRouter();

  const requireAuth = (action: string = "thực hiện hành động này"): boolean => {
    if (!isSignedIn) {
      toast.error(`Vui lòng đăng nhập để ${action}`);
      const currentPath = window.location.pathname;
      router.push(`/sign-in?redirect_url=${encodeURIComponent(currentPath)}`);
      return false;
    }
    return true;
  };

  return {
    isAuthenticated: isSignedIn,
    userId: userId || null,
    user: user,
    requireAuth,
  };
};

export default useAuth;
