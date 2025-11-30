import MainHeader from "@/components/main-header";
import CategorySidebarLeft from "@/components/category-sidebar-left";
import { SidebarContentWrapper } from "@/components/sidebar-content-wrapper";
import getCategories from "@/actions/get-categories";
import getBillboards from "@/actions/get-billboards";
import "./globals.css";

import type { Metadata } from "next";
import { Montserrat_Alternates, Be_Vietnam_Pro } from "next/font/google";
import Footer from "@/components/footer";
import { SettingsButton } from "@/components/settings-button";
import LogoCloud from "@/components/logo-cloud";
import { Toaster } from "@/components/ui/sonner";
import { ClerkProvider } from "@clerk/nextjs";
import { CartAnimationProvider } from "@/contexts/cart-animation-context";
import { ThemeProvider } from "@/contexts/theme-provider";

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
  title: "BL STUDIO | LUXURY FASHION STORE",
  description: "LUXURY FASHION STORE",
};

export const revalidate = 0;

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const categories = await getCategories();
  const billboards = await getBillboards();

  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${montserratAlternates.variable} ${beVietnamPro.variable}`}
      >
        <ClerkProvider signInUrl="/sign-in" signUpUrl="/sign-up">
          <ThemeProvider>
            <CartAnimationProvider>
              <MainHeader
                categories={categories || []}
                billboards={billboards || []}
              />
              <CategorySidebarLeft categories={categories || []} />
              <SidebarContentWrapper>
                <Toaster richColors position="bottom-center" />
                <main>{children}</main>
                <SettingsButton />
                <LogoCloud />
                <Footer />
              </SidebarContentWrapper>
            </CartAnimationProvider>
          </ThemeProvider>
        </ClerkProvider>
      </body>
    </html>
  );
}
