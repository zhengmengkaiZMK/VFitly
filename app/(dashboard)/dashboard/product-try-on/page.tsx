import type { Metadata } from "next";
import { JsonLd } from "@/components/seo/json-ld";
import { ProductTryOnContent } from "@/components/try-on/product-try-on-content";
import { absoluteUrl } from "@/lib/seo";

export const metadata: Metadata = {
  title: "Product Link Try-On and AI Clothes Changer",
  description:
    "Try on products from Amazon, eBay, Temu, Shopify, SHEIN and other shopping links with VFitly, extract a product URL for virtual try on, and use an AI clothes changer to preview items on your photo.",
  keywords: ["Amazon try on", "eBay try on", "Temu try on", "Shopify product try on", "SHEIN try on", "try-on from product links", "extract product URL try on", "clothes changer", "AI clothes changer", "product try on", "virtual product try on"],
  alternates: {
    canonical: "/dashboard/product-try-on",
  },
  openGraph: {
    title: "Product Link Try-On and AI Clothes Changer | VFitly",
    description:
      "Extract product images from Amazon, eBay, Temu, Shopify, SHEIN and other shopping URLs, then preview them with VFitly's AI clothes changer and virtual try-on workflow.",
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
