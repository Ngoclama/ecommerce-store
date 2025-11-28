"use client";

import dynamic from "next/dynamic";
import { useAuth } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

// Dynamic import với ssr: false để tránh hydration mismatch
const SignUp = dynamic(
  () => import("@clerk/nextjs").then((mod) => mod.SignUp),
  {
    ssr: false,
    loading: () => (
      <div className="flex items-center justify-center min-h-screen bg-white px-4">
        <div className="mx-auto w-full max-w-md">Loading...</div>
      </div>
    ),
  }
);

export default function SignUpPage() {
  const { isSignedIn, isLoaded } = useAuth();
  const router = useRouter();

  useEffect(() => {
    // Chỉ redirect khi đã load xong và đã đăng nhập
    if (isLoaded && isSignedIn) {
      router.replace("/");
    }
  }, [isSignedIn, isLoaded]); // Loại bỏ router khỏi dependency

  // Không render SignUp nếu đã đăng nhập (tránh warning)
  if (isLoaded && isSignedIn) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-white px-4">
        <div className="mx-auto w-full max-w-md">Redirecting...</div>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-white px-4">
      <SignUp
        appearance={{
          elements: {
            rootBox: "mx-auto w-full max-w-md",
            card: "rounded-none border border-gray-300 shadow-none bg-white",
            headerTitle:
              "text-black font-light uppercase tracking-wide text-2xl",
            headerSubtitle: "text-gray-600 font-light text-sm",
            socialButtonsBlockButton:
              "rounded-none border-gray-300 hover:border-black bg-white text-black font-light uppercase tracking-wide",
            formButtonPrimary:
              "rounded-none bg-black hover:bg-gray-800 text-white font-light uppercase tracking-wide",
            formFieldInput:
              "rounded-none border-gray-300 focus:border-black focus:ring-black bg-white",
            formFieldLabel:
              "text-black font-light uppercase tracking-wide text-xs",
            footerActionLink: "text-black hover:text-gray-600 font-light",
            identityPreviewEditButton: "text-black hover:text-gray-600",
            formResendCodeLink: "text-black hover:text-gray-600",
            navbar: "hidden",
            navbarButton: "hidden",
            navbarButtons: "hidden",
          },
          variables: {
            colorPrimary: "#000000",
            colorBackground: "#FFFFFF",
            colorText: "#000000",
            colorInputBackground: "#FFFFFF",
            colorInputText: "#000000",
            colorTextSecondary: "#6B7280",
          },
        }}
        routing="path"
        path="/sign-up"
        signInUrl="/sign-in"
        fallbackRedirectUrl="/"
      />
    </div>
  );
}
