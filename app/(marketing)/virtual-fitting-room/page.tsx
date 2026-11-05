import type { Metadata } from "next";
import { LandingPageView, createLandingMetadata } from "@/lib/seo-landings/create-landing";
import { virtualFittingRoom } from "@/lib/seo-landings/virtual-fitting-room";

export const metadata: Metadata = createLandingMetadata(virtualFittingRoom);

export default function VirtualFittingRoomPage() {
  return <LandingPageView content={virtualFittingRoom} />;
}
