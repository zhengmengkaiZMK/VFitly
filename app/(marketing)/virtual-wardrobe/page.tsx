import type { Metadata } from "next";
import { LandingPageView, createLandingMetadata } from "@/lib/seo-landings/create-landing";
import { virtualWardrobe } from "@/lib/seo-landings/virtual-wardrobe";

export const metadata: Metadata = createLandingMetadata(virtualWardrobe);

export default function VirtualWardrobePage() {
  return <LandingPageView content={virtualWardrobe} />;
}
