import type { Metadata } from "next";
import { JsonLd } from "@/components/seo/json-ld";
import { WardrobeContent } from "@/components/wardrobe/wardrobe-content";
import { absoluteUrl } from "@/lib/seo";

export const metadata: Metadata = {
  title: "Clothes Wardrobe Storage and Virtual Fitting Room",
  description:
    "Organize clothes wardrobe assets in VFitly, store garment images, and reuse them in a virtual fitting room for faster AI try-on previews.",
  keywords: ["clothes wardrobe", "virtual fitting room", "clothes wardrobe storage", "wardrobe", "garment assets", "AI wardrobe"],
  alternates: {
    canonical: "/dashboard/wardrobe",
  },
  openGraph: {
    title: "Clothes Wardrobe Storage and Virtual Fitting Room | VFitly",
    description:
      "Save garment assets in a clothes wardrobe and use VFitly as a virtual fitting room for AI try-on creation.",
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
