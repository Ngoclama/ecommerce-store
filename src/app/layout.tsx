import Navbar from "@/components/navbar";
import "./globals.css";
import type { Metadata } from "next";
import { Urbanist } from "next/font/google";
import Footer from "@/components/footer";

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
    <html lang="en">
      <body className={urban.className}>
        <Navbar />
        {children}
        <Footer />
      </body>
    </html>
  );
}
