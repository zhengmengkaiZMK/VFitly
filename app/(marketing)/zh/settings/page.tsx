import { SettingsContent } from "@/components/settings/settings-content";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";

export const metadata = {
  title: "VFitly 账户设置 | AI 虚拟试衣账户管理",
  description: "管理 VFitly AI 虚拟试衣账户资料、头像、订阅偏好、虚拟衣橱设置和 AI 换装使用配置。",
  keywords: ["VFitly 账户设置", "AI 虚拟试衣账户", "AI 换装设置", "虚拟衣橱设置"],
};

export default async function ZhSettingsPage() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/login");
  }

  return <SettingsContent />;
}
