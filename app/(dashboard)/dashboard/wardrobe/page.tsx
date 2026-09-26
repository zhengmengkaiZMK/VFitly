import type { Metadata } from "next";
import { JsonLd } from "@/components/seo/json-ld";
import { WardrobeContent } from "@/components/wardrobe/wardrobe-content";
import { VirtualWardrobeGuide } from "@/components/virtual-wardrobe-guide";
import { FaqList } from "@/components/faq-list";
import { virtualWardrobeFaqs } from "@/lib/virtual-wardrobe-content";
import { DEFAULT_OG_IMAGE, SITE_NAME, absoluteUrl } from "@/lib/seo";

const pageTitle = "Virtual Wardrobe: Store Clothes for AI Try-On | VFitly";
const pageDescription =
  "Build a virtual wardrobe from your own clothing images. Organize garments by category and reuse them for AI virtual try-on, outfit previews and try-on videos.";

export const metadata: Metadata = {
  title: "Virtual Wardrobe: Store Clothes for AI Try-On",
  description: pageDescription,
  keywords: [
    "virtual wardrobe", "clothes wardrobe", "wardrobe organizer", "virtual closet", "clothes wardrobe storage", "wardrobe", "garment assets", "AI virtual try-on", "virtual fitting room", "AI wardrobe"],
  alternates: {
    canonical: "/dashboard/wardrobe",
  },
  openGraph: {
    title: pageTitle,
    description: pageDescription,
    url: absoluteUrl("/dashboard/wardrobe"),
    siteName: SITE_NAME,
    images: [DEFAULT_OG_IMAGE],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: pageTitle,
    description: pageDescription,
    images: [DEFAULT_OG_IMAGE],
  },
};

const wardrobeJsonLd = [
  {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: "VFitly Virtual Wardrobe",
    url: absoluteUrl("/dashboard/wardrobe"),
    applicationCategory: "LifestyleApplication",
    operatingSystem: "Web",
    description:
      "A virtual wardrobe for garment images: store clothing photos with categories, colors and tags, then reuse them for AI virtual try-on and outfit previews.",
  },
  {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: virtualWardrobeFaqs.map(({ question, answer }) => ({
      "@type": "Question",
      name: question,
      acceptedAnswer: {
        "@type": "Answer",
        text: answer,
      },
    })),
  },
];

export default function DashboardWardrobePage() {
  return (
    <>
      <JsonLd data={wardrobeJsonLd} />
      <WardrobeContent />
      <div className="px-4 pb-16">
        <VirtualWardrobeGuide />
        <FaqList items={virtualWardrobeFaqs} />
      </div>
    </>
  );
}
