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

import { BridalGuide } from "@/components/bridal-guide";
import { bridalFaqs } from "@/lib/bridal-content";
import { TryOnContent } from "@/components/try-on/try-on-content";

const homeTitle = "Try On Wedding Dresses at Home with AI | VFitly";
const homeDescription = "Try on wedding dresses at home with VFitly AI virtual try on. Upload your photo and a dress image to compare bridal looks and create a personal style shortlist.";

export const metadata: Metadata = {
  title: { absolute: homeTitle },
  description: homeDescription,
  keywords: [
    "AI virtual try-on","try on wedding dresses at home", "AI wedding dress try on", "virtual wedding dress try on", "bridal dress preview", "AI virtual fitting room", "VFitly"],
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
      "VFitly helps you try on wedding dresses at home with AI-generated previews from your photo and a dress image, plus a virtual wardrobe for saving bridal looks.",
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "USD",
    },
  },
  {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: bridalFaqs.map(({ question, answer }) => ({
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
          <section id="bridal-preview" aria-labelledby="bridal-preview-title" className="relative z-10 w-full scroll-mt-24">
            <TryOnContent bridal />
          </section>
          <HomeGridFeatures />
          <BridalGuide />
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
