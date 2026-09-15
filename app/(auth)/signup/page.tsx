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
  // 纯注册表单，没有可供检索的内容。保持可抓取(follow)但不再进入索引。
  // 如需恢复收录，删掉下面这一段即可。
  robots: {
    index: false,
    follow: true,
  },
  openGraph: {
    images: [DEFAULT_OG_IMAGE],
  },
};

export default function SignupPage() {
  return <SignupForm />;
}
