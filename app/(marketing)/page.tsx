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

// 首页正文中的落地页内链区：每个 SEO 落地页都从首页获得一条描述性锚文本内链。
const homeExploreLinks = [
  { href: "/ai-clothes-changer", label: "AI clothes changer", description: "Change outfits on your photo, one garment at a time." },
  { href: "/ai-outfit-generator", label: "AI outfit generator", description: "Generate complete looks from tops, bottoms and shoes." },
  { href: "/try-on-clothes-online", label: "Try on clothes online", description: "The full try-on workflow, free to start." },
  { href: "/try-on-wedding-dresses", label: "Virtual wedding dress try-on", description: "Preview bridal gowns at home before the salon." },
  { href: "/virtual-fitting-room", label: "Virtual fitting room", description: "Compare garments side by side in your browser." },
  { href: "/virtual-wardrobe", label: "Virtual wardrobe", description: "Save clothes and plan outfits from your own closet." },
];

const homeTitle = "AI Virtual Try On Clothes Online | VFitly";
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
          <section aria-labelledby="explore-vfitly" className="relative z-10 w-full py-12 md:py-16">
            <h2
              id="explore-vfitly"
              className="text-center text-2xl font-semibold tracking-[-0.015em] text-neutral-950 dark:text-white md:text-3xl"
            >
              Explore VFitly
            </h2>
            <div className="mx-auto mt-8 grid w-full max-w-5xl grid-cols-1 gap-4 px-4 sm:grid-cols-2 lg:grid-cols-3">
              {homeExploreLinks.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  className="group rounded-2xl border border-neutral-200 bg-white/70 p-5 shadow-sm backdrop-blur transition hover:border-neutral-400 dark:border-neutral-800 dark:bg-neutral-900/60 dark:hover:border-neutral-600"
                >
                  <span className="font-semibold text-neutral-900 group-hover:underline dark:text-white">{link.label}</span>
                  <p className="mt-1 text-sm leading-6 text-neutral-600 dark:text-neutral-400">{link.description}</p>
                </a>
              ))}
            </div>
          </section>
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
