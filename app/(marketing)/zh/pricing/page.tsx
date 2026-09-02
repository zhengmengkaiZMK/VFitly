import { Container } from "@/components/container";
import { Background } from "@/components/background";
import { Heading } from "@/components/heading";
import { Subheading } from "@/components/subheading";
import { Pricing } from "@/components/pricing";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "VFitly 价格 | AI 虚拟试衣套餐",
  description:
    "查看 VFitly AI 虚拟试衣、AI 换装、商品试穿和虚拟衣橱功能的价格方案，选择适合个人或团队的套餐。",
  keywords: ["VFitly 价格", "AI 虚拟试衣价格", "AI 换装套餐", "虚拟衣橱订阅"],
  alternates: {
    canonical: "/zh/pricing",
  },
  openGraph: {
    title: "VFitly 价格方案",
    description: "选择适合 AI 虚拟试衣、商品试穿和衣橱管理的 VFitly 套餐。",
    url: "https://www.vfitly.com/zh/pricing",
    images: ["https://www.vfitly.com/banner.png"],
  },
};

export default function ZhPricingPage() {
  return (
    <div className="relative overflow-hidden py-20 md:py-0">
      <Background />
      <Container className="flex flex-col items-center justify-between  pb-20">
        <div className="relative z-20 py-10 md:pt-40">
          <Heading as="h1">简单易用的定价方案</Heading>
          <Subheading className="text-center">
            VFitly 寓意 Virtual Fitly。选择适合您的方案，即可开始生成真实的 AI 试衣预览、穿搭对比和时尚展示视频。
          </Subheading>
        </div>
        <Pricing />
      </Container>
    </div>
  );
}
