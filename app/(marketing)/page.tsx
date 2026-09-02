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

export const metadata: Metadata = {
  title: "VFitly Try On, Clothes Changer AI and Virtual Wardrobe",
  description:
    "VFitly helps you try on outfits, use a clothes changer AI free preview, try on glasses, and manage wardrobe assets for realistic virtual styling.",
  keywords: ["VFitly", "try on", "clothes changer", "clothes changer ai", "clothes changer ai free", "try on glasses", "wardrobe", "virtual wardrobe"],
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "VFitly Try On, Clothes Changer AI and Virtual Wardrobe",
    description:
      "Try on clothes and glasses with VFitly's clothes changer AI, then save looks and garment assets in your virtual wardrobe.",
    url: SITE_URL,
    siteName: SITE_NAME,
    images: [DEFAULT_OG_IMAGE],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "VFitly Try On, Clothes Changer AI and Virtual Wardrobe",
    description:
      "Use VFitly for AI try on, clothes changer AI free previews, try on glasses, and wardrobe organization.",
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
      "VFitly is an AI try-on and clothes changer web app for clothes, glasses, outfits, and wardrobe management.",
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "USD",
    },
  },
  {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: "What can I try on with VFitly?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "VFitly supports AI try-on previews for clothes, glasses, outfit ideas, and wardrobe-based garment assets.",
        },
      },
      {
        "@type": "Question",
        name: "Does VFitly include a clothes changer AI workflow?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Yes. VFitly provides a clothes changer AI workflow that helps preview clothing items on a person image before buying or sharing a look.",
        },
      },
    ],
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
