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

const homeTitle = "Try On Wedding Dresses at Home with AI | VFitly";
const homeDescription = "Explore wedding dresses and everyday outfits with VFitly AI virtual try-on. Upload your photo and clothing images to generate outfit previews and try-on videos.";

export const metadata: Metadata = {
  title: { absolute: homeTitle },
  description: "Explore wedding dresses and everyday outfits with VFitly AI virtual try-on. Upload your photo and clothing images to generate outfit previews and try-on videos.",
  keywords: [
    "AI virtual try-on","try on wedding dresses at home", "AI wedding dress try on", "virtual wedding dress try on", "bridal dress preview", "AI virtual fitting room", "VFitly"],
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: homeTitle,
    description: "Explore wedding dresses and everyday outfits with VFitly AI virtual try-on. Upload your photo and clothing images to generate outfit previews and try-on videos.",
    url: SITE_URL,
    siteName: SITE_NAME,
    images: [DEFAULT_OG_IMAGE],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: homeTitle,
    description: "Explore wedding dresses and everyday outfits with VFitly AI virtual try-on. Upload your photo and clothing images to generate outfit previews and try-on videos.",
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
    mainEntity: [
      {
        "@type": "Question",
        name: "How can I try on wedding dresses at home with AI?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Upload a clear photo of yourself and an image of a wedding dress to generate a virtual bridal preview. Compare dress ideas and save your favorite looks before booking an in-person fitting.",
        },
      },
      {
        "@type": "Question",
        name: "Does an AI wedding dress preview replace a real fitting?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "No. VFitly creates AI visual previews, not measurements or fit guarantees. It does not ship dresses to your home. Check sizing, fabric, comfort and alterations with a bridal retailer or tailor.",
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
