import type { Metadata } from "next";
import { LandingPageView, createLandingMetadata } from "@/lib/seo-landings/create-landing";
import { tryOnShoesOnline } from "@/lib/seo-landings/try-on-shoes-online";

export const metadata: Metadata = createLandingMetadata(tryOnShoesOnline);

export default function TryOnShoesOnlinePage() {
  return <LandingPageView content={tryOnShoesOnline} />;
}
