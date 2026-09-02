import { Background } from "@/components/background";
import { Metadata } from "next";
import { FeaturedTestimonials } from "@/components/featured-testimonials";
import { cn } from "@/lib/utils";
import { HorizontalGradient } from "@/components/horizontal-gradient";
import { ContactForm } from "@/components/contact";
import { DEFAULT_OG_IMAGE } from "@/lib/seo";

export const metadata: Metadata = {
  title: "Contact VFitly for AI Try-On and Clothes Changer Support",
  description:
    "Contact VFitly for help with AI try-on, clothes changer workflows, wardrobe assets, product try-on, billing, and account support.",
  keywords: ["contact VFitly", "AI try-on support", "clothes changer support", "wardrobe support", "product try-on help"],
  alternates: {
    canonical: "/contact",
  },
  openGraph: {
    title: "Contact VFitly for AI Try-On and Clothes Changer Support",
    description:
      "Get support for VFitly AI try-on, clothes changer, wardrobe, product try-on, and account questions.",
    images: [DEFAULT_OG_IMAGE],
  },
};

export default function PricingPage() {
  return (
    <div className="relative overflow-hidden py-20 md:py-0 px-4 md:px-20 bg-gray-50 dark:bg-black">
      <div className="w-full min-h-screen grid grid-cols-1 md:grid-cols-2 relative overflow-hidden">
        <Background />
        <ContactForm />
        <div className="relative w-full z-20 hidden md:flex border-l border-neutral-100 dark:border-neutral-900 overflow-hidden bg-gray-50 dark:bg-black items-center justify-center">
          <div className="max-w-sm mx-auto">
            <FeaturedTestimonials />
            <p
              className={cn(
                "font-semibold text-xl text-center dark:text-muted-dark text-muted"
              )}
            >
              VFitly helps users preview outfits with AI
            </p>
            <p
              className={cn(
                "font-normal text-base text-center text-neutral-500 dark:text-neutral-200 mt-8"
              )}
            >
              VFitly, short for Virtual Fitly, turns outfit photos into realistic virtual try-on previews and fashion visuals.
            </p>
          </div>
          <HorizontalGradient className="top-20" />
          <HorizontalGradient className="bottom-20" />
          <HorizontalGradient className="-right-80 transform rotate-90 inset-y-0 h-full scale-x-150" />
          <HorizontalGradient className="-left-80 transform rotate-90 inset-y-0 h-full scale-x-150" />
        </div>
      </div>
    </div>
  );
}
