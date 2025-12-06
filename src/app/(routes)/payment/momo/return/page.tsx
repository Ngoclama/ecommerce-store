"use client";

import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Container from "@/components/ui/container";
import { Loader2 } from "lucide-react";

/**
 * MoMo Return URL Handler
 * MoMo redirects here after payment with resultCode in query params
 * This page checks the resultCode and redirects to success or failure page
 */
export default function MoMoReturnPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [status, setStatus] = useState<"processing" | "redirecting">("processing");

  useEffect(() => {
    const orderId = searchParams?.get("orderId");
    const resultCode = searchParams?.get("resultCode");
    const message = searchParams?.get("message");

    if (!orderId) {
      // No orderId, redirect to failure
      router.push("/payment/failure?reason=invalid");
      return;
    }

    // MoMo resultCode "0" means success
    if (resultCode === "0") {
      // Payment successful
      router.push(`/payment/success?orderId=${orderId}&method=momo`);
    } else {
      // Payment failed or cancelled
      // resultCode can be various values: user cancelled, payment failed, etc.
      const reason = resultCode === "1006" || message?.toLowerCase().includes("cancel") 
        ? "cancelled" 
        : "failed";
      router.push(`/payment/failure?orderId=${orderId}&method=momo&reason=${reason}`);
    }

    setStatus("redirecting");
  }, [searchParams, router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-neutral-50 via-white to-neutral-50 dark:from-neutral-950 dark:via-gray-900 dark:to-neutral-950">
      <Container>
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-neutral-600 dark:text-neutral-400" />
          <p className="text-sm text-neutral-600 dark:text-neutral-400">
            Đang xử lý kết quả thanh toán...
          </p>
        </div>
      </Container>
    </div>
  );
}

