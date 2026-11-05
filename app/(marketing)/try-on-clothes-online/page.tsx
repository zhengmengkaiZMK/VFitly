import type { Metadata } from "next";
import { LandingPageView, createLandingMetadata } from "@/lib/seo-landings/create-landing";
import { tryOnClothesOnline } from "@/lib/seo-landings/try-on-clothes-online";

export const metadata: Metadata = createLandingMetadata(tryOnClothesOnline);

export default function TryOnClothesOnlinePage() {
  return <LandingPageView content={tryOnClothesOnline} />;
}
