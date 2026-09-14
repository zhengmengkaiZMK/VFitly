import type { Metadata } from "next";
import { JsonLd } from "@/components/seo/json-ld";
import { WardrobeContent } from "@/components/wardrobe/wardrobe-content";
import { absoluteUrl } from "@/lib/seo";

export const metadata: Metadata = {
  title: "Clothes Wardrobe Storage and Virtual Fitting Room",
  description:
    "Organize garment images in your VFitly virtual wardrobe. Find and reuse saved clothes for AI virtual try-on and create new outfit images and try-on videos.",
  keywords: [
    "AI virtual try-on","clothes wardrobe", "virtual fitting room", "clothes wardrobe storage", "wardrobe", "garment assets", "AI wardrobe"],
  alternates: {
    canonical: "/dashboard/wardrobe",
  },
  openGraph: {
    title: "Clothes Wardrobe Storage and Virtual Fitting Room | VFitly",
    description:
      "Organize garment images in your VFitly virtual wardrobe. Find and reuse saved clothes for AI virtual try-on and create new outfit images and try-on videos.",
  },
};

const wardrobeJsonLd = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: "VFitly Clothes Wardrobe",
  url: absoluteUrl("/dashboard/wardrobe"),
  applicationCategory: "LifestyleApplication",
  operatingSystem: "Web",
  description:
    "Store clothes wardrobe assets, organize garment images, and reuse them in VFitly's virtual fitting room.",
};

export default function DashboardWardrobePage() {
  return (
    <>
      <JsonLd data={wardrobeJsonLd} />
      <WardrobeContent />
    </>
  );
}
