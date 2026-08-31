import { SignupForm } from "@/components/signup";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Signup - VFitly",
  description:
    "VFitly, short for Virtual Fitly, is an AI virtual try-on platform that helps users preview outfits, manage wardrobe items, and create realistic fashion visuals before buying or sharing a look.",
  openGraph: {
    images: ["https://www.vfitly.com/banner.png"],
  },
};

export default function SignupPage() {
  return <SignupForm />;
}
