import type { Metadata } from "next";
import { JsonLd } from "@/components/seo/json-ld";
import { ProductTryOnContent } from "@/components/try-on/product-try-on-content";
import { ProductLinkTryOnGuide } from "@/components/product-link-try-on-guide";
import { FaqList } from "@/components/faq-list";
import { productLinkTryOnFaqs } from "@/lib/product-link-try-on-content";
import { DEFAULT_OG_IMAGE, SITE_NAME, absoluteUrl } from "@/lib/seo";

const pageTitle = "Product Link Try On and AI Clothes Changer | VFitly";
const pageDescription =
  "Try on clothes from product links with VFitly. Paste a product URL, extract garment images, and use the AI clothes changer to preview each item on your photo.";

export const metadata: Metadata = {
  title: "Product Link Try On and AI Clothes Changer",
  description: pageDescription,
  keywords: [
    "product link try on", "product link try-on", "try on from product links", "extract product URL try on", "AI clothes changer", "clothes changer", "AI virtual try-on", "Amazon try on", "eBay try on", "Temu try on", "Shopify product try on", "SHEIN try on", "product try on", "virtual product try on"],
  alternates: {
    canonical: "/dashboard/product-try-on",
  },
  openGraph: {
    title: pageTitle,
    description: pageDescription,
    url: absoluteUrl("/dashboard/product-try-on"),
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

const productTryOnJsonLd = [
  {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: "VFitly Product Link Try-On",
    url: absoluteUrl("/dashboard/product-try-on"),
    applicationCategory: "LifestyleApplication",
    operatingSystem: "Web",
    description:
      "Product link try on for Amazon, eBay, Temu, Shopify, SHEIN and other shopping links. Extract the garment images from a product page, then try each one on a person photo with VFitly's AI virtual try-on.",
  },
  {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: productLinkTryOnFaqs.map(({ question, answer }) => ({
      "@type": "Question",
      name: question,
      acceptedAnswer: {
        "@type": "Answer",
        text: answer,
      },
    })),
  },
];

export default function DashboardProductTryOnPage() {
  return (
    <>
      <JsonLd data={productTryOnJsonLd} />
      <ProductTryOnContent />
      <div className="px-4 pb-16">
        <ProductLinkTryOnGuide />
        <FaqList items={productLinkTryOnFaqs} />
      </div>
    </>
  );
}
