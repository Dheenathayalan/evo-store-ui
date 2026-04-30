import type { Metadata } from "next";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Open_Sans } from "next/font/google";
import CartDrawer from "@/components/CartDrawer";
import ToastContainer from "@/components/ToastContainer";
import Script from "next/script";

const openSans = Open_Sans({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-open-sans",
});

export const metadata: Metadata = {
  title: "EVO Carlton Trends",
  description: "Premium streetwear collection",
  icons: {
    icon: "/icons/logo_icon.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={openSans.variable} suppressHydrationWarning>
      <body className="bg-white text-black">
        <Header />
        {children}
        <Footer />
        <CartDrawer />
        <ToastContainer />

      </body>
    </html>
  );
}
