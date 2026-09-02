import { Background } from "@/components/background";
import { Metadata } from "next";
import { FeaturedTestimonials } from "@/components/featured-testimonials";
import { cn } from "@/lib/utils";
import { HorizontalGradient } from "@/components/horizontal-gradient";
import { ContactForm } from "@/components/contact";

export const metadata: Metadata = {
  title: "联系 VFitly | AI 虚拟试衣支持",
  description:
    "联系 VFitly 团队，获取 AI 虚拟试衣、AI 换装、商品试穿和虚拟衣橱相关支持、合作或反馈帮助。",
  keywords: ["联系 VFitly", "AI 虚拟试衣支持", "AI 换装客服", "VFitly 合作"],
  alternates: {
    canonical: "/zh/contact",
  },
  openGraph: {
    title: "联系 VFitly",
    description: "获取 VFitly AI 虚拟试衣平台的支持与合作信息。",
    url: "https://www.vfitly.com/zh/contact",
    images: ["https://www.vfitly.com/banner.png"],
  },
};

export default function ZhContactPage() {
  return (
    <div className="relative overflow-hidden py-20 md:py-0 px-4 md:px-20 bg-gray-50 dark:bg-black">
      <div className="w-full min-h-screen grid grid-cols-1 md:grid-cols-2 relative overflow-hidden">
        <Background />
        <ContactForm />
        <div className="relative w-full z-20 hidden md:flex border-l border-neutral-100 dark:border-neutral-900 overflow-hidden bg-gray-50 dark:bg-black items-center justify-center">
          <div className="max-w-sm mx-auto">
            <FeaturedTestimonials />
            <p
              className={cn(
                "font-semibold text-xl text-center dark:text-muted-dark text-muted"
              )}
            >
              VFitly 已被数千用户使用
            </p>
            <p
              className={cn(
                "font-normal text-base text-center text-neutral-500 dark:text-neutral-200 mt-8"
              )}
            >
              VFitly 寓意 Virtual Fitly，可将人物照与服装图生成真实自然的 AI 试衣预览。
            </p>
          </div>
          <HorizontalGradient className="top-20" />
          <HorizontalGradient className="bottom-20" />
          <HorizontalGradient className="-right-80 transform rotate-90 inset-y-0 h-full scale-x-150" />
          <HorizontalGradient className="-left-80 transform rotate-90 inset-y-0 h-full scale-x-150" />
        </div>
      </div>
    </div>
  );
}
