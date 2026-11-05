import type { Metadata } from "next";
import { LandingPageView, createLandingMetadata } from "@/lib/seo-landings/create-landing";
import { aiOutfitGenerator } from "@/lib/seo-landings/ai-outfit-generator";

export const metadata: Metadata = createLandingMetadata(aiOutfitGenerator);

export default function AiOutfitGeneratorPage() {
  return <LandingPageView content={aiOutfitGenerator} />;
}
