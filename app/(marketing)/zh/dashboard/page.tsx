import { DashboardContent } from "@/components/dashboard/dashboard-content";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";

export const metadata = {
  title: "VFitly 仪表板 | AI 虚拟试衣项目管理",
  description: "在 VFitly 仪表板管理 AI 虚拟试衣、AI 换装、商品试穿、虚拟衣橱素材和账户使用情况。",
  keywords: ["VFitly 仪表板", "AI 虚拟试衣管理", "AI 换装项目", "虚拟衣橱素材"],
};

export default async function ZhDashboardPage() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/login");
  }

  return <DashboardContent />;
}
