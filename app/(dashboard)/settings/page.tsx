import { SettingsContent } from "@/components/settings/settings-content";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";

export const metadata = {
  title: "VFitly Account Settings for AI Try-On Tools",
  description: "Manage VFitly account settings for AI try-on, clothes changer workflows, wardrobe storage, profile images, and subscription preferences.",
  keywords: ["VFitly settings", "AI try-on account settings", "clothes changer settings", "wardrobe account settings"],
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
