import { Container } from "@/components/container";
import { Background } from "@/components/background";
import { Heading } from "@/components/heading";
import { Subheading } from "@/components/subheading";
import { Pricing } from "@/components/pricing";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "价格 - VFitly",
  description:
    "VFitly 寓意 Virtual Fitly，是一个 AI 虚拟试衣平台，帮助用户预览穿搭效果、管理衣橱单品，并在购买或分享前生成真实自然的时尚视觉内容。",
  openGraph: {
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
