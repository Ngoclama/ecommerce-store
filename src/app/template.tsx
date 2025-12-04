"use client";

import { PageTransition } from "@/components/page-transition";
import { PageLoadingOverlay } from "@/components/page-loading-overlay";

export default function Template({ children }: { children: React.ReactNode }) {
  return (
    <>
      <PageLoadingOverlay />
      <PageTransition>{children}</PageTransition>
    </>
  );
}
