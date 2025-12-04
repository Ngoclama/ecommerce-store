"use client";

import { UserProfile } from "@clerk/nextjs";
import Container from "@/components/ui/container";
import { useAuth } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function ProfileDetailsPage() {
  const { isSignedIn, isLoaded } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (isLoaded && !isSignedIn) {
      router.push("/sign-in");
    }
  }, [isLoaded, isSignedIn, router]);

  if (!isLoaded) {
    return (
      <div className="bg-white dark:bg-gray-900 min-h-screen py-12">
        <Container>
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-center h-64">
              <p className="text-gray-500 dark:text-gray-400 font-light">
                Đang tải...
              </p>
            </div>
          </div>
        </Container>
      </div>
    );
  }

  if (!isSignedIn) {
    return null;
  }

  return (
    <div className="bg-white dark:bg-gray-900 min-h-screen py-12">
      <Container>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-12">
            <h1 className="text-4xl md:text-5xl font-light text-black dark:text-white mb-2 uppercase tracking-wider">
              Chi tiết hồ sơ
            </h1>
            <p className="text-gray-600 dark:text-gray-400 font-light">
              Quản lý thông tin tài khoản của bạn
            </p>
          </div>

          <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-none">
            <UserProfile
              appearance={{
                elements: {
                  rootBox: "w-full",
                  card: "shadow-none border-0 rounded-none bg-white dark:bg-gray-900",
                  navbar: "border-b border-gray-200 dark:border-gray-800",
                  navbarButton:
                    "text-black dark:text-white hover:text-gray-600 dark:hover:text-gray-400 font-light uppercase tracking-wide",
                  navbarButtonText:
                    "text-black dark:text-white font-light uppercase tracking-wide",
                  page: "bg-white dark:bg-gray-900",
                  pageHeaderTitle:
                    "text-black dark:text-white font-light uppercase tracking-wide",
                  pageHeaderSubtitle:
                    "text-gray-600 dark:text-gray-400 font-light",
                  formButtonPrimary:
                    "bg-gray-400 dark:bg-gray-500 text-white hover:bg-gray-900 dark:hover:bg-gray-900 hover:shadow-lg hover:shadow-gray-400/30 rounded-none uppercase tracking-wide font-light transition-all duration-300 ease-in-out hover:scale-[1.01] active:scale-[0.99]",
                  formButtonReset:
                    "text-black dark:text-white hover:text-gray-600 dark:hover:text-gray-400 font-light",
                  formFieldLabel: "text-black dark:text-white font-light",
                  formFieldInput:
                    "border-gray-300 dark:border-gray-700 rounded-none focus:border-black dark:focus:border-white bg-white dark:bg-gray-900 text-black dark:text-white",
                  formFieldErrorText: "text-red-600 dark:text-red-400",
                  formFieldSuccessText: "text-green-600 dark:text-green-400",
                  badge:
                    "bg-gray-100 dark:bg-gray-800 text-black dark:text-white",
                  avatarBox: "border-gray-300 dark:border-gray-700",
                  avatarImage: "rounded-none",
                  identityPreview: "border-gray-300 dark:border-gray-700",
                  identityPreviewText: "text-black dark:text-white",
                  identityPreviewEditButton:
                    "text-black dark:text-white hover:text-gray-600 dark:hover:text-gray-400",
                  accordionTriggerButton:
                    "text-black dark:text-white hover:bg-gray-50 dark:hover:bg-gray-800",
                  accordionContent: "text-gray-600 dark:text-gray-400",
                  tableHead:
                    "text-black dark:text-white font-light uppercase tracking-wide",
                  tableBody: "text-gray-600 dark:text-gray-400",
                  tableRow: "border-gray-200 dark:border-gray-800",
                  tableCell: "text-black dark:text-white",
                  dividerLine: "bg-gray-200 dark:bg-gray-800",
                  dividerText: "text-gray-500 dark:text-gray-500",
                  alertText: "text-gray-600 dark:text-gray-400",
                  alertTextDanger: "text-red-600 dark:text-red-400",
                  alertTextSuccess: "text-green-600 dark:text-green-400",
                  modalContent:
                    "bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-800 rounded-none",
                  modalContentTitle:
                    "text-black dark:text-white font-light uppercase tracking-wide",
                  modalContentDescription:
                    "text-gray-600 dark:text-gray-400 font-light",
                  modalCloseButton:
                    "text-black dark:text-white hover:text-gray-600 dark:hover:text-gray-400",
                  selectButton:
                    "border-gray-300 dark:border-gray-700 text-black dark:text-white rounded-none bg-white dark:bg-gray-900",
                  selectPopover:
                    "bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-800",
                  selectOption:
                    "text-black dark:text-white hover:bg-gray-50 dark:hover:bg-gray-800",
                  selectOptionActive: "bg-gray-100 dark:bg-gray-800",
                  otpCodeFieldInput:
                    "border-gray-300 dark:border-gray-700 rounded-none focus:border-black dark:focus:border-white bg-white dark:bg-gray-900 text-black dark:text-white",
                  otpCodeFieldInputError: "border-red-600 dark:border-red-400",
                  otpCodeFieldInputSuccess:
                    "border-green-600 dark:border-green-400",
                  headerTitle:
                    "text-black dark:text-white font-light uppercase tracking-wide",
                  headerSubtitle: "text-gray-600 dark:text-gray-400 font-light",
                  socialButtonsBlockButton:
                    "border-gray-300 dark:border-gray-700 text-black dark:text-white hover:bg-gray-50 dark:hover:bg-gray-800 rounded-none",
                  socialButtonsBlockButtonText:
                    "text-black dark:text-white font-light",
                  dividerRowText: "text-gray-500 dark:text-gray-500",
                  formResendCodeLink:
                    "text-black dark:text-white hover:text-gray-600 dark:hover:text-gray-400",
                  footerActionLink:
                    "text-black dark:text-white hover:text-gray-600 dark:hover:text-gray-400",
                  footerActionText: "text-gray-600 dark:text-gray-400",
                  profileSection: "border-gray-200 dark:border-gray-800",
                  profileSectionTitle:
                    "text-black dark:text-white font-light uppercase tracking-wide",
                  profileSectionContent: "text-gray-600 dark:text-gray-400",
                  profileSectionPrimaryButton:
                    "bg-gray-400 dark:bg-gray-500 text-white hover:bg-gray-900 dark:hover:bg-gray-900 hover:shadow-lg hover:shadow-gray-400/30 rounded-none uppercase tracking-wide font-light transition-all duration-300 ease-in-out hover:scale-[1.01] active:scale-[0.99]",
                  profileSectionDangerButton:
                    "bg-red-600 dark:bg-red-500 text-white hover:bg-red-700 dark:hover:bg-red-600 rounded-none uppercase tracking-wide font-light",
                },
                variables: {
                  colorPrimary: "#000000",
                  colorDanger: "#dc2626",
                  colorSuccess: "#16a34a",
                  colorWarning: "#ca8a04",
                  colorText: "#000000",
                  colorTextSecondary: "#6b7280",
                  colorBackground: "#ffffff",
                  colorInputBackground: "#ffffff",
                  colorInputText: "#000000",
                  borderRadius: "0px",
                  fontFamily: "var(--font-be-vietnam-pro)",
                  fontSize: "14px",
                },
              }}
            />
          </div>
        </div>
      </Container>
    </div>
  );
}
