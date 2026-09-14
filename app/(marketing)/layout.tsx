import type { Metadata } from "next";
import "../globals.css";
import { GeistSans } from "geist/font/sans";
import { NavBar } from "@/components/navbar";
import { cn } from "@/lib/utils";
import { Footer } from "@/components/footer";

export const metadata: Metadata = {
  keywords: ["AI virtual try-on"],
  title: "VFitly",
  description:
    "Use VFitly AI virtual try-on to preview clothes from your photos, generate outfit images and try-on videos, and organize garments in a virtual wardrobe.",
  openGraph: {
    images: ["https://www.vfitly.com/banner.png"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <main>
      <NavBar />
      {children}
      <Footer />
    </main>
  );
}
