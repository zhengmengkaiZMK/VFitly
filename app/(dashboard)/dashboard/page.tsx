import { DashboardContent } from "@/components/dashboard/dashboard-content";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";

export const metadata = {
  title: "VFitly Dashboard for AI Try-On Projects",
  description: "Manage VFitly AI try-on projects, clothes changer activity, wardrobe assets, credits, and account usage from one dashboard.",
  keywords: ["VFitly dashboard", "AI try-on dashboard", "clothes changer projects", "wardrobe assets dashboard"],
  alternates: {
    canonical: "/dashboard",
  },
};

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/login");
  }

  return <DashboardContent />;
}
