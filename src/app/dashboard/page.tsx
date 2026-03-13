import { DashboardPageClient } from "@/components/dashboard/dashboard-page-client";

export const metadata = {
  title: "User Dashboard",
  description: "Manage listings, saved items, offers, and account settings.",
};

export default function DashboardPage() {
  return <DashboardPageClient />;
}
