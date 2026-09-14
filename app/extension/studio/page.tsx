import type { Metadata } from "next";
import ExtensionStudio from "./studio";

export const metadata: Metadata = {
  keywords: ["AI virtual try-on"],
  description: "Use the VFitly extension studio for AI virtual try-on. Select captured product images, use your saved model photo, and generate or revisit outfit previews.",
  title: "Extension Studio | VFitly",
  robots: { index: false, follow: false },
  referrer: "no-referrer",
};

export default function ExtensionStudioPage() {
  return <ExtensionStudio />;
}
