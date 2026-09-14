import { SignupForm } from "@/components/signup";
import { DEFAULT_OG_IMAGE } from "@/lib/seo";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Sign Up for VFitly AI Try-On and Clothes Changer",
  description:
    "Create your VFitly account for AI virtual try-on. Preview outfits from your photos, generate try-on images and videos, and build your virtual wardrobe.",
  keywords: [
    "AI virtual try-on","VFitly signup", "AI try-on signup", "clothes changer account", "virtual wardrobe account"],
  alternates: {
    canonical: "/signup",
  },
  openGraph: {
    images: [DEFAULT_OG_IMAGE],
  },
};

export default function SignupPage() {
  return <SignupForm />;
}
