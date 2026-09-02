import { LoginForm } from "@/components/login";
import { DEFAULT_OG_IMAGE } from "@/lib/seo";
import { Metadata } from "next";
import { Suspense } from "react";

export const metadata: Metadata = {
  title: "Login to VFitly AI Try-On and Wardrobe Tools",
  description:
    "Log in to VFitly to access AI try-on, clothes changer previews, product try-on, virtual wardrobe assets, and account settings.",
  keywords: ["VFitly login", "AI try-on login", "clothes changer account", "virtual wardrobe login"],
  alternates: {
    canonical: "/login",
  },
  openGraph: {
    images: [DEFAULT_OG_IMAGE],
  },
};

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="min-h-screen" />}>
      <LoginForm />
    </Suspense>
  );
}
