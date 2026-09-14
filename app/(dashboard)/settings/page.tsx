import { SettingsContent } from "@/components/settings/settings-content";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";

export const metadata = {
  title: "VFitly Account Settings for AI Try-On Tools",
  description: "Manage your VFitly profile, account preferences, and subscription settings for AI virtual try-on, saved wardrobe assets, and outfit image and video creation.",
  keywords: [
    "AI virtual try-on","VFitly settings", "AI try-on account settings", "clothes changer settings", "wardrobe account settings"],
  alternates: {
    canonical: "/settings",
  },
};

export default async function SettingsPage() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/login");
  }

  return <SettingsContent />;
}
