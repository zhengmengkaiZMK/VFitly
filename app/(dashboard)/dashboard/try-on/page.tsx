import type { Metadata } from "next";
import { JsonLd } from "@/components/seo/json-ld";
import { TryOnContent } from "@/components/try-on/try-on-content";
import { absoluteUrl } from "@/lib/seo";

const tryOnTitle = "Virtual Fitting Room – AI Clothes Try-On | VFitly";
const tryOnDescription =
  "Explore VFitly's AI virtual fitting room. Upload your photo and clothing images, preview outfits online, and save your favorite looks to your virtual wardrobe.";

export const metadata: Metadata = {
  title: { absolute: tryOnTitle },
  description: tryOnDescription,
  keywords: [
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
    description: tryOnDescription,
  },
  twitter: {
    title: tryOnTitle,
    description: tryOnDescription,
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
