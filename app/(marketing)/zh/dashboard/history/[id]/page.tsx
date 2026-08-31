import { HistoryDetail } from "@/components/pain-point-history/history-detail";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "分析详情 - VFitly",
  description: "查看痛点分析详细结果",
};

export default async function ZhHistoryDetailPage({ 
  params 
}: { 
  params: Promise<{ id: string }> 
}) {
  const { id } = await params;
  return <HistoryDetail id={id} />;
}
