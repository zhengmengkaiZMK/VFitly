import type { Metadata } from "next";
import { LandingPageView, createLandingMetadata } from "@/lib/seo-landings/create-landing";
import { aiClothesChanger } from "@/lib/seo-landings/ai-clothes-changer";

export const metadata: Metadata = createLandingMetadata(aiClothesChanger);

export default function AiClothesChangerPage() {
  return <LandingPageView content={aiClothesChanger} />;
}
