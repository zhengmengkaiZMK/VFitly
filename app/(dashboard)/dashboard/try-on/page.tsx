import type { Metadata } from "next";
import { JsonLd } from "@/components/seo/json-ld";
import { TryOnContent } from "@/components/try-on/try-on-content";
import { absoluteUrl } from "@/lib/seo";

export const metadata: Metadata = {
  title: "AI Try On for Clothes, Glasses and Hairstyles",
  description:
    "Use VFitly to try on glasses, try on clothes, test hairstyles, and preview outfits with a virtual try on and try it on AI experience.",
  keywords: ["try on glasses", "try on clothes", "try it on ai", "virtual try on", "try on", "try on hairstyles", "AI try on"],
  alternates: {
    canonical: "/dashboard/try-on",
  },
  openGraph: {
    title: "AI Try On for Clothes, Glasses and Hairstyles | VFitly",
    description:
      "Create virtual try-on previews for clothes, glasses, outfits, and hairstyles with VFitly's AI try on tools.",
  },
};

const tryOnJsonLd = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: "VFitly AI Try On",
  url: absoluteUrl("/dashboard/try-on"),
  applicationCategory: "LifestyleApplication",
  operatingSystem: "Web",
  description:
    "Try on glasses, clothes, hairstyles, and outfits with VFitly's virtual try on and try it on AI experience.",
};

export default function DashboardTryOnPage() {
  return (
    <>
      <JsonLd data={tryOnJsonLd} />
      <TryOnContent />
    </>
  );
}
