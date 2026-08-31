import type { Metadata } from "next";
import "../globals.css";
import { GeistSans } from "geist/font/sans";
import { NavBar } from "@/components/navbar";
import { cn } from "@/lib/utils";
import { Footer } from "@/components/footer";

export const metadata: Metadata = {
  title: "VFitly",
  description:
    "VFitly, short for Virtual Fitly, is an AI virtual try-on platform that helps users preview outfits, manage wardrobe items, and create realistic fashion visuals before buying or sharing a look.",
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
