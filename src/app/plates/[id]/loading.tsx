import { SkeletonCard } from "@/components/ui/skeleton-card";

export default function PlateLoading() {
  return (
    <div className="grid gap-4 md:grid-cols-2">
      <SkeletonCard />
      <SkeletonCard />
    </div>
  );
}
