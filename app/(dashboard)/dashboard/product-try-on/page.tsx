import type { Metadata } from "next";
import { JsonLd } from "@/components/seo/json-ld";
import { ProductTryOnContent } from "@/components/try-on/product-try-on-content";
import { absoluteUrl } from "@/lib/seo";

export const metadata: Metadata = {
  title: "Product Link Try-On and AI Clothes Changer",
  description:
    "Use product links to find garment images for VFitly AI virtual try-on. Preview selected clothing on your photo and create try-on images and videos.",
  keywords: [
    "AI virtual try-on","Amazon try on", "eBay try on", "Temu try on", "Shopify product try on", "SHEIN try on", "try-on from product links", "extract product URL try on", "clothes changer", "AI clothes changer", "product try on", "virtual product try on"],
  alternates: {
    canonical: "/dashboard/product-try-on",
  },
  openGraph: {
    title: "Product Link Try-On and AI Clothes Changer | VFitly",
    description:
      "Use product links to find garment images for VFitly AI virtual try-on. Preview selected clothing on your photo and create try-on images and videos.",
  },
};

const productTryOnJsonLd = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: "VFitly Product Link Try-On",
  url: absoluteUrl("/dashboard/product-try-on"),
  applicationCategory: "LifestyleApplication",
  operatingSystem: "Web",
  description:
    "Extract product URLs from Amazon, eBay, Temu, Shopify, SHEIN and other shopping links for try-on, then use VFitly's AI clothes changer to preview items on a person image.",
};

export default function DashboardProductTryOnPage() {
  return (
    <>
      <JsonLd data={productTryOnJsonLd} />
      <ProductTryOnContent />
    </>
  );
}
