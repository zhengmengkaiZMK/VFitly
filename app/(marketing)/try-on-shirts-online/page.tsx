import type { Metadata } from "next";
import { LandingPageView, createLandingMetadata } from "@/lib/seo-landings/create-landing";
import { tryOnShirtsOnline } from "@/lib/seo-landings/try-on-shirts-online";

export const metadata: Metadata = createLandingMetadata(tryOnShirtsOnline);

export default function TryOnShirtsOnlinePage() {
  return <LandingPageView content={tryOnShirtsOnline} />;
}
