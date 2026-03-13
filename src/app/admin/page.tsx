import { AdminPageClient } from "@/components/admin/admin-page-client";

export const metadata = {
  title: "Admin Dashboard",
  description: "Marketplace operations, moderation, and featured listing controls.",
};

export default function AdminPage() {
  return <AdminPageClient />;
}
