import { LoginForm } from "@/components/login";
import { DEFAULT_OG_IMAGE } from "@/lib/seo";
import { Metadata } from "next";
import { Suspense } from "react";

export const metadata: Metadata = {
  title: "Login to VFitly AI Try-On and Wardrobe Tools",
  description:
    "Log in to VFitly to access AI virtual try-on, generate outfit images and videos, reuse saved garments, and review your creation history.",
  keywords: [
    "AI virtual try-on","VFitly login", "AI try-on login", "clothes changer account", "virtual wardrobe login"],
  alternates: {
    canonical: "/login",
  },
  // 纯登录表单，没有可供检索的内容。保持可抓取(follow)但不再进入索引。
  // 如需恢复收录（例如为了品牌词 "VFitly login" 的导航搜索），删掉下面这一段即可。
  robots: {
    index: false,
    follow: true,
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
