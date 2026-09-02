import { HistoryDetail } from "@/components/pain-point-history/history-detail";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "VFitly 试衣详情 | AI 虚拟试衣生成记录",
  description: "查看 VFitly AI 虚拟试衣、AI 换装、商品试穿和虚拟衣橱生成结果的详细记录。",
  keywords: ["VFitly 试衣详情", "AI 虚拟试衣记录", "AI 换装结果", "虚拟衣橱生成记录"],
};

export default async function ZhHistoryDetailPage({ 
  params 
}: { 
  params: Promise<{ id: string }> 
}) {
  const { id } = await params;
  return <HistoryDetail id={id} />;
}
