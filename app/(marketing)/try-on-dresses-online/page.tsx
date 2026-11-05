import type { Metadata } from "next";
import { LandingPageView, createLandingMetadata } from "@/lib/seo-landings/create-landing";
import { tryOnDressesOnline } from "@/lib/seo-landings/try-on-dresses-online";

export const metadata: Metadata = createLandingMetadata(tryOnDressesOnline);

export default function TryOnDressesOnlinePage() {
  return <LandingPageView content={tryOnDressesOnline} />;
}
