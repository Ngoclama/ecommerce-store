"use client";

import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Container from "@/components/ui/container";
import { Loader2 } from "lucide-react";

/**
 * VNPay Return URL Handler
 * VNPay redirects here after payment with responseCode in query params
 * This page checks the responseCode and redirects to success or failure page
 */
export default function VNPayReturnPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [status, setStatus] = useState<"processing" | "redirecting">(
    "processing"
  );

  useEffect(() => {
    const orderId = searchParams?.get("orderId");
    const responseCode = searchParams?.get("vnp_ResponseCode");
    const transactionNo = searchParams?.get("vnp_TransactionNo");

    if (!orderId) {
      // No orderId, redirect to failure
      router.push("/payment/failure?reason=invalid");
      return;
    }

    // VNPay responseCode "00" means success
    if (responseCode === "00" && transactionNo) {
      // Payment successful
      router.push(`/payment/success?orderId=${orderId}&method=vnpay`);
    } else {
      // Payment failed or cancelled
      const reason = responseCode ? "failed" : "cancelled";
      router.push(
        `/payment/failure?orderId=${orderId}&method=vnpay&reason=${reason}`
      );
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
