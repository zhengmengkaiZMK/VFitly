import type { Metadata } from "next";
import { LandingPageView, createLandingMetadata } from "@/lib/seo-landings/create-landing";
import { tryOnWeddingDresses } from "@/lib/seo-landings/try-on-wedding-dresses";

export const metadata: Metadata = createLandingMetadata(tryOnWeddingDresses);

export default function TryOnWeddingDressesPage() {
  return <LandingPageView content={tryOnWeddingDresses} />;
}
