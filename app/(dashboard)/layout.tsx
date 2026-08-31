import { NavBar } from "@/components/navbar";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="relative overflow-hidden">
      <NavBar />
      <main className="pt-20">{children}</main>
    </div>
  );
}
