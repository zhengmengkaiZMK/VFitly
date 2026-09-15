import type { Metadata } from "next";
import { Container } from "@/components/container";
import { Background } from "@/components/background";
import { DEFAULT_OG_IMAGE, SITE_NAME, SITE_URL, jsonLd } from "@/lib/seo";
import { 
  HomeHero, 
  HomeGridFeatures, 
  HomeTestimonials, 
  HomeCTA 
} from "@/components/home-sections";

import { VirtualTryOnGuide } from "@/components/virtual-try-on-guide";
import { virtualTryOnFaqs } from "@/lib/virtual-try-on-content";
import { TryOnContent } from "@/components/try-on/try-on-content";

const homeTitle = "Virtual Try On Clothes: AI Outfit Preview | VFitly";
const homeDescription = "Virtual try on clothes from your own photo with VFitly. Upload a picture of yourself and preview a product image, a shopping link or a wardrobe item.";

export const metadata: Metadata = {
  title: { absolute: homeTitle },
  description: homeDescription,
  keywords: [
    "virtual try on",
    "virtual try on clothes",
    "AI virtual try on",
    "try on clothes online",
    "virtual outfit preview",
    "AI clothes changer",
    "virtual fitting room",
    "outfit generator",
    "VFitly",
  ],
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: homeTitle,
    description: homeDescription,
    url: SITE_URL,
    siteName: SITE_NAME,
    images: [DEFAULT_OG_IMAGE],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: homeTitle,
    description: homeDescription,
    images: [DEFAULT_OG_IMAGE],
  },
};

const homeJsonLd = [
  {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: "VFitly",
    url: SITE_URL,
    applicationCategory: "LifestyleApplication",
    operatingSystem: "Web",
    description:
      "VFitly is a virtual try on tool for clothes. Upload a photo of yourself and a garment image, or pull clothing from a product link, and generate AI outfit previews and try-on videos.",
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "USD",
    },
  },
  {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: virtualTryOnFaqs.map(({ question, answer }) => ({
      "@type": "Question",
      name: question,
      acceptedAnswer: {
        "@type": "Answer",
        text: answer,
      },
    })),
  },
];

export default function Home() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={jsonLd(homeJsonLd)} />
      <div className="relative">
        <div className="absolute inset-0 h-full w-full overflow-hidden ">
          <Background />
        </div>
        <Container className="flex flex-col items-center">
          <HomeHero />
          <section id="virtual-try-on" aria-labelledby="virtual-try-on-title" className="relative z-10 w-full scroll-mt-24">
            <TryOnContent embedded />
          </section>
          <VirtualTryOnGuide />
          <HomeGridFeatures />
          <HomeTestimonials />
        </Container>
        <div className="relative">
          <div className="absolute inset-0 h-full w-full overflow-hidden">
            <Background />
          </div>
          <HomeCTA />
        </div>
      </div>
    </>
  );
}
