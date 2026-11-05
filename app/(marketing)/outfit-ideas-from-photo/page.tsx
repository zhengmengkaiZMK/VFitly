import type { Metadata } from "next";
import { LandingPageView, createLandingMetadata } from "@/lib/seo-landings/create-landing";
import { outfitIdeasFromPhoto } from "@/lib/seo-landings/outfit-ideas-from-photo";

export const metadata: Metadata = createLandingMetadata(outfitIdeasFromPhoto);

export default function OutfitIdeasFromPhotoPage() {
  return <LandingPageView content={outfitIdeasFromPhoto} />;
}
