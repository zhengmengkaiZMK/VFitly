import { DashboardContent } from "@/components/dashboard/dashboard-content";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";

export const metadata = {
  title: "VFitly Dashboard for AI Try-On Projects",
  description: "Manage your VFitly AI virtual try-on workspace. View account usage and credits, access saved garments, and start creating outfit images and try-on videos.",
  keywords: [
    "AI virtual try-on","VFitly dashboard", "AI try-on dashboard", "clothes changer projects", "wardrobe assets dashboard"],
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
