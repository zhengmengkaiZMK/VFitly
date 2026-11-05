import type { Metadata } from "next";
import { LandingPageView, createLandingMetadata } from "@/lib/seo-landings/create-landing";
import { tryOnClothesFromLink } from "@/lib/seo-landings/try-on-clothes-from-link";

export const metadata: Metadata = createLandingMetadata(tryOnClothesFromLink);

export default function TryOnClothesFromLinkPage() {
  return <LandingPageView content={tryOnClothesFromLink} />;
}
