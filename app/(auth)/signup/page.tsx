import { SignupForm } from "@/components/signup";
import { DEFAULT_OG_IMAGE } from "@/lib/seo";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Sign Up for VFitly AI Try-On and Clothes Changer",
  description:
    "Create a VFitly account to use AI try-on, clothes changer previews, product link try-on, virtual wardrobe storage, and fashion image tools.",
  keywords: ["VFitly signup", "AI try-on signup", "clothes changer account", "virtual wardrobe account"],
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
