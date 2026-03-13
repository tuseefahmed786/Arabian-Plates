import { SectionHeading } from "@/components/ui/section-heading";
import { SellWizard } from "@/components/sections/sell-wizard";

export const metadata = {
  title: "Sell Your Plate",
  description: "List your UAE number plate with a premium multi-step flow.",
};

export default function SellPage() {
  return (
    <div className="space-y-6">
      <SectionHeading
        title="Sell Your Plate"
        description="Create a verified listing with images, pricing, and transfer-ready details."
      />
      <SellWizard />
    </div>
  );
}
