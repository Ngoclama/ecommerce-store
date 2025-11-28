import Navbar from "@/components/navbar";
import "./globals.css";

import type { Metadata } from "next";
import { Montserrat_Alternates, Be_Vietnam_Pro } from "next/font/google";
import Footer from "@/components/footer";
import FloatingButtons from "@/components/floating-buttons";
import { Toaster } from "@/components/ui/sonner";
import { ClerkProvider } from "@clerk/nextjs";
import { CartAnimationProvider } from "@/contexts/cart-animation-context";

const montserratAlternates = Montserrat_Alternates({
  subsets: ["latin"],
  weight: ["600"],
  variable: "--font-montserrat-alternates",
});

const beVietnamPro = Be_Vietnam_Pro({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-be-vietnam-pro",
});

export const metadata: Metadata = {
  title: "Store",
  description: "Store",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${montserratAlternates.variable} ${beVietnamPro.variable}`}
      >
        <ClerkProvider signInUrl="/sign-in" signUpUrl="/sign-up">
          <CartAnimationProvider>
            <Navbar />
            <Toaster richColors position="bottom-center" />
            {children}
            <FloatingButtons />
            <Footer />
          </CartAnimationProvider>
        </ClerkProvider>
      </body>
    </html>
  );
}
