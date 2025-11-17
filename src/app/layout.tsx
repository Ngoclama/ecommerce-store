import Navbar from "@/components/navbar";
import "./globals.css";
import type { Metadata } from "next";
import { Urbanist } from "next/font/google";
import Footer from "@/components/footer";
import { Toaster } from "@/components/ui/sonner";

const urban = Urbanist({ subsets: ["latin"] });

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
      <body className={urban.className}>
        <Navbar />
        <Toaster position="top-center" expand={false} richColors closeButton />
        {children}
        <Footer />
      </body>
    </html>
  );
}
