import type { Metadata } from "next";
import { JsonLd } from "@/components/seo/json-ld";
import { TryOnContent } from "@/components/try-on/try-on-content";
import { absoluteUrl } from "@/lib/seo";

const tryOnTitle = "Virtual Fitting Room – AI Clothes Try-On | VFitly";
const tryOnDescription =
  "Use VFitly AI virtual try-on to preview outfits from your photo and garment images. Reuse wardrobe items, generate try-on images, and turn results into videos.";

export const metadata: Metadata = {
  title: { absolute: tryOnTitle },
  description: "Use VFitly AI virtual try-on to preview outfits from your photo and garment images. Reuse wardrobe items, generate try-on images, and turn results into videos.",
  keywords: [
    "AI virtual try-on",
    "virtual fitting room",
    "AI virtual fitting room",
    "online virtual fitting room",
    "virtual fitting room for clothes",
    "AI clothes try on",
    "virtual outfit try on",
    "VFitly",
  ],
  alternates: {
    canonical: "/dashboard/try-on",
  },
  openGraph: {
    title: tryOnTitle,
    description: "Use VFitly AI virtual try-on to preview outfits from your photo and garment images. Reuse wardrobe items, generate try-on images, and turn results into videos.",
  },
  twitter: {
    title: tryOnTitle,
    description: "Use VFitly AI virtual try-on to preview outfits from your photo and garment images. Reuse wardrobe items, generate try-on images, and turn results into videos.",
  },
};

const tryOnJsonLd = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: "VFitly AI Virtual Fitting Room",
  url: absoluteUrl("/dashboard/try-on"),
  applicationCategory: "LifestyleApplication",
  operatingSystem: "Web",
  description: tryOnDescription,
};

export default function DashboardTryOnPage() {
  return (
    <>
      <JsonLd data={tryOnJsonLd} />
      <TryOnContent />
    </>
  );
}
