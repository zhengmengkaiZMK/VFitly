import { Container } from "@/components/container";
import { Background } from "@/components/background";
import { Heading } from "@/components/heading";
import { Subheading } from "@/components/subheading";
import { PricingWithPayment } from "@/components/pricing-with-payment";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Pricing - VFitly",
  description:
    "VFitly, short for Virtual Fitly, is an AI virtual try-on platform that helps users preview outfits, manage wardrobe items, and create realistic fashion visuals before buying or sharing a look.",
  openGraph: {
    images: ["https://www.vfitly.com/banner.png"],
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
