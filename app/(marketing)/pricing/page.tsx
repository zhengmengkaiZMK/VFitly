import { Container } from "@/components/container";
import { Background } from "@/components/background";
import { Heading } from "@/components/heading";
import { Subheading } from "@/components/subheading";
import { PricingWithPayment } from "@/components/pricing-with-payment";
import { Metadata } from "next";
import { DEFAULT_OG_IMAGE } from "@/lib/seo";

export const metadata: Metadata = {
  title: "AI Try-On Pricing for Clothes Changer and Wardrobe Tools",
  description:
    "Compare VFitly plans and credits for AI virtual try-on. Choose an option for generating outfit images and try-on videos, with clear pricing and usage limits.",
  keywords: [
    "AI virtual try-on","AI try-on pricing", "clothes changer pricing", "virtual try on plans", "VFitly pricing", "wardrobe tools pricing"],
  alternates: {
    canonical: "/pricing",
  },
  openGraph: {
    title: "AI Try-On Pricing for Clothes Changer and Wardrobe Tools | VFitly",
    description:
      "Compare VFitly plans and credits for AI virtual try-on. Choose an option for generating outfit images and try-on videos, with clear pricing and usage limits.",
    images: [DEFAULT_OG_IMAGE],
  },
};

export default function PricingPage() {
  return (
    <div className="relative overflow-hidden py-20 md:py-0">
      <Background />
      <Container className="flex flex-col items-center justify-between  pb-20">
        <div className="relative z-20 py-10 md:pt-40">
          <Heading as="h1">Simple pricing for your ease</Heading>
          <Subheading className="text-center">
            VFitly means Virtual Fitly. Choose a plan that fits your needs and start creating realistic AI try-on previews, outfit comparisons, and fashion showcase videos instantly.
          </Subheading>
        </div>
        <PricingWithPayment />
      </Container>
    </div>
  );
}
