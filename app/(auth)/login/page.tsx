import { LoginForm } from "@/components/login";
import { Metadata } from "next";
import { Suspense } from "react";

export const metadata: Metadata = {
  title: "Login - VFitly",
  description:
    "VFitly, short for Virtual Fitly, is an AI virtual try-on platform that helps users preview outfits, manage wardrobe items, and create realistic fashion visuals before buying or sharing a look.",
  openGraph: {
    images: ["https://www.vfitly.com/banner.png"],
  },
};

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="min-h-screen" />}>
      <LoginForm />
    </Suspense>
  );
}
